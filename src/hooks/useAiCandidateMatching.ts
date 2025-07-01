
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface CandidateMatchingParams {
  jobRequirements?: string[];
  skillsRequired?: string[];
  role?: string;
  recruiterPreferences?: Record<string, any>;
}

export interface MatchedCandidate {
  id: string;
  first_name: string;
  last_name: string;
  university: string;
  major: string;
  graduation_year: number;
  skills: string[];
  avatar_url: string;
  bio: string;
  potential_score: number;
  engagement_score: number;
  growth_trend: number;
  retention_probability: number;
  confidence_score: number;
  persuasion_score: number;
  objection_score: number;
  average_score: number;
  roleplay_completion_rate: number;
  ai_match_score: number;
  strengths: string[];
  improvement_areas: string[];
  best_fit_roles: string[];
  red_flags: string[];
}

export function useAiCandidateMatching(params: CandidateMatchingParams = {}) {
  const [isSearching, setIsSearching] = useState(false);

  const fetchMatchedCandidates = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-candidate-matching', {
        body: params
      });
      
      if (error) throw error;
      return data.candidates;
    } catch (error) {
      console.error('Error fetching AI-matched candidates:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['aiCandidateMatching', params],
    queryFn: fetchMatchedCandidates,
    enabled: false // Don't run query on mount
  });

  const searchCandidates = async (newParams?: CandidateMatchingParams) => {
    if (newParams) {
      // Update the params before refetching
      params = { ...params, ...newParams };
    }
    return refetch();
  };

  return {
    matchedCandidates: data as MatchedCandidate[],
    isLoading: isLoading || isSearching,
    error,
    searchCandidates
  };
}
