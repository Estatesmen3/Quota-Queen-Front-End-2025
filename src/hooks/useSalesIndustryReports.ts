
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SalesIndustryReportParams {
  industry?: string;
  region?: string;
}

export interface SalesIndustryReport {
  id: string;
  industry: string;
  region: string;
  avg_performance_score: number;
  top_skills: string[];
  skill_gaps: string[];
  demand_trends: {
    increasingRoles: string[];
    decreasingRoles: string[];
    emergingSkills: string[];
    roleGrowthRate: Record<string, number>;
  };
  created_at: string;
  updated_at: string;
}

export function useSalesIndustryReports(params: SalesIndustryReportParams = {}) {
  const fetchIndustryReports = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sales-industry-insights', {
        body: params
      });
      
      if (error) throw error;
      return data.reports;
    } catch (error) {
      console.error('Error fetching sales industry reports:', error);
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['salesIndustryReports', params],
    queryFn: fetchIndustryReports,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    reports: data as SalesIndustryReport[],
    isLoading,
    error,
    refetch
  };
}
