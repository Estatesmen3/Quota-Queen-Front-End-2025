
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

    // Get all users the current user has exchanged messages with
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select('recipient_id')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (sentError) {
      throw sentError;
    }

    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (receivedError) {
      throw receivedError;
    }

    // Extract unique user IDs
    const uniqueUserIds = new Set<string>();
    sentMessages?.forEach(msg => uniqueUserIds.add(msg.recipient_id));
    receivedMessages?.forEach(msg => uniqueUserIds.add(msg.sender_id));
    
    // If no conversations, return empty array
    if (uniqueUserIds.size === 0) {
      return new Response(JSON.stringify({ 
        conversations: [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get profiles of conversation partners
    const userIdsArray = Array.from(uniqueUserIds);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, user_type')
      .in('id', userIdsArray);

    if (profilesError) {
      throw profilesError;
    }

    // Get last message and unread count for each conversation
    const conversations = await Promise.all(
      profiles?.map(async (profile) => {
        // Get the last message in the conversation
        const { data: lastMessage, error: lastMessageError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (lastMessageError && lastMessageError.code !== 'PGRST116') {
          console.error('Error fetching last message:', lastMessageError);
          return null;
        }

        // Count unread messages
        const { count: unreadCount, error: unreadError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', profile.id)
          .eq('recipient_id', user.id)
          .eq('read', false);

        if (unreadError) {
          console.error('Error counting unread messages:', unreadError);
          return null;
        }

        // Build conversation object
        return {
          id: profile.id, // Use the other user's ID as the conversation ID
          with_user_id: profile.id,
          with_user_name: `${profile.first_name} ${profile.last_name}`,
          with_user_avatar: profile.avatar_url,
          with_user_type: profile.user_type,
          last_message: lastMessage?.content || 'Start a conversation',
          last_message_time: lastMessage?.created_at || new Date().toISOString(),
          unread_count: unreadCount || 0
        };
      }) || []
    );

    // Filter out null values and sort by last message time
    const validConversations = conversations.filter(c => c !== null).sort((a, b) => {
      return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
    });

    return new Response(JSON.stringify({ 
      conversations: validConversations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in get-conversations function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
