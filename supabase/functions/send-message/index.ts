
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

    // Get request body
    const { recipientId, message, messageId, fileUrl, fileName } = await req.json();
    
    // Handle message editing if messageId is provided
    if (messageId) {
      const { data: existingMessage, error: messageCheckError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .eq('sender_id', user.id)
        .single();
      
      if (messageCheckError || !existingMessage) {
        return new Response(JSON.stringify({ error: 'Message not found or you do not have permission to edit it' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        });
      }
      
      const { data: updatedMessage, error: updateError } = await supabase
        .from('messages')
        .update({ 
          content: message,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select();
      
      if (updateError) {
        console.error('Error updating message:', updateError);
        return new Response(JSON.stringify({ error: 'Error updating message' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Message updated successfully',
        data: updatedMessage[0]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Handle sending new message
    if (!recipientId || (!message && !fileUrl)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get sender profile
    const { data: senderProfile, error: senderProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (senderProfileError) {
      console.error('Error fetching sender profile:', senderProfileError);
      return new Response(JSON.stringify({ error: 'Error fetching sender profile' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Verify recipient exists
    const { data: recipientProfile, error: recipientProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', recipientId)
      .single();

    if (recipientProfileError || !recipientProfile) {
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Store the message with current timestamp to ensure it appears at the top
    const now = new Date().toISOString();
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user.id,
          recipient_id: recipientId,
          content: message || `Sent a file: ${fileName || 'attachment'}`,
          file_url: fileUrl,
          file_name: fileName,
          is_read: false,
          is_edited: false,
          created_at: now
        }
      ])
      .select();

    if (messageError) {
      console.error('Error sending message:', messageError);
      return new Response(JSON.stringify({ error: 'Error sending message' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Send email notification about new message (could be implemented with a third-party email service)
    // This is a placeholder for email notification logic
    console.log(`Email notification would be sent to recipient ${recipientId} about new message`);

    // Return the message data along with recipient information for UI updates
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully',
      data: {
        ...messageData[0],
        recipient: {
          id: recipientProfile.id,
          name: `${recipientProfile.first_name} ${recipientProfile.last_name}`,
          avatar: recipientProfile.avatar_url,
          user_type: recipientProfile.user_type
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-message function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
