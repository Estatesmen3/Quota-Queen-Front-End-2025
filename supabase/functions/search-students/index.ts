
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Define CORS headers
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
    // Get request body
    const { query } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Log the search query for debugging
    console.log(`Searching for: ${query}`);

    // Process the natural language query
    // This is a simplified implementation - a real NLP search would be more sophisticated
    const processedQuery = processNaturalLanguageQuery(query);
    
    // Build and execute the query
    let profilesQuery = supabase
      .from('profiles')
      .select('*, roleplay_sessions(id, scenario_title, industry, difficulty, status, created_at), ai_feedback(id, score)')
      .eq('user_type', 'student');
    
    // Add filters based on the processed query
    if (processedQuery.university) {
      profilesQuery = profilesQuery.ilike('university', `%${processedQuery.university}%`);
    }
    
    if (processedQuery.graduationYear) {
      profilesQuery = profilesQuery.eq('graduation_year', processedQuery.graduationYear);
    }
    
    if (processedQuery.major) {
      profilesQuery = profilesQuery.ilike('major', `%${processedQuery.major}%`);
    }
    
    if (processedQuery.skills && processedQuery.skills.length > 0) {
      // Note: This is a simplified approach - real implementation would be more robust
      const skillsCondition = processedQuery.skills.map(skill => 
        `skills::text ILIKE '%${skill}%'`
      ).join(' OR ');
      
      profilesQuery = profilesQuery.or(skillsCondition);
    }
    
    // Execute the query
    const { data: profiles, error } = await profilesQuery;
    
    if (error) {
      throw error;
    }
    
    // Process and return the results
    const results = processResults(profiles, processedQuery);
    
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in search-students function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Process natural language query into structured filters
function processNaturalLanguageQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  const result: any = {
    original: query,
    skills: [],
  };
  
  // Extract graduation year
  const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    result.graduationYear = parseInt(yearMatch[1]);
  }
  
  // Look for universities
  const universities = [
    'stanford', 'harvard', 'mit', 'berkeley', 'michigan', 'cornell', 'nyu', 'ucla', 
    'penn', 'texas', 'stetson'
  ];
  for (const university of universities) {
    if (lowerQuery.includes(university)) {
      result.university = university;
      break;
    }
  }
  
  // Look for industries
  const industries = [
    'saas', 'fintech', 'finance', 'tech', 'software', 'retail', 'e-commerce', 
    'healthcare', 'manufacturing', 'consulting'
  ];
  for (const industry of industries) {
    if (lowerQuery.includes(industry)) {
      result.industry = industry;
      break;
    }
  }
  
  // Look for majors
  const majors = [
    'business', 'finance', 'marketing', 'sales', 'management', 'entrepreneurship', 
    'international business', 'supply chain', 'real estate'
  ];
  for (const major of majors) {
    if (lowerQuery.includes(major)) {
      result.major = major;
      break;
    }
  }
  
  // Extract skill keywords
  const skillKeywords = [
    'consultative selling', 'negotiation', 'prospecting', 'closing', 'crm', 
    'lead generation', 'relationship building', 'b2b', 'b2c', 'client acquisition'
  ];
  
  for (const skill of skillKeywords) {
    if (lowerQuery.includes(skill)) {
      result.skills.push(skill);
    }
  }
  
  // Handle special queries
  if (lowerQuery.includes('top performer') || lowerQuery.includes('best student')) {
    result.topPerformers = true;
  }
  
  return result;
}

// Process and rank the results
function processResults(profiles: any[], query: any) {
  if (!profiles || profiles.length === 0) {
    return [];
  }
  
  // Calculate scores and rankings for each profile
  const scoredProfiles = profiles.map(profile => {
    // Start with a base score
    let score = 10;
    
    // Enhance score based on matching criteria
    if (query.university && profile.university && 
        profile.university.toLowerCase().includes(query.university.toLowerCase())) {
      score += 5;
    }
    
    if (query.major && profile.major && 
        profile.major.toLowerCase().includes(query.major.toLowerCase())) {
      score += 5;
    }
    
    if (query.graduationYear && profile.graduation_year === query.graduationYear) {
      score += 5;
    }
    
    // Calculate average feedback score if available
    let averageScore = 0;
    if (profile.ai_feedback && profile.ai_feedback.length > 0) {
      const total = profile.ai_feedback.reduce((sum: number, feedback: any) => sum + feedback.score, 0);
      averageScore = total / profile.ai_feedback.length;
      
      // Boost score for top performers if that was requested
      if (query.topPerformers && averageScore > 90) {
        score += 10;
      }
    }
    
    // Skills matching
    if (query.skills && query.skills.length > 0 && profile.skills) {
      const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
      
      // Count matching skills
      const matchingSkills = query.skills.filter((skill: string) => 
        profileSkills.some((profileSkill: string) => 
          profileSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      score += matchingSkills.length * 3;
    }
    
    // Industry matching from roleplay_sessions
    if (query.industry && profile.roleplay_sessions) {
      const hasIndustryMatch = profile.roleplay_sessions.some((session: any) => 
        session.industry && session.industry.toLowerCase().includes(query.industry.toLowerCase())
      );
      
      if (hasIndustryMatch) {
        score += 5;
      }
    }
    
    // Add the relevance score to the profile
    return {
      ...profile,
      average_score: averageScore,
      relevance_score: score
    };
  });
  
  // Sort by relevance score (descending)
  return scoredProfiles.sort((a, b) => b.relevance_score - a.relevance_score);
}
