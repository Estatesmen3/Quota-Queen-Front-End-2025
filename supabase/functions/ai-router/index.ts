
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define task types
type AITaskType = 'resume_analysis' | 'roleplay_scoring' | 'keyword_extraction' | 'job_matching';

interface AIRequest {
  taskType: AITaskType;
  content: string;
  enableCache?: boolean;
  metadata?: Record<string, any>;
}

interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source?: 'api' | 'cache' | 'fallback';
  model?: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

// Get API keys from environment
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY') || '';

// Cache configuration
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

async function generateCacheKey(taskType: AITaskType, content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${taskType}:${content}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function getCachedResponse<T>(cacheKey: string): Promise<AIResponse<T> | null> {
  try {
    const { data, error } = await supabase
      .from('ai_response_cache')
      .select('response, created_at')
      .eq('cache_key', cacheKey)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if cache is expired
    const createdAt = new Date(data.created_at);
    const now = new Date();
    const ttlMilliseconds = CACHE_TTL * 1000;
    
    if (now.getTime() - createdAt.getTime() > ttlMilliseconds) {
      // Cache expired, delete it
      await supabase
        .from('ai_response_cache')
        .delete()
        .eq('cache_key', cacheKey);
      return null;
    }

    return {
      ...data.response as AIResponse<T>,
      source: 'cache'
    };
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

async function setCachedResponse<T>(cacheKey: string, response: AIResponse<T>): Promise<void> {
  try {
    // Clone and remove source property (to avoid confusion when retrieved from cache)
    const responseToCache = { ...response };
    delete responseToCache.source;

    await supabase
      .from('ai_response_cache')
      .insert({
        cache_key: cacheKey,
        response: responseToCache
      })
      .select();
  } catch (error) {
    console.error('Cache storage error:', error);
  }
}

// Resume analysis using GPT-4 Turbo
async function analyzeResume(text: string): Promise<AIResponse<any>> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert ATS system and resume consultant. Analyze the provided resume and give detailed feedback.
            Focus on ATS optimization, clarity, skills relevance, and formatting. Return a structured JSON response with the following fields:
            - score: Overall score from 0-100
            - ats_score: ATS compatibility score from 0-100
            - clarity_score: Clarity and readability score from 0-100
            - skills_match_score: Skills relevance score from 0-100
            - strengths: Array of 3-5 specific strengths of the resume
            - weaknesses: Array of 3-5 specific weaknesses of the resume
            - improvement_tips: Array of 3-5 actionable tips to improve the resume
            - optimized_content: A suggested improved version of the resume content (optional)`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.5,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);

    return {
      success: true,
      data: content,
      source: 'api',
      model: 'gpt-4o'
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze resume'
    };
  }
}

// Score roleplay performance using Claude 3
async function scoreRoleplay(transcript: string): Promise<AIResponse<any>> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: `You are an expert sales coach evaluating a sales roleplay transcript. 
        Analyze the sales performance and return a JSON object with these fields:
        - score: Overall score from 0-100
        - persuasion_score: Score from 0-100 on persuasion techniques
        - tone_score: Score from 0-100 on tone and communication
        - objection_handling: Score from 0-100 on handling objections
        - strengths: Array of specific strengths (3-5 items)
        - weaknesses: Array of improvement areas (3-5 items)
        - improvement_tips: Array of actionable coaching tips (3-5 items)`,
        messages: [
          {
            role: 'user',
            content: transcript
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const result = await response.json();
    const content = JSON.parse(result.content[0].text);

    return {
      success: true,
      data: content,
      source: 'api',
      model: 'claude-3-sonnet'
    };
  } catch (error) {
    console.error('Roleplay scoring error:', error);
    return {
      success: false,
      error: error.message || 'Failed to score roleplay'
    };
  }
}

// Extract keywords using Mistral
async function extractKeywords(text: string): Promise<AIResponse<any>> {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: 'Extract key phrases and important keywords from the text. Return an array of strings, with no additional explanation.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Mistral API error');
    }

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);

    return {
      success: true,
      data: content.keywords || content,
      source: 'api',
      model: 'mistral-small'
    };
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return {
      success: false,
      error: error.message || 'Failed to extract keywords'
    };
  }
}

// Match resume to jobs
async function matchResumeToJobs(resumeText: string, metadata: Record<string, any>): Promise<AIResponse<any>> {
  try {
    // First fetch some job postings from the database
    const { data: jobs, error: jobsError } = await supabase
      .from('job_postings')
      .select('id, title, company_name, description, requirements, required_skills, location, salary_range')
      .limit(5);
      
    if (jobsError) {
      throw new Error(jobsError.message);
    }
    
    if (!jobs || jobs.length === 0) {
      return {
        success: true,
        data: [],
        source: 'api',
        model: 'gpt-4o'
      };
    }
    
    // Call OpenAI to match resume to jobs
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert job matching system. Compare the resume to the job postings and determine the match percentage.
            For each job, return the following:
            - job_id: The ID of the job
            - match_percentage: A number from 0-100 representing how well the resume matches the job
            - matching_skills: Array of skills from the resume that match the job
            - missing_skills: Array of skills required by the job that are missing from the resume
            - job_title: The title of the job
            - company_name: The name of the company`
          },
          {
            role: 'user',
            content: `Resume: ${resumeText}\n\nJob Postings: ${JSON.stringify(jobs)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);
    
    // Save the matches to the database (if there's a resumeId)
    if (metadata?.resumeId && Array.isArray(content)) {
      try {
        // Get user_id from resume_versions
        const { data: resumeData, error: resumeError } = await supabase
          .from('resume_versions')
          .select('user_id')
          .eq('id', metadata.resumeId)
          .single();
          
        if (resumeError) throw resumeError;
        
        // Save each match to the database
        const matchData = content.map(match => ({
          user_id: resumeData.user_id,
          resume_id: metadata.resumeId,
          job_id: match.job_id,
          match_percentage: match.match_percentage,
          matching_skills: match.matching_skills,
          missing_skills: match.missing_skills
        }));
        
        const { error: insertError } = await supabase
          .from('job_matches')
          .upsert(matchData, { 
            onConflict: 'resume_id,job_id',
            ignoreDuplicates: false
          });
          
        if (insertError) {
          console.error('Error saving job matches:', insertError);
        }
      } catch (error) {
        console.error('Error saving job matches:', error);
      }
    }

    return {
      success: true,
      data: content,
      source: 'api',
      model: 'gpt-4o'
    };
  } catch (error) {
    console.error('Job matching error:', error);
    return {
      success: false,
      error: error.message || 'Failed to match jobs'
    };
  }
}

serve(async (req) => {
  try {
    // Parse request body
    const requestData: AIRequest = await req.json();
    const { taskType, content, enableCache = true, metadata = {} } = requestData;

    // Return immediately for empty content
    if (!content || content.trim() === '') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Content cannot be empty'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check cache if enabled
    let response: AIResponse<any> | null = null;
    if (enableCache) {
      const cacheKey = await generateCacheKey(taskType, content);
      response = await getCachedResponse(cacheKey);

      if (response) {
        console.log(`Cache hit for ${taskType}`);
        return new Response(
          JSON.stringify(response),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Route to appropriate handler based on task type
    switch (taskType) {
      case 'resume_analysis':
        response = await analyzeResume(content);
        break;
        
      case 'roleplay_scoring':
        response = await scoreRoleplay(content);
        break;
        
      case 'keyword_extraction':
        response = await extractKeywords(content);
        break;
        
      case 'job_matching':
        response = await matchResumeToJobs(content, metadata);
        break;
        
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: `Unsupported task type: ${taskType}`
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Save to cache if successful and caching is enabled
    if (response.success && enableCache) {
      const cacheKey = await generateCacheKey(taskType, content);
      await setCachedResponse(cacheKey, response);
    }

    return new Response(
      JSON.stringify(response),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Request processing error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
})
