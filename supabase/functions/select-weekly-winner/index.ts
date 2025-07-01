
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

// This edge function will be scheduled to run every Sunday at 11:59 PM
// It will select the top player from the weekly leaderboard and add them to the weekly winners table

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Get Monday date for the current week
const getCurrentWeekMonday = () => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const mondayDate = new Date(now);
  mondayDate.setUTCDate(now.getUTCDate() - daysFromMonday);
  mondayDate.setUTCHours(0, 0, 0, 0);
  return mondayDate;
};

// Main handler function
Deno.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the current week's Monday date
    const mondayDate = getCurrentWeekMonday();
    
    // Select the top player from the weekly leaderboard
    const { data: topPlayers, error: leaderboardError } = await supabase
      .from('sales_game_leaderboard')
      .select('user_id, score, streak')
      .eq('week_start_date', mondayDate.toISOString())
      .order('score', { ascending: false })
      .limit(1);

    if (leaderboardError) {
      console.error('Error fetching top player:', leaderboardError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch top player', details: leaderboardError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If no players found, return a message
    if (!topPlayers || topPlayers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No players found for this week' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const topPlayer = topPlayers[0];
    
    // Check if this player is already in the weekly winners for this week
    const { data: existingWinner, error: winnerCheckError } = await supabase
      .from('weekly_winners')
      .select('id')
      .eq('user_id', topPlayer.user_id)
      .eq('week_start_date', mondayDate.toISOString())
      .maybeSingle();

    if (winnerCheckError) {
      console.error('Error checking existing winner:', winnerCheckError);
      return new Response(
        JSON.stringify({ error: 'Failed to check for existing winner', details: winnerCheckError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If player is already registered as a winner, return a message
    if (existingWinner) {
      return new Response(
        JSON.stringify({ message: 'Winner already registered for this week' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add the top player to the weekly winners table
    const { data: newWinner, error: insertError } = await supabase
      .from('weekly_winners')
      .insert([
        {
          user_id: topPlayer.user_id,
          week_start_date: mondayDate.toISOString(),
          prize_type: 'badge' // Default prize type
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting winner:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to register winner', details: insertError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        message: 'Weekly winner selected and registered successfully',
        winner: newWinner
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
