
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Update the validation schema to make scenarioContent and rubricContent optional and nullable
const RequestSchema = z.object({
  userId: z.string().uuid({ message: "User ID must be a valid UUID" }).min(1, { message: "User ID is required" }),
  segment: z.string().min(1, { message: "Segment is required" }),
  timeLimit: z.string().optional(),
  buyerPersona: z.string().optional(),
  industry: z.string().optional(),
  personality: z.string().optional(),
  rubric: z.string().optional(),
  additionalNotes: z.string().optional(),
  scenarioContent: z.string().optional().nullable(),
  rubricContent: z.string().optional().nullable()
});

serve(async (req) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    const requestBody = await req.json().catch(error => {
      console.error("Error parsing request JSON:", error);
      throw new Error("Invalid JSON in request body");
    });
    
    console.log("Request body received:", JSON.stringify(requestBody));
    
    // Validate input against schema
    const validationResult = RequestSchema.safeParse(requestBody);
    
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

    const { 
      userId, 
      segment, 
      timeLimit, 
      buyerPersona, 
      industry, 
      personality, 
      rubric, 
      additionalNotes,
      scenarioContent,
      rubricContent
    } = validationResult.data;

    console.log(`Generating roleplay for user ${userId} in ${industry} industry`);
    
    // Check for OpenAI API key
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }
    
    // If rubric is provided, use it for guidance
    if (rubric) {
      console.log("Using provided rubric points for guidance");
    }
    
    console.log("Calling OpenAI API to generate scenario");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a sales training AI that creates realistic roleplay scenarios for sales training. 
            Generate a detailed, comprehensive sales roleplay scenario for the "${segment}" segment of a sales call.
            
            The scenario should include:
            - A title
            - Company description
            - Buyer profile: ${buyerPersona || 'Create an appropriate buyer persona'}
            - Scenario background
            - Key objectives (3-5)
            - Common objections (3-5)
            - Talking points (4-6)
            - Evaluation criteria (4-6)
            - Difficulty level (beginner, intermediate, or advanced)
            
            Industry focus: ${industry || 'Create an appropriate industry'}
            Buyer personality: ${personality || 'Create an appropriate personality'}
            ${rubric ? `Evaluation should include: ${rubric}` : ''}
            ${additionalNotes ? `Additional scenario context: ${additionalNotes}` : ''}
            
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
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Invalid response format from OpenAI");
    }
    
    let scenarioData;
    try {
      scenarioData = JSON.parse(data.choices[0].message.content);
      console.log("Successfully parsed scenario data");
    } catch (parseError) {
      console.error("Error parsing OpenAI JSON response:", parseError);
      throw new Error("Failed to parse OpenAI response as JSON");
    }

    // Create a session in the database with the generated scenario
    console.log("Creating roleplay session in database");
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
            segment: segment,
            scenario_title: scenarioData.title,
            scenario_data: scenarioData,
            industry: industry || "general",
            difficulty: scenarioData.difficulty,
            status: "in_progress",
            duration: parseInt(timeLimit) || 10,
            transcript: []
          }),
        }
      );

      if (!sessionResponse.ok) {
        const responseText = await sessionResponse.text();
        console.error('Error creating roleplay session:', responseText);
        throw new Error('Failed to create roleplay session in database');
      }

      const sessionData = await sessionResponse.json();
      console.log(`Successfully created roleplay session with ID: ${sessionData?.[0]?.id}`);

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
      console.error('Database error:', dbError);
      throw new Error('Database error: ' + dbError.message);
    }
  } catch (error) {
    console.error('Error in generate-roleplay-scenario function:', error);
    
    // Generate a fallback scenario if an error occurs
    try {
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
    } catch (fallbackError) {
      console.error('Error creating fallback scenario:', fallbackError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || "An unexpected error occurred" 
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
  }
});
