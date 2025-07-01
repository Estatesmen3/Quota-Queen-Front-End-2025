
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CandidateEngagementData {
  candidate_id: string;
  first_name: string;
  last_name: string;
  email: string;
  university: string;
  engagement_score: number;
  last_interaction: string;
  improvement_rate: number;
  roleplay_completion_rate: number;
  profile_completeness: number;
  retention_probability: number;
  activity_date: string;
  roleplay_count: number;
  message_count: number;
  profile_views: number;
  job_applications: number;
  engagement_level: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

interface CandidateEngagementParams {
  candidateId?: string;
  dateRange?: DateRange;
}

export function useCandidateEngagement(params?: CandidateEngagementParams) {
  const [engagementData, setEngagementData] = useState<CandidateEngagementData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCandidateEngagement() {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from an edge function
        // and filter by candidateId and dateRange if provided
        // For now, we'll use mock data
        const mockData: CandidateEngagementData[] = [
          {
            candidate_id: '1',
            first_name: 'Alex',
            last_name: 'Johnson',
            email: 'alex@university.edu',
            university: 'State University',
            engagement_score: 95,
            last_interaction: '2025-03-10',
            improvement_rate: 12,
            roleplay_completion_rate: 92,
            profile_completeness: 100,
            retention_probability: 88,
            activity_date: '2025-03-10',
            roleplay_count: 5,
            message_count: 12,
            profile_views: 8,
            job_applications: 3,
            engagement_level: 'high'
          },
          {
            candidate_id: '2',
            first_name: 'Taylor',
            last_name: 'Smith',
            email: 'taylor@college.edu',
            university: 'Tech College',
            engagement_score: 87,
            last_interaction: '2025-03-12',
            improvement_rate: 8,
            roleplay_completion_rate: 76,
            profile_completeness: 95,
            retention_probability: 75,
            activity_date: '2025-03-12',
            roleplay_count: 3,
            message_count: 8,
            profile_views: 5,
            job_applications: 1,
            engagement_level: 'medium'
          },
          {
            candidate_id: '3',
            first_name: 'Jordan',
            last_name: 'Lee',
            email: 'jordan@university.edu',
            university: 'State University',
            engagement_score: 92,
            last_interaction: '2025-03-08',
            improvement_rate: 15,
            roleplay_completion_rate: 88,
            profile_completeness: 90,
            retention_probability: 82,
            activity_date: '2025-03-08',
            roleplay_count: 7,
            message_count: 15,
            profile_views: 10,
            job_applications: 2,
            engagement_level: 'high'
          },
          {
            candidate_id: '4',
            first_name: 'Casey',
            last_name: 'Williams',
            email: 'casey@tech.edu',
            university: 'Tech Institute',
            engagement_score: 78,
            last_interaction: '2025-03-05',
            improvement_rate: 5,
            roleplay_completion_rate: 65,
            profile_completeness: 80,
            retention_probability: 70,
            activity_date: '2025-03-05',
            roleplay_count: 2,
            message_count: 4,
            profile_views: 3,
            job_applications: 0,
            engagement_level: 'low'
          }
        ];
        
        setEngagementData(mockData);
      } catch (err) {
        console.error('Error fetching candidate engagement data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch engagement data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCandidateEngagement();
  }, [params?.candidateId, params?.dateRange]);

  return {
    engagementData,
    isLoading,
    error
  };
}
