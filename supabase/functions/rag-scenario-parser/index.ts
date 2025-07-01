
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Updated Input validation schema with nullable optional fields
const ParserRequestSchema = z.object({
  documentId: z.string().uuid().optional(),
  documentText: z.string({ required_error: "Document text is required" }),
  userId: z.string().uuid({ message: "User ID must be a valid UUID" }).min(1, { message: "User ID is required" }),
  rubricDocumentId: z.string().uuid().optional(),
  segment: z.string().optional()
});

interface RoleplayScenario {
  title: string;
  company_description: string;
  buyer_profile: string;
  scenario_background: string;
  key_objectives: string[];
  common_objections: string[];
  talking_points: string[];
  evaluation_criteria: string[];
  difficulty: string;
}

serve(async (req) => {
  console.log(`RAG Parser Request method: ${req.method}, URL: ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request for RAG parser");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    const requestBody = await req.json().catch(error => {
      console.error("Error parsing request JSON:", error);
      throw new Error("Invalid JSON in request body");
    });
    
    console.log("RAG Parser request body received");
    
    // Validate input against schema
    const validationResult = ParserRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.format());
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation error", 
          details: validationResult.error.format() 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const { documentId, documentText, userId, rubricDocumentId, segment } = validationResult.data;

    console.log(`Parsing scenario document for user ${userId}`);
    
    // Check for OpenAI API key
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured in RAG parser");
      throw new Error("OpenAI API key is not configured");
    }
    
    // If we have a rubric document ID, fetch its content
    let rubricContent = null;
    if (rubricDocumentId) {
      try {
        console.log(`Fetching rubric document with ID: ${rubricDocumentId}`);
        // Get the document details from the rag_documents table
        const rubricDocResponse = await fetch(
          `${req.headers.get('origin')}/rest/v1/rag_documents?id=eq.${rubricDocumentId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': req.headers.get('apikey') || '',
              'Authorization': req.headers.get('authorization') || '',
            }
          }
        );
        
        if (!rubricDocResponse.ok) {
          console.error(`Error fetching rubric document: ${rubricDocResponse.status}`);
          console.error(await rubricDocResponse.text());
        } else {
          const rubricDocData = await rubricDocResponse.json();
          
          if (rubricDocData && rubricDocData.length > 0 && rubricDocData[0].content_text) {
            rubricContent = rubricDocData[0].content_text;
            console.log("Retrieved rubric content successfully");
          } else {
            console.log("No rubric content found in database, will try to extract from provided ID");
          }
        }
      } catch (error) {
        console.error("Error fetching rubric content:", error);
      }
    }

    // Call OpenAI to extract scenario data
    console.log("Calling OpenAI API to extract scenario data");
    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a sales training assistant. Extract sales roleplay scenario information from the provided document.
            Extract the following components:
            1. Title - Create a concise title for this sales scenario
            2. Company Description - Details about the company/product being sold
            3. Buyer Profile - Who is the buyer persona
            4. Scenario Background - Context of the sales interaction
            5. Key Objectives - 3-5 main goals for the seller
            6. Common Objections - 3-5 likely objections the buyer might raise
            7. Talking Points - 4-6 key points the seller should emphasize
            8. Evaluation Criteria - 4-6 criteria to assess performance
            9. Difficulty - Classify as "beginner", "intermediate", or "advanced"
            
            ${rubricContent ? "Use the provided rubric content to inform the evaluation criteria section." : ""}
            
            Format your response as a JSON object with the following structure:
            {
              "title": string,
              "company_description": string,
              "buyer_profile": string,
              "scenario_background": string,
              "key_objectives": string[],
              "common_objections": string[],
              "talking_points": string[],
              "evaluation_criteria": string[],
              "difficulty": string
            }`
          },
          {
            role: 'user',
            content: `Extract sales roleplay scenario information from this document:\n\n${documentText}${
              rubricContent ? `\n\nRubric Document Content:\n${rubricContent}` : ''
            }`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!extractionResponse.ok) {
      const errorData = await extractionResponse.text();
      console.error('OpenAI API error in scenario parser:', errorData);
      throw new Error(`OpenAI API error: ${extractionResponse.status}`);
    }

    const extractionData = await extractionResponse.json();
    
    if (!extractionData.choices || !extractionData.choices[0] || !extractionData.choices[0].message || !extractionData.choices[0].message.content) {
      console.error("Invalid response format from OpenAI in scenario parser:", JSON.stringify(extractionData));
      throw new Error("Invalid response format from OpenAI");
    }
    
    let scenarioData;
    try {
      scenarioData = JSON.parse(extractionData.choices[0].message.content) as RoleplayScenario;
      console.log("Successfully parsed extracted scenario data");
    } catch (parseError) {
      console.error("Error parsing OpenAI JSON response in scenario parser:", parseError);
      throw new Error("Failed to parse OpenAI response as JSON");
    }

    // Validate scenario data has required fields
    const validateScenarioData = (data: any): data is RoleplayScenario => {
      return data &&
        typeof data.title === 'string' && data.title.trim() !== '' &&
        typeof data.company_description === 'string' && data.company_description.trim() !== '' &&
        typeof data.buyer_profile === 'string' && data.buyer_profile.trim() !== '' &&
        typeof data.scenario_background === 'string' && data.scenario_background.trim() !== '' &&
        Array.isArray(data.key_objectives) && data.key_objectives.length > 0 &&
        Array.isArray(data.common_objections) && data.common_objections.length > 0 &&
        Array.isArray(data.talking_points) && data.talking_points.length > 0 &&
        Array.isArray(data.evaluation_criteria) && data.evaluation_criteria.length > 0 &&
        typeof data.difficulty === 'string' && 
        ['beginner', 'intermediate', 'advanced'].includes(data.difficulty.toLowerCase());
    }

    if (!validateScenarioData(scenarioData)) {
      console.error("Invalid scenario data format received from OpenAI:", JSON.stringify(scenarioData));
      throw new Error('Invalid scenario data format received from OpenAI');
    }

    // Create a new roleplay session with the extracted data
    console.log("Creating roleplay session from extracted data");
    try {
      const sessionResponse = await fetch(
        `${req.headers.get('origin')}/rest/v1/roleplay_sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': req.headers.get('apikey') || '',
            'Authorization': req.headers.get('authorization') || '',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            student_id: userId,
            segment: segment || 'full_roleplay',
            scenario_title: scenarioData.title,
            scenario_data: scenarioData,
            industry: scenarioData.company_description.includes("healthcare") ? "healthcare" : 
                    scenarioData.company_description.includes("tech") ? "technology" :
                    scenarioData.company_description.includes("finance") ? "finance" : "general",
            difficulty: scenarioData.difficulty,
            status: "in_progress",
            duration: 10,
            transcript: []
          }),
        }
      );

      if (!sessionResponse.ok) {
        const responseText = await sessionResponse.text();
        console.error('Error creating roleplay session from extracted data:', responseText);
        throw new Error('Failed to create roleplay session');
      }

      const sessionData = await sessionResponse.json();
      console.log(`Successfully created roleplay session with ID: ${sessionData?.[0]?.id}`);

      // If we have a document ID, update its status to processed
      if (documentId) {
        console.log(`Updating document ${documentId} status to processed`);
        const updateResponse = await fetch(
          `${req.headers.get('origin')}/rest/v1/rag_documents?id=eq.${documentId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': req.headers.get('apikey') || '',
              'Authorization': req.headers.get('authorization') || '',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              processed: true
            }),
          }
        );
        
        if (!updateResponse.ok) {
          console.error(`Error updating document status: ${updateResponse.status}`);
          console.error(await updateResponse.text());
        } else {
          console.log(`Document ${documentId} status updated successfully`);
        }
      }
      
      // If we have a rubric document ID, update its status to processed
      if (rubricDocumentId) {
        console.log(`Updating rubric document ${rubricDocumentId} status to processed`);
        const updateRubricResponse = await fetch(
          `${req.headers.get('origin')}/rest/v1/rag_documents?id=eq.${rubricDocumentId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': req.headers.get('apikey') || '',
              'Authorization': req.headers.get('authorization') || '',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              processed: true
            }),
          }
        );
        
        if (!updateRubricResponse.ok) {
          console.error(`Error updating rubric document status: ${updateRubricResponse.status}`);
          console.error(await updateRubricResponse.text());
        } else {
          console.log(`Rubric document ${rubricDocumentId} status updated successfully`);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          scenario: scenarioData,
          sessionId: sessionData?.[0]?.id
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (dbError) {
      console.error('Database error in scenario parser:', dbError);
      throw new Error('Database error: ' + dbError.message);
    }
  } catch (error) {
    console.error('Error in rag-scenario-parser function:', error);
    
    // Return a fallback scenario if we can't parse the document
    const fallbackScenario = {
      title: "B2B Software Sale",
      company_description: "You represent CloudWorks, a SaaS platform offering project management solutions for enterprise businesses.",
      buyer_profile: "CTO of a mid-sized manufacturing company looking to improve team collaboration.",
      scenario_background: "The prospect's company is growing rapidly and facing challenges with distributed team coordination.",
      key_objectives: [
        "Discover the prospect's specific pain points",
        "Demonstrate value of the CloudWorks platform",
        "Address technical implementation concerns",
        "Establish next steps for a product demo"
      ],
      common_objections: [
        "Cost concerns compared to current solutions",
        "Employee training requirements",
        "Data security questions",
        "Integration with existing systems"
      ],
      talking_points: [
        "Seamless integration capabilities",
        "ROI and productivity improvements",
        "Enterprise-grade security features",
        "Flexible implementation timeline",
        "24/7 customer support"
      ],
      evaluation_criteria: [
        "Discovery question effectiveness",
        "Value proposition clarity",
        "Technical knowledge demonstration",
        "Objection handling approach",
        "Overall professionalism",
        "Closing technique"
      ],
      difficulty: "intermediate"
    };
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred",
        errorDetail: error.stack || null,
        fallbackScenario
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
