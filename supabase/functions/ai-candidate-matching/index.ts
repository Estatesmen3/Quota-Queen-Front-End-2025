
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestBody {
  role?: string;
  skillsRequired?: string[];
  location?: string;
  experienceLevel?: string;
  universityPreference?: string;
}

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  university: string;
  major: string;
  avatar_url: string | null;
  ai_match_score: number;
  strengths: string[];
  improvement_areas: string[];
  best_fit_roles: string[];
}

// Mock data function to generate candidates
function generateMockCandidates(params: RequestBody): Candidate[] {
  // Sample candidates - in a real implementation, this would be fetched from a database
  const candidates: Candidate[] = [
    {
      id: "1",
      first_name: "Alex",
      last_name: "Johnson",
      email: "alex@university.edu",
      university: "State University",
      major: "Business Administration",
      avatar_url: null,
      ai_match_score: 94,
      strengths: ["Objection Handling", "Needs Discovery", "Relationship Building"],
      improvement_areas: ["Technical Knowledge", "Follow-up Consistency"],
      best_fit_roles: ["Account Executive", "SDR Team Lead"]
    },
    {
      id: "2",
      first_name: "Jordan",
      last_name: "Smith",
      email: "jordan@college.edu",
      university: "Tech Institute",
      major: "Marketing",
      avatar_url: null,
      ai_match_score: 87,
      strengths: ["Cold Calling", "Pipeline Management", "Social Selling"],
      improvement_areas: ["Closing Techniques", "Product Knowledge"],
      best_fit_roles: ["SDR", "BDR"]
    },
    {
      id: "3",
      first_name: "Taylor",
      last_name: "Williams",
      email: "taylor@university.edu",
      university: "Liberal Arts College",
      major: "Communications",
      avatar_url: null,
      ai_match_score: 82,
      strengths: ["Presentation Skills", "Storytelling", "Active Listening"],
      improvement_areas: ["Handling Price Objections", "Technical Demonstrations"],
      best_fit_roles: ["Solution Consultant", "Customer Success"]
    },
    {
      id: "4",
      first_name: "Casey",
      last_name: "Brown",
      email: "casey@edu.edu",
      university: "State University",
      major: "Psychology",
      avatar_url: null,
      ai_match_score: 76,
      strengths: ["Empathy", "Consultative Selling", "Adaptability"],
      improvement_areas: ["Time Management", "Lead Qualification"],
      best_fit_roles: ["Account Manager", "Customer Success"]
    },
    {
      id: "5",
      first_name: "Morgan",
      last_name: "Miller",
      email: "morgan@techcollege.edu",
      university: "Tech College",
      major: "Information Systems",
      avatar_url: null,
      ai_match_score: 91,
      strengths: ["Technical Knowledge", "Solution Selling", "Competitive Analysis"],
      improvement_areas: ["Building Rapport", "Non-verbal Communication"],
      best_fit_roles: ["Solution Engineer", "Technical Account Manager"]
    }
  ];
  
  // Filter results based on search parameters
  let filteredCandidates = [...candidates];
  
  if (params.role) {
    const roleSearchTerm = params.role.toLowerCase();
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.best_fit_roles.some(role => role.toLowerCase().includes(roleSearchTerm))
    );
  }
  
  if (params.skillsRequired && params.skillsRequired.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      // Check if candidate has any of the required skills
      return params.skillsRequired!.some(skill => 
        candidate.strengths.some(strength => 
          strength.toLowerCase().includes(skill.toLowerCase())
        )
      );
    });
  }
  
  if (params.universityPreference) {
    const uniSearchTerm = params.universityPreference.toLowerCase();
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.university.toLowerCase().includes(uniSearchTerm)
    );
  }
  
  // Sort by AI match score
  return filteredCandidates.sort((a, b) => b.ai_match_score - a.ai_match_score);
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Parse request body
    const params: RequestBody = await req.json();
    
    // Generate mock candidates based on search parameters
    const candidates = generateMockCandidates(params);
    
    // Return the candidates
    return new Response(JSON.stringify(candidates), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  } catch (error) {
    console.error("Error in ai-candidate-matching function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  }
});
