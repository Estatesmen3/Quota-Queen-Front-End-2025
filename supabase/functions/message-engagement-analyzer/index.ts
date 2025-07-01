
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface MessageTemplate {
  name: string;
  sample: string;
  response_rate: number;
}

interface MessageAnalytics {
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

// Generate mock message analytics data
function generateMockAnalytics(): MessageAnalytics {
  return {
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
        sample: "Hi [Name], I noticed your experience with [specific skill] and thought you'd be perfect for our [role] position at [Company]. Would you be open to discussing how your background aligns with what we're looking for?",
        response_rate: 0.84
      },
      {
        name: "University Connection",
        sample: "Hi [Name], I'm reaching out to fellow [University] alumni about an exciting [role] opportunity at [Company]. Your background in [field] caught my attention, and I'd love to share more details about how you could make an impact here.",
        response_rate: 0.76
      },
      {
        name: "Roleplay Performance Follow-up",
        sample: "Hi [Name], your performance in the recent sales roleplay challenge was impressive! Particularly your approach to [specific technique]. We're looking for exactly those skills in our [role] position. Would you be interested in learning more?",
        response_rate: 0.72
      },
      {
        name: "Skill Development Opportunity",
        sample: "Hi [Name], I came across your profile and was impressed by your [skill] background. Our [role] position offers significant opportunities to develop expertise in [related industry/technology]. Would you be open to a conversation about how this role could advance your career?",
        response_rate: 0.68
      },
      {
        name: "Industry Insight Sharing",
        sample: "Hi [Name], I noticed your interest in [industry]. I recently read an insightful report on [industry trend] that I thought might interest you. Also, we're currently expanding our [department] team at [Company] and looking for professionals with your expertise. Would you be open to discussing both?",
        response_rate: 0.65
      }
    ]
  };
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    // Generate mock analytics data
    const analytics = generateMockAnalytics();
    
    // Return the analytics data
    return new Response(JSON.stringify(analytics), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  } catch (error) {
    console.error("Error in message-engagement-analyzer function:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  }
});
