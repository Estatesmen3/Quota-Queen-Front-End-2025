
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
    // Check if request is authorized
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Create a Supabase client with the user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get request parameters
    const url = new URL(req.url);
    const conversationPartnerId = url.searchParams.get('userId');
    
    if (!conversationPartnerId) {
      return new Response(JSON.stringify({ error: 'Missing userId parameter' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get messages between the two users
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .or(`sender_id.eq.${conversationPartnerId},recipient_id.eq.${conversationPartnerId}`)
      .order('created_at', { ascending: true });

    if (messagesError) {
      throw messagesError;
    }

    // Mark messages as read
    const unreadMessageIds = messages
      ?.filter(m => m.recipient_id === user.id && m.sender_id === conversationPartnerId && !m.read)
      .map(m => m.id) || [];
    
    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessageIds);
    }

    // Get conversation partner profile for additional info
    const { data: partnerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url, user_type')
      .eq('id', conversationPartnerId)
      .single();

    if (profileError) {
      console.error('Error fetching partner profile:', profileError);
    }

    return new Response(JSON.stringify({ 
      messages: messages || [],
      conversation_id: conversationPartnerId,
      partner: partnerProfile || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in get-messages function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
