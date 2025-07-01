
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { transcript, sessionId, sessionType, call_id, recording_url } = await req.json()
    
    let finalTranscript = transcript;
    
    // If we have a recording URL but no transcript, attempt to transcribe the audio
    if (recording_url && !transcript) {
      console.log(`Transcribing recording from ${recording_url} for ${sessionType} ${call_id || sessionId}`)
      
      try {
        // Fetch the recording file
        const fileResponse = await fetch(recording_url, {
          headers: {
            'Authorization': req.headers.get('Authorization') || '',
            'apikey': req.headers.get('apikey') || '',
          },
        });
        
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch recording: ${fileResponse.status}`);
        }
        
        // Get the audio file as a blob
        const audioBlob = await fileResponse.blob();
        
        // Convert to base64
        const buffer = await audioBlob.arrayBuffer();
        const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        
        // Call OpenAI's Whisper API for transcription
        const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
          body: new FormData().append('file', new Blob([buffer], { type: 'audio/webm' }))
            .append('model', 'whisper-1')
            .append('response_format', 'text'),
        });
        
        if (!transcriptionResponse.ok) {
          const errorText = await transcriptionResponse.text();
          throw new Error(`Transcription failed: ${errorText}`);
        }
        
        finalTranscript = await transcriptionResponse.text();
        console.log('Transcription successful:', finalTranscript.substring(0, 100) + '...');
        
        // If this is a call, update the calls table with the transcript
        if (sessionType === 'call' && call_id) {
          await fetch(
            `${req.headers.get('origin')}/rest/v1/calls?id=eq.${call_id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': req.headers.get('apikey') || '',
                'Authorization': req.headers.get('Authorization') || '',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({
                transcript_url: finalTranscript,
              }),
            }
          );
        }
      } catch (transcriptionError) {
        console.error('Error transcribing audio:', transcriptionError);
        
        // Log the error to call_logs if this is a call
        if (call_id) {
          try {
            await fetch(
              `${req.headers.get('origin')}/rest/v1/call_logs`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': req.headers.get('apikey') || '',
                  'Authorization': req.headers.get('Authorization') || '',
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  call_id: call_id,
                  log_type: 'transcription_error',
                  message: transcriptionError.message || 'Failed to transcribe recording',
                }),
              }
            );
          } catch (logError) {
            console.error('Error logging transcription error:', logError);
          }
        }
        
        // Continue with any transcript we might already have
      }
    }

    if (!finalTranscript) {
      throw new Error('Transcript is required for analysis')
    }

    if (!sessionId && !call_id) {
      throw new Error('Session ID or Call ID is required')
    }

    console.log(`Analyzing ${sessionType} ${call_id || sessionId}`)

    // Call OpenAI to analyze the transcript
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert sales coach AI analyzing a sales conversation transcript. 
            Analyze the following aspects:
            1. Talk Ratio (How much the salesperson talks vs. listens)
            2. Objection Handling (How well objections are addressed)
            3. Confidence (Based on language, tone indicators)
            4. Sentiment (Overall positivity of the conversation)
            5. Key Strengths (3-5 points)
            6. Areas for Improvement (3-5 points)
            7. Coaching Tips (3-5 actionable suggestions)
            
            Provide a score from 0-100 for the overall performance.
            Format your response as a JSON object with the following structure:
            {
              "score": number,
              "strengths": string[],
              "weaknesses": string[],
              "improvement_tips": string[]
            }`
          },
          {
            role: 'user',
            content: `Here is the sales conversation transcript to analyze:\n\n${finalTranscript}`
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    })

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${analysisResponse.status}`)
    }

    const analysisData = await analysisResponse.json()
    const analysis = JSON.parse(analysisData.choices[0].message.content)

    // For roleplay sessions, save the analysis to the ai_feedback table
    if (sessionType === 'roleplay' && sessionId) {
      const { data: existingFeedback, error: fetchError } = await fetch(
        `${req.headers.get('origin')}/rest/v1/ai_feedback?roleplay_session_id=eq.${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': req.headers.get('apikey') || '',
            'Authorization': req.headers.get('authorization') || '',
          },
        }
      ).then(res => res.json())

      if (fetchError) {
        console.error('Error fetching existing feedback:', fetchError)
      }

      // If feedback exists, update it; otherwise, create new
      const method = existingFeedback?.length > 0 ? 'PATCH' : 'POST'
      const url = existingFeedback?.length > 0 
        ? `${req.headers.get('origin')}/rest/v1/ai_feedback?roleplay_session_id=eq.${sessionId}`
        : `${req.headers.get('origin')}/rest/v1/ai_feedback`

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': req.headers.get('apikey') || '',
          'Authorization': req.headers.get('authorization') || '',
          'Prefer': method === 'POST' ? 'return=minimal' : 'return=representation',
        },
        body: JSON.stringify({
          ...method === 'POST' && { roleplay_session_id: sessionId },
          score: analysis.score,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          improvement_tips: analysis.improvement_tips,
        }),
      })
    } 
    // For calls, save the analysis to the ai_feedback table using call_id
    else if (sessionType === 'call' && call_id) {
      const { data: existingFeedback, error: fetchError } = await fetch(
        `${req.headers.get('origin')}/rest/v1/ai_feedback?roleplay_session_id=eq.${call_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': req.headers.get('apikey') || '',
            'Authorization': req.headers.get('authorization') || '',
          },
        }
      ).then(res => res.json())

      if (fetchError) {
        console.error('Error fetching existing feedback:', fetchError)
      }

      // If feedback exists, update it; otherwise, create new
      const method = existingFeedback?.length > 0 ? 'PATCH' : 'POST'
      const url = existingFeedback?.length > 0 
        ? `${req.headers.get('origin')}/rest/v1/ai_feedback?roleplay_session_id=eq.${call_id}`
        : `${req.headers.get('origin')}/rest/v1/ai_feedback`

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': req.headers.get('apikey') || '',
          'Authorization': req.headers.get('authorization') || '',
          'Prefer': method === 'POST' ? 'return=minimal' : 'return=representation',
        },
        body: JSON.stringify({
          ...method === 'POST' && { roleplay_session_id: call_id },
          score: analysis.score,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          improvement_tips: analysis.improvement_tips,
        }),
      })

      // Update the call to mark AI feedback as processed
      await fetch(
        `${req.headers.get('origin')}/rest/v1/calls?id=eq.${call_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': req.headers.get('apikey') || '',
            'Authorization': req.headers.get('authorization') || '',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            is_ai_feedback_processed: true,
          }),
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in analyze-speech function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
