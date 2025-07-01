
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
    const { query, userId, documentId, featureSource } = await req.json();
    
    if (!query || !userId || !featureSource) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing query: "${query}" for user ${userId}`);
    
    // Generate embedding for the query
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        input: query,
        model: "text-embedding-3-small"
      })
    });
    
    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate query embedding', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;
    
    console.log("Successfully generated query embedding");
    
    // Find relevant document chunks using the match_documents function
    let similarDocuments;
    
    if (documentId) {
      // If document ID is provided, only search within that document
      const { data: docData, error: docError } = await supabase
        .from('rag_documents')
        .select('content_text, id')
        .eq('id', documentId)
        .single();
      
      if (docError) {
        console.error("Error fetching document:", docError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch document', details: docError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      similarDocuments = [docData];
    } else {
      // Otherwise, search all documents of the feature source
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 3,
        feature_source: featureSource
      });
      
      if (error) {
        console.error("Error matching documents:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to match documents', details: error }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      similarDocuments = data;
    }
    
    if (!similarDocuments || similarDocuments.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No relevant documents found',
          answer: 'I don\'t have enough context to answer this question. Please try a different question or upload a relevant document.' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${similarDocuments.length} relevant document chunks`);
    
    // Combine relevant chunks
    const context = similarDocuments.map(doc => doc.content_text).join('\n\n');
    
    // Generate answer using GPT-4
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides accurate answers based on the context provided. If the context doesn't contain the answer, say you don't know rather than making something up."
          },
          {
            role: "user",
            content: `Given the following context:\n\n${context}\n\nAnswer the following question: ${query}`
          }
        ],
        temperature: 0.5
      })
    });
    
    if (!gptResponse.ok) {
      const errorData = await gptResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate answer', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const gptData = await gptResponse.json();
    const answer = gptData.choices[0].message.content;
    
    console.log("Successfully generated answer");
    
    // Save the query and response to the database
    let finalDocumentId = documentId;
    
    if (!finalDocumentId && similarDocuments.length > 0 && similarDocuments[0].id) {
      finalDocumentId = similarDocuments[0].id;
    }
    
    if (finalDocumentId) {
      const { error: queryError } = await supabase
        .from('rag_queries')
        .insert({
          user_id: userId,
          document_id: finalDocumentId,
          query_text: query,
          response_text: answer,
          feature_source: featureSource
        });
      
      if (queryError) {
        console.error("Error saving query:", queryError);
        // Don't fail the request, just log the error
      } else {
        console.log("Successfully saved query");
      }
    }
    
    return new Response(
      JSON.stringify({ 
        answer,
        sources: similarDocuments.map(doc => ({
          content: doc.content_text?.substring(0, 200) + '...',
          id: doc.id
        }))
      }),
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
