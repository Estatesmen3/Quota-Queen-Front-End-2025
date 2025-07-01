
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, callId, signal, targetUserId } = await req.json();
    
    if (!action || !callId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log call signaling event
    try {
      await supabaseClient
        .from('call_logs')
        .insert({
          call_id: callId,
          log_type: `signaling_${action}`,
          message: `User ${user.id} ${action} action`
        });
    } catch (logError) {
      console.error('Error logging call signaling event:', logError);
      // Continue despite logging error
    }

    // Handle different signaling actions
    switch (action) {
      case 'join':
        try {
          // First check if call exists using a simple query
          const { data: callData, error: callError } = await supabaseClient
            .from('calls')
            .select('id, title, description, status, host_id, started_at, scheduled_at, call_type')
            .eq('id', callId)
            .maybeSingle();
          
          if (callError) throw callError;
          if (!callData) {
            return new Response(
              JSON.stringify({ error: 'Call not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Check if user is already a participant with a separate query
          const { data: existingParticipant, error: participantError } = await supabaseClient
            .from('call_participants')
            .select('id, joined_at')
            .eq('call_id', callId)
            .eq('user_id', user.id)
            .maybeSingle();

          if (participantError) throw participantError;

          // Add user as participant if not already in the call
          if (!existingParticipant) {
            const { error: insertError } = await supabaseClient
              .from('call_participants')
              .insert({
                call_id: callId,
                user_id: user.id,
                role: callData.host_id === user.id ? 'host' : 'participant',
                joined_at: new Date().toISOString()
              });
              
            if (insertError) throw insertError;
          } else if (!existingParticipant.joined_at) {
            const { error: updateError } = await supabaseClient
              .from('call_participants')
              .update({ joined_at: new Date().toISOString() })
              .eq('id', existingParticipant.id);
              
            if (updateError) throw updateError;
          }

          // If this is the first join, update call status
          if (callData.status === 'scheduled') {
            const { error: updateError } = await supabaseClient
              .from('calls')
              .update({ 
                status: 'in_progress',
                started_at: new Date().toISOString()
              })
              .eq('id', callId);
              
            if (updateError) throw updateError;
          }

          return new Response(
            JSON.stringify({ success: true, call: callData }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error in join action:', error);
          return new Response(
            JSON.stringify({ error: error.message || 'Failed to join call' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'leave':
        try {
          // Update participant record when leaving
          const { data: participant, error: getParticipantError } = await supabaseClient
            .from('call_participants')
            .select('id')
            .eq('call_id', callId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (getParticipantError) throw getParticipantError;
          
          if (participant) {
            const { error: leaveError } = await supabaseClient
              .from('call_participants')
              .update({ left_at: new Date().toISOString() })
              .eq('id', participant.id);
                
            if (leaveError) throw leaveError;
          }

          // Check if all participants have left
          const { data: activeParticipants, error: checkError } = await supabaseClient
            .from('call_participants')
            .select('id')
            .eq('call_id', callId)
            .is('left_at', null);
            
          if (checkError) throw checkError;

          // If everyone left, mark the call as ended
          if (!activeParticipants || activeParticipants.length === 0) {
            const { error: updateError } = await supabaseClient
              .from('calls')
              .update({ 
                status: 'completed',
                ended_at: new Date().toISOString()
              })
              .eq('id', callId);
              
            if (updateError) throw updateError;
          }

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error in leave action:', error);
          return new Response(
            JSON.stringify({ error: error.message || 'Failed to leave call' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'signal':
        // Relay WebRTC signals between peers
        if (!signal || !targetUserId) {
          return new Response(
            JSON.stringify({ error: 'Missing signal or target user' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        try {
          // First verify both users are participants using direct participant queries
          const { data: userParticipant, error: userError } = await supabaseClient
            .from('call_participants')
            .select('user_id')
            .eq('call_id', callId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (userError) throw userError;
          
          if (!userParticipant) {
            return new Response(
              JSON.stringify({ error: 'You are not a participant in this call' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          const { data: targetParticipant, error: targetError } = await supabaseClient
            .from('call_participants')
            .select('user_id')
            .eq('call_id', callId)
            .eq('user_id', targetUserId)
            .maybeSingle();
            
          if (targetError) throw targetError;
          
          if (!targetParticipant) {
            return new Response(
              JSON.stringify({ error: 'Target user is not a participant in this call' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const { error: signalError } = await supabaseClient
            .from('rtc_signals')
            .insert({
              call_id: callId,
              from_user_id: user.id,
              to_user_id: targetUserId,
              signal: signal,
              created_at: new Date().toISOString()
            });
            
          if (signalError) throw signalError;

          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error in signal action:', error);
          return new Response(
            JSON.stringify({ error: error.message || 'Failed to relay signal' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in call-signaling function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
