
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if this is a scheduled invocation
    const { type } = await req.json();

    if (type === 'SCHEDULED') {
      console.log('Processing scheduled goal notifications');
      
      // Get all active goals
      const { data: goals, error: goalsError } = await supabase
        .from('student_goals')
        .select('*')
        .eq('status', 'active');
      
      if (goalsError) {
        throw goalsError;
      }
      
      // Process each goal and prepare notifications
      const notifications = [];
      
      for (const goal of goals) {
        // Get the user profile
        const { data: userProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', goal.user_id)
          .single();
        
        if (profileError) {
          console.error(`Error fetching profile for user ${goal.user_id}:`, profileError);
          continue;
        }
        
        // Get the user's email from auth.users
        const { data: userData, error: userError } = await supabase.auth.admin
          .getUserById(goal.user_id);
        
        if (userError || !userData) {
          console.error(`Error fetching user ${goal.user_id}:`, userError);
          continue;
        }
        
        // Prepare notification data
        const user = {
          ...userProfiles,
          email: userData.user.email,
        };
        
        // Check goal progress and prepare appropriate notification
        let notificationType = '';
        if (goal.progress === 0) {
          notificationType = 'get_started';
        } else if (goal.progress < 50) {
          notificationType = 'early_progress';
        } else if (goal.progress < 100) {
          notificationType = 'approaching_completion';
        }
        
        // Check if target date is approaching (within 3 days)
        let isTargetDateApproaching = false;
        if (goal.target_date) {
          const targetDate = new Date(goal.target_date);
          const now = new Date();
          const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilTarget > 0 && daysUntilTarget <= 3) {
            isTargetDateApproaching = true;
            notificationType = 'deadline_approaching';
          }
        }
        
        if (notificationType) {
          // Get relevant resources based on the goal
          const { data: resources, error: resourcesError } = await supabase
            .from('resources')
            .select('*')
            .limit(3);
          
          if (resourcesError) {
            console.error('Error fetching resources:', resourcesError);
          }
          
          // Get potential peer connections
          const { data: peers, error: peersError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .neq('id', goal.user_id)
            .limit(3);
          
          if (peersError) {
            console.error('Error fetching peers:', peersError);
          }
          
          // Add to notifications queue
          notifications.push({
            user,
            goal,
            notificationType,
            resources: resources || [],
            peers: peers || [],
            isTargetDateApproaching,
          });
        }
      }
      
      // Here you would typically send the actual emails
      // For this example, we'll just log the notifications
      console.log(`Prepared ${notifications.length} goal notifications`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Processed ${notifications.length} goal notifications` 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // If not a scheduled invocation, check for manual notification request
    const { userId, goalId } = await req.json();
    
    if (!userId || !goalId) {
      throw new Error('Missing required parameters: userId and goalId');
    }
    
    // Get the goal
    const { data: goal, error: goalError } = await supabase
      .from('student_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();
    
    if (goalError) {
      throw goalError;
    }
    
    // Get the user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    // Get the user's email
    const { data: userData, error: userError } = await supabase.auth.admin
      .getUserById(userId);
    
    if (userError || !userData) {
      throw userError || new Error('User not found');
    }
    
    const user = {
      ...userProfile,
      email: userData.user.email,
    };
    
    // Simulate sending an email notification
    console.log(`Sending goal notification to ${user.email} for goal: ${goal.title}`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Goal notification sent to ${user.email}` 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error processing goal notifications:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
