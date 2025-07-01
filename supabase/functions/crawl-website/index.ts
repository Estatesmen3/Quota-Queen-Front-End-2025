
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Custom implementation since we can't import the Firecrawl package
async function crawlUrl(url, apiKey) {
  console.log(`Making request to Firecrawl API for URL: ${url}`);
  
  try {
    const response = await fetch("https://api.firecrawl.dev/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        limit: 10, // Increased limit to get more content
        scrapeOptions: {
          formats: ['markdown', 'html'],
          includeMetadata: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firecrawl API error: ${response.status}`, errorText);
      return { 
        success: false, 
        error: `Firecrawl API returned ${response.status}: ${errorText}` 
      };
    }

    const data = await response.json();
    
    // Process and generate a summary if there's content
    if (data.success && data.data && data.data.length > 0) {
      try {
        // Extract content from the first page as main content
        const mainContent = data.data[0].content?.markdown || data.data[0].content?.html || '';
        
        // Create a summary by extracting key information
        let summary = '';
        
        // If there's markdown content, extract important parts
        if (data.data[0].content?.markdown) {
          const markdown = data.data[0].content.markdown;
          
          // Extract headings and first paragraph after each heading
          const headings = markdown.match(/#+\s+(.*)/g) || [];
          const paragraphs = markdown.split(/\n\n+/);
          
          // Start with the first paragraph if it exists as an intro
          if (paragraphs.length > 0) {
            summary += paragraphs[0] + '\n\n';
          }
          
          // Add important headings and their content
          let headingCount = 0;
          for (const heading of headings) {
            if (headingCount < 5) { // Limit to 5 most important headings
              const headingText = heading.replace(/#+\s+/, '');
              const headingIndex = paragraphs.findIndex(p => p.includes(headingText));
              
              if (headingIndex !== -1 && headingIndex + 1 < paragraphs.length) {
                summary += `## ${headingText}\n\n`;
                summary += paragraphs[headingIndex + 1] + '\n\n';
                headingCount++;
              }
            }
          }
        } else if (data.data[0].content?.html) {
          // Extract text from HTML for summary
          const htmlText = data.data[0].content.html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]*>/g, '\n')
            .replace(/\n+/g, '\n').trim();
          
          // Take first 1000 characters as summary
          summary = htmlText.substring(0, 1000) + '...';
        }
        
        // Add metadata to the response
        data.summary = summary;
        data.title = data.data[0].metadata?.title || '';
        data.description = data.data[0].metadata?.description || '';
      } catch (summaryError) {
        console.error("Error generating summary:", summaryError);
        // Continue without summary if error occurs
      }
    }
    
    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error("Error during Firecrawl API request:", error);
    return {
      success: false,
      error: error.message || "Failed to connect to Firecrawl API"
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl API key is not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log(`Starting crawl for URL: ${url}`);

    const crawlResponse = await crawlUrl(url, apiKey);

    if (!crawlResponse.success) {
      return new Response(
        JSON.stringify({ success: false, error: crawlResponse.error || "Failed to crawl website" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a database entry for this resource if needed
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Store the crawled content in a new table
    const { error: storageError } = await supabaseClient
      .from('resource_content')
      .upsert({
        url: url,
        content: crawlResponse,
        created_at: new Date(),
        updated_at: new Date()
      });

    if (storageError) {
      console.error('Error storing crawled content:', storageError);
    }

    return new Response(
      JSON.stringify(crawlResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
