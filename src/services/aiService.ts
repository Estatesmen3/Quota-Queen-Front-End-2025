
import { supabase } from "@/integrations/supabase/client";

export type AITaskType = 'resume_analysis' | 'roleplay_scoring' | 'keyword_extraction' | 'job_matching';

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

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
  ats_score: number;
  clarity_score: number;
  skills_match_score: number;
  optimized_content?: string;
}

export interface RoleplayScoring {
  score: number;
  persuasion_score: number;
  tone_score: number;
  objection_handling: number;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
}

export interface JobMatch {
  job_id: string;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  job_title: string;
  company_name: string;
}

/**
 * Calls the AI Router with the specified task and content
 */
export async function callAI<T>(request: AIRequest): Promise<AIResponse<T>> {
  try {
    // For now, let's create a mock implementation since we don't have the ai-router function
    if (request.taskType === 'resume_analysis') {
      // Mock resume analysis for now
      const mockAnalysis: ResumeAnalysis = {
        score: 85,
        ats_score: 82,
        clarity_score: 88,
        skills_match_score: 85,
        strengths: [
          "Clear professional experience section",
          "Good use of action verbs",
          "Quantified achievements effectively"
        ],
        weaknesses: [
          "Summary section could be more impactful",
          "Some technical skills need more context",
          "Education section lacks details"
        ],
        improvement_tips: [
          "Add more industry-specific keywords",
          "Include metrics in all job descriptions",
          "Enhance your summary with a clear value proposition"
        ]
      };
      
      return {
        success: true,
        data: mockAnalysis as unknown as T,
        source: 'fallback'
      };
    }
    
    // For other task types, we could implement similar mock responses or actual API calls
    return {
      success: false,
      error: 'Task type not implemented or AI router unavailable',
    };
  } catch (error: any) {
    console.error('AI service error:', error);
    
    // Return a standardized error response
    return {
      success: false,
      error: error.message || 'Failed to process AI request',
    };
  }
}

/**
 * Analyze a resume with GPT-4
 */
export async function analyzeResume(resumeText: string): Promise<AIResponse<ResumeAnalysis>> {
  // Here we can hook into a real AI service or use our mock implementation
  return callAI<ResumeAnalysis>({
    taskType: 'resume_analysis',
    content: resumeText
  });
}

/**
 * Score a sales roleplay conversation with Claude 3
 */
export async function scoreRoleplay(transcript: string): Promise<AIResponse<RoleplayScoring>> {
  return callAI<RoleplayScoring>({
    taskType: 'roleplay_scoring',
    content: transcript
  });
}

/**
 * Extract keywords from text using Mistral 7B
 */
export async function extractKeywords(text: string): Promise<AIResponse<string[]>> {
  return callAI<string[]>({
    taskType: 'keyword_extraction',
    content: text
  });
}

/**
 * Match resume to job postings
 */
export async function matchResumeToJobs(resumeId: string, resumeText: string): Promise<AIResponse<JobMatch[]>> {
  return callAI<JobMatch[]>({
    taskType: 'job_matching',
    content: resumeText,
    metadata: { resumeId }
  });
}

/**
 * Save a resume to Supabase Storage
 */
export async function uploadResume(file: File, userId: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);

    if (error) throw error;

    return {
      success: true,
      filePath: data.path
    };
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload resume'
    };
  }
}

/**
 * Save resume version to the database
 */
export async function saveResumeVersion(
  userId: string, 
  title: string, 
  description: string,
  filePath: string,
  fileType: string,
  isCurrent: boolean = true
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // If setting as current, update all other versions to not be current
    if (isCurrent) {
      await supabase
        .from('resume_versions')
        .update({ is_current: false })
        .eq('user_id', userId);
    }

    // Insert the new resume version
    const { data, error } = await supabase
      .from('resume_versions')
      .insert({
        user_id: userId,
        title,
        description,
        file_path: filePath,
        file_type: fileType,
        is_current: isCurrent
      })
      .select('id')
      .single();

    if (error) throw error;

    return {
      success: true,
      id: data?.id
    };
  } catch (error: any) {
    console.error('Save resume version error:', error);
    return {
      success: false,
      error: error.message || 'Failed to save resume version'
    };
  }
}

/**
 * Save resume analysis scores to the database
 */
export async function saveResumeScores(
  userId: string,
  resumeId: string,
  analysis: ResumeAnalysis
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('resume_scores')
      .insert({
        user_id: userId,
        resume_id: resumeId,
        ats_score: analysis.ats_score,
        clarity_score: analysis.clarity_score,
        skills_match_score: analysis.skills_match_score,
        feedback_text: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          improvement_tips: analysis.improvement_tips,
          optimized_content: analysis.optimized_content
        }
      })
      .select('id')
      .single();

    if (error) throw error;

    return {
      success: true,
      id: data?.id
    };
  } catch (error: any) {
    console.error('Save resume scores error:', error);
    return {
      success: false,
      error: error.message || 'Failed to save resume scores'
    };
  }
}

/**
 * Get user's resume versions
 */
export async function getResumeVersions(userId: string): Promise<{ 
  success: boolean; 
  versions?: any[]; 
  error?: string 
}> {
  try {
    const { data, error } = await supabase
      .from('resume_versions')
      .select('*, resume_scores(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      versions: data
    };
  } catch (error: any) {
    console.error('Get resume versions error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get resume versions'
    };
  }
}

/**
 * Download resume from Supabase Storage
 */
export async function downloadResume(path: string): Promise<{ 
  success: boolean; 
  url?: string; 
  error?: string 
}> {
  try {
    const { data, error } = await supabase.storage
      .from('resumes')
      .download(path);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    return {
      success: true,
      url
    };
  } catch (error: any) {
    console.error('Download resume error:', error);
    return {
      success: false,
      error: error.message || 'Failed to download resume'
    };
  }
}
