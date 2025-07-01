
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
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Generating mock data for AI recruiting features');
    
    // 1. Update student profiles with predictive scores
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'student');
      
    if (studentsError) {
      throw studentsError;
    }
    
    console.log(`Found ${students.length} student profiles to update`);
    
    // Generate random scores for each student
    for (const student of students) {
      const potentialScore = Math.floor(Math.random() * 100);
      const engagementScore = Math.floor(Math.random() * 100);
      const growthTrend = Math.floor(Math.random() * 100);
      const retentionProbability = Math.floor(Math.random() * 100);
      const confidenceScore = Math.floor(Math.random() * 100);
      const persuasionScore = Math.floor(Math.random() * 100);
      const objectionScore = Math.floor(Math.random() * 100);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          potential_score: potentialScore,
          engagement_score: engagementScore,
          growth_trend: growthTrend,
          retention_probability: retentionProbability,
          confidence_score: confidenceScore,
          persuasion_score: persuasionScore,
          objection_score: objectionScore
        })
        .eq('id', student.id);
        
      if (updateError) {
        console.error(`Error updating student ${student.id}:`, updateError);
      }
    }
    
    // 2. Generate candidate engagement data
    for (const student of students) {
      // Generate data for the last 30 days
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Some days may have no activity
        if (Math.random() > 0.6) {
          continue;
        }
        
        const roleplayCount = Math.floor(Math.random() * 3);
        const messageCount = Math.floor(Math.random() * 5);
        const profileViews = Math.floor(Math.random() * 2);
        const jobViews = Math.floor(Math.random() * 3);
        const jobApplications = Math.random() > 0.9 ? 1 : 0;
        const improvementRate = Math.random() * 10;
        
        // Determine engagement level
        const activitySum = roleplayCount + messageCount + profileViews + jobViews + jobApplications;
        let engagementLevel = 'low';
        if (activitySum > 5) {
          engagementLevel = 'high';
        } else if (activitySum > 2) {
          engagementLevel = 'medium';
        }
        
        // Check if data already exists for this day
        const { data: existingData } = await supabase
          .from('candidate_engagement')
          .select('id')
          .eq('candidate_id', student.id)
          .eq('activity_date', dateStr);
          
        if (existingData && existingData.length > 0) {
          // Update existing data
          const { error: updateError } = await supabase
            .from('candidate_engagement')
            .update({
              roleplay_count: roleplayCount,
              message_count: messageCount,
              profile_views: profileViews,
              job_views: jobViews,
              job_applications: jobApplications,
              improvement_rate: improvementRate,
              engagement_level: engagementLevel
            })
            .eq('id', existingData[0].id);
            
          if (updateError) {
            console.error(`Error updating engagement data for student ${student.id} on ${dateStr}:`, updateError);
          }
        } else {
          // Insert new data
          const { error: insertError } = await supabase
            .from('candidate_engagement')
            .insert({
              candidate_id: student.id,
              activity_date: dateStr,
              roleplay_count: roleplayCount,
              message_count: messageCount,
              profile_views: profileViews,
              job_views: jobViews,
              job_applications: jobApplications,
              improvement_rate: improvementRate,
              engagement_level: engagementLevel
            });
            
          if (insertError) {
            console.error(`Error inserting engagement data for student ${student.id} on ${dateStr}:`, insertError);
          }
        }
      }
    }
    
    // 3. Generate sales industry reports
    const industries = ['SaaS', 'Fintech', 'Healthcare', 'Retail', 'Manufacturing'];
    const regions = ['North America', 'Europe', 'Asia', 'Global'];
    
    for (const industry of industries) {
      for (const region of regions) {
        // Check if report already exists
        const { data: existingReport } = await supabase
          .from('sales_industry_reports')
          .select('id')
          .eq('industry', industry)
          .eq('region', region);
          
        const avgPerformanceScore = Math.floor(Math.random() * 30) + 60; // 60-90
        const topSkills = [
          'Consultative Selling',
          'Objection Handling',
          'Needs Analysis',
          'Active Listening',
          'Product Knowledge',
          'Closing Techniques',
          'Relationship Building',
          'Prospecting',
          'Negotiation',
          'Pipeline Management'
        ].sort(() => Math.random() - 0.5).slice(0, 5);
        
        const skillGaps = [
          'Technical Understanding',
          'Discovery Questioning',
          'Value Proposition',
          'Remote Selling',
          'Social Selling',
          'Presentation Skills',
          'Account Planning',
          'Competitive Positioning',
          'Solution Selling',
          'Pricing Strategy'
        ].sort(() => Math.random() - 0.5).slice(0, 3);
        
        const demandTrends = {
          increasingRoles: ['SDR', 'AE', 'Customer Success', 'Sales Operations'].sort(() => Math.random() - 0.5).slice(0, 3),
          decreasingRoles: ['Field Sales', 'Traditional Retail Sales'].sort(() => Math.random() - 0.5).slice(0, 2),
          emergingSkills: ['AI Sales Tools', 'Digital Selling', 'Remote Closing', 'Data-Driven Prospecting'].sort(() => Math.random() - 0.5),
          roleGrowthRate: {
            'SDR': Math.random() * 20 + 5, // 5-25% growth
            'AE': Math.random() * 15 + 10, // 10-25% growth
            'Customer Success': Math.random() * 30 + 15, // 15-45% growth
            'Sales Operations': Math.random() * 20 + 5, // 5-25% growth
          }
        };
        
        if (existingReport && existingReport.length > 0) {
          // Update existing report
          const { error: updateError } = await supabase
            .from('sales_industry_reports')
            .update({
              avg_performance_score: avgPerformanceScore,
              top_skills: topSkills,
              skill_gaps: skillGaps,
              demand_trends: demandTrends
            })
            .eq('id', existingReport[0].id);
            
          if (updateError) {
            console.error(`Error updating sales industry report for ${industry} in ${region}:`, updateError);
          }
        } else {
          // Insert new report
          const { error: insertError } = await supabase
            .from('sales_industry_reports')
            .insert({
              industry,
              region,
              avg_performance_score: avgPerformanceScore,
              top_skills: topSkills,
              skill_gaps: skillGaps,
              demand_trends: demandTrends
            });
            
          if (insertError) {
            console.error(`Error inserting sales industry report for ${industry} in ${region}:`, insertError);
          }
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true, message: "Mock data generated successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-mock-data function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
