
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API keys from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { documentId, content } = await req.json();
    
    if (!documentId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing document ${documentId} with content length: ${content.length}`);
    
    // Chunk the content into segments (approximately 500 tokens each)
    // Note: A very rough estimate is 1 token ≈ 4 characters for English text
    const chunkSize = 2000; // ~500 tokens
    const chunks = [];
    
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.substring(i, i + chunkSize));
    }
    
    console.log(`Split content into ${chunks.length} chunks`);
    
    // For now, we'll just concatenate the chunks and create one embedding
    // In a production system, you might want to create embeddings for each chunk
    const concatenatedContent = chunks.join(" ");
    
    // Generate embedding using OpenAI API
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        input: concatenatedContent,
        model: "text-embedding-3-small"
      })
    });
    
    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;
    
    console.log("Successfully generated embedding");
    
    // Update the document with the embedding
    const { error: updateError } = await supabase
      .from('rag_documents')
      .update({ 
        embedding: embedding,
        content_text: content
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error("Error updating document:", updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update document with embedding', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Successfully updated document with embedding");
    
    return new Response(
      JSON.stringify({ success: true, documentId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
