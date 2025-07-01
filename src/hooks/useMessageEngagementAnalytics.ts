
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface MessageTemplate {
  name: string;
  sample: string;
  response_rate: number;
}

export interface MessageAnalytics {
  response_rate: number;
  avg_response_time_hours: number;
  total_messages_sent: number;
  engagement_score: number;
  optimal_timing: {
    days_of_week: Record<string, number>;
    time_of_day: Record<string, number>;
  };
  best_templates: MessageTemplate[];
}

export function useMessageEngagementAnalytics() {
  const [analytics, setAnalytics] = useState<MessageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMessageAnalytics() {
      try {
        setIsLoading(true);
        
        // Fetch message analytics from edge function
        const { data, error } = await supabase.functions.invoke('message-engagement-analyzer');
        
        if (error) throw error;
        
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching message analytics:', err);
        // Fallback to mock data if the edge function fails
        const mockData: MessageAnalytics = {
          response_rate: 0.68,
          avg_response_time_hours: 6.4,
          total_messages_sent: 145,
          engagement_score: 7.8,
          optimal_timing: {
            days_of_week: {
              monday: 0.72,
              tuesday: 0.85,
              wednesday: 0.75,
              thursday: 0.68,
              friday: 0.45,
              saturday: 0.22,
              sunday: 0.38
            },
            time_of_day: {
              "9-11 AM": 0.82,
              "11-1 PM": 0.65,
              "1-3 PM": 0.78,
              "3-5 PM": 0.62,
              "After 5 PM": 0.42
            }
          },
          best_templates: [
            {
              name: "Personalized Role Match",
              sample: "Hi [Name], I noticed your experience with [specific skill] and thought you'd be perfect for our [role] position at [Company].",
              response_rate: 0.84
            },
            {
              name: "University Connection",
              sample: "Hi [Name], I'm reaching out to fellow [University] alumni about an exciting [role] opportunity at [Company].",
              response_rate: 0.76
            },
            {
              name: "Roleplay Performance Follow-up",
              sample: "Hi [Name], your performance in the recent sales roleplay challenge was impressive!",
              response_rate: 0.72
            }
          ]
        };
        
        setAnalytics(mockData);
        setError(err instanceof Error ? err : new Error('Failed to fetch message analytics'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessageAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error
  };
}
