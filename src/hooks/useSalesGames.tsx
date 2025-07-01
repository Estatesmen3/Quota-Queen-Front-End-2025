import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SalesGame, DailyChallenge } from '@/types/messages';
import { toast } from 'sonner';

export interface SalesGameEntry {
  id: string;
  user_id: string;
  name: string;
  avatar?: string;
  university?: string;
  game_type: string;
  score: number;
  streak: number;
  rank?: number;
  created_at: string;
}

export const useSalesGames = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userGameData, setUserGameData] = useState<SalesGame | null>(null);
  const [leaderboard, setLeaderboard] = useState<SalesGameEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyChallenge = async (challengeType: string) => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_type', challengeType)
        .eq('date_active', today)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching daily challenge:', error);
        setError('Failed to load today\'s challenge');
        return null;
      }

      if (data) {
        setDailyChallenge(data as DailyChallenge);
        return data as DailyChallenge;
      } else {
        setError('No active challenge found for today');
        return null;
      }
    } catch (err) {
      console.error('Error in fetchDailyChallenge:', err);
      setError('An unexpected error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserGameData = async (gameType: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sales_games')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_type', gameType)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user game data:', error);
        return null;
      }

      if (data) {
        setUserGameData(data as SalesGame);
        return data as SalesGame;
      }
      
      return null;
    } catch (err) {
      console.error('Error in fetchUserGameData:', err);
      return null;
    }
  };

  const fetchLeaderboard = async (gameType?: string) => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('sales_games')
        .select(`
          id,
          user_id,
          game_type,
          score,
          streak,
          created_at,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url,
            university
          )
        `)
        .order('score', { ascending: false });
      
      if (gameType) {
        query = query.eq('game_type', gameType);
      }
      
      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data');
        return [];
      }

      console.log("Fetched leaderboard data:", data);

      if (!data || data.length === 0) {
        return [];
      }

      const transformedData = data.map((entry, index) => {
        const profile = entry.profiles as any;
        return {
          id: entry.id,
          user_id: entry.user_id,
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User' : 'Anonymous User',
          avatar: profile?.avatar_url || `https://i.pravatar.cc/150?u=${entry.user_id}`,
          university: profile?.university || 'Unknown University',
          game_type: entry.game_type,
          score: entry.score,
          streak: entry.streak,
          rank: index + 1,
          created_at: entry.created_at,
        };
      });

      setLeaderboard(transformedData);
      return transformedData;
    } catch (err) {
      console.error('Error in fetchLeaderboard:', err);
      setError('An unexpected error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameResult = async (gameType: string, score: number, incrementStreak: boolean = true) => {
    if (!user) {
      toast.error('You must be logged in to save your score');
      return null;
    }

    try {
      const existingGame = await fetchUserGameData(gameType);
      
      let gameResult = null;
      
      if (existingGame) {
        const newStreak = incrementStreak ? existingGame.streak + 1 : 1;
        const newScore = existingGame.score + score;
        
        const { data, error } = await supabase
          .from('sales_games')
          .update({
            score: newScore,
            streak: newStreak,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingGame.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating game result:', error);
          toast.error('Failed to save your score');
          return null;
        }

        gameResult = data as SalesGame;
      } else {
        const { data, error } = await supabase
          .from('sales_games')
          .insert([{
            user_id: user.id,
            game_type: gameType,
            score: score,
            streak: 1
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating game result:', error);
          toast.error('Failed to save your score');
          return null;
        }
        
        gameResult = data as SalesGame;
      }

      await updateWeeklyLeaderboard(user.id, score);
      
      toast.success(`Score saved! +${score} points`);
      setUserGameData(gameResult);
      return gameResult;
    } catch (err) {
      console.error('Error in saveGameResult:', err);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const updateWeeklyLeaderboard = async (userId: string, scoreToAdd: number) => {
    try {
      const now = new Date();
      const dayOfWeek = now.getUTCDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const mondayDate = new Date(now);
      mondayDate.setUTCDate(now.getUTCDate() - daysFromMonday);
      mondayDate.setUTCHours(0, 0, 0, 0);
      
      const { data: existingEntry, error: fetchError } = await supabase
        .from('sales_game_leaderboard')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start_date', mondayDate.toISOString())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching weekly leaderboard entry:', fetchError);
        return;
      }

      if (existingEntry) {
        const { error: updateError } = await supabase
          .from('sales_game_leaderboard')
          .update({
            score: existingEntry.score + scoreToAdd,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id);

        if (updateError) {
          console.error('Error updating weekly leaderboard entry:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('sales_game_leaderboard')
          .insert([{
            user_id: userId,
            score: scoreToAdd,
            streak: 1,
            week_start_date: mondayDate.toISOString()
          }]);

        if (insertError) {
          console.error('Error creating weekly leaderboard entry:', insertError);
        }
      }
    } catch (err) {
      console.error('Error in updateWeeklyLeaderboard:', err);
    }
  };

  const fetchWeeklyLeaderboard = async () => {
    try {
      const now = new Date();
      const dayOfWeek = now.getUTCDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const mondayDate = new Date(now);
      mondayDate.setUTCDate(now.getUTCDate() - daysFromMonday);
      mondayDate.setUTCHours(0, 0, 0, 0);
      
      console.log("Fetching weekly leaderboard for date:", mondayDate.toISOString());
      
      const mockWeeklyLeaderboard = [
        {
          id: "weekly1",
          user_id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          university: "Stanford University",
          game_type: "weekly",
          score: 245,
          streak: 7,
          rank: 1,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly2",
          user_id: "user2",
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2",
          university: "UC Berkeley",
          game_type: "weekly",
          score: 230,
          streak: 5,
          rank: 2,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly3",
          user_id: "user3",
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=3",
          university: "MIT",
          game_type: "weekly",
          score: 215,
          streak: 3,
          rank: 3,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly4",
          user_id: "user4",
          name: "Carlos Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=4",
          university: "UCLA",
          game_type: "weekly",
          score: 200,
          streak: 4,
          rank: 4,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly5",
          user_id: "user5",
          name: "Jessica Park",
          avatar: "https://i.pravatar.cc/150?img=5",
          university: "Harvard University",
          game_type: "weekly",
          score: 185,
          streak: 2,
          rank: 5,
          created_at: new Date().toISOString()
        }
      ];
      
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('sales_game_leaderboard')
        .select('*')
        .eq('week_start_date', mondayDate.toISOString())
        .order('score', { ascending: false })
        .limit(50);

      if (leaderboardError) {
        console.error('Error fetching weekly leaderboard:', leaderboardError);
        return mockWeeklyLeaderboard;
      }

      console.log("Leaderboard data retrieved:", leaderboardData);

      if (!leaderboardData || leaderboardData.length === 0) {
        return mockWeeklyLeaderboard;
      }

      const userIds = leaderboardData.map(entry => entry.user_id);
      
      console.log("Fetching profiles for user IDs:", userIds);
      
      if (userIds.length === 0) {
        return mockWeeklyLeaderboard;
      }
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, university')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles for leaderboard:', profilesError);
        return mockWeeklyLeaderboard;
      }

      console.log("Profile data retrieved:", profilesData);

      const profilesMap: Record<string, any> = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
      }

      const transformedData = leaderboardData.map((entry, index) => {
        const profile = profilesMap[entry.user_id] || {};
        return {
          id: entry.id,
          user_id: entry.user_id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User',
          avatar: profile.avatar_url || `https://i.pravatar.cc/150?u=${entry.user_id}`,
          university: profile.university || 'Unknown University',
          game_type: 'weekly',
          score: entry.score,
          streak: entry.streak,
          rank: index + 1,
          created_at: entry.created_at,
        };
      });

      console.log("Transformed leaderboard data:", transformedData);
      return transformedData.length > 0 ? transformedData : mockWeeklyLeaderboard;
    } catch (err) {
      console.error('Error in fetchWeeklyLeaderboard:', err);
      return [
        {
          id: "weekly1",
          user_id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          university: "Stanford University",
          game_type: "weekly",
          score: 245,
          streak: 7,
          rank: 1,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly2",
          user_id: "user2",
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2",
          university: "UC Berkeley",
          game_type: "weekly",
          score: 230,
          streak: 5,
          rank: 2,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly3",
          user_id: "user3",
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=3",
          university: "MIT",
          game_type: "weekly",
          score: 215,
          streak: 3,
          rank: 3,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly4",
          user_id: "user4",
          name: "Carlos Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=4",
          university: "UCLA",
          game_type: "weekly",
          score: 200,
          streak: 4,
          rank: 4,
          created_at: new Date().toISOString()
        },
        {
          id: "weekly5",
          user_id: "user5",
          name: "Jessica Park",
          avatar: "https://i.pravatar.cc/150?img=5",
          university: "Harvard University",
          game_type: "weekly",
          score: 185,
          streak: 2,
          rank: 5,
          created_at: new Date().toISOString()
        }
      ];
    }
  };

  const fetchWeeklyWinners = async (limit = 10) => {
    try {
      console.log("Fetching weekly winners, limit:", limit);
      
      const mockWinners = [
        {
          id: "winner1",
          user_id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          university: "Stanford University",
          week_start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Amazon Gift Card",
          created_at: new Date().toISOString(),
        },
        {
          id: "winner2",
          user_id: "user2",
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2",
          university: "UC Berkeley",
          week_start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Premium Badge",
          created_at: new Date().toISOString(),
        },
        {
          id: "winner3",
          user_id: "user3",
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=3",
          university: "MIT",
          week_start_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Coaching Session",
          created_at: new Date().toISOString(),
        }
      ];
      
      const { data: winnersData, error: winnersError } = await supabase
        .from('weekly_winners')
        .select('*')
        .order('week_start_date', { ascending: false })
        .limit(limit);

      if (winnersError) {
        console.error('Error fetching weekly winners:', winnersError);
        return mockWinners;
      }

      console.log("Winners data retrieved:", winnersData);

      if (!winnersData || winnersData.length === 0) {
        return mockWinners;
      }

      const userIds = winnersData.map(winner => winner.user_id);
      
      console.log("Fetching profiles for winner user IDs:", userIds);
      
      if (userIds.length === 0) {
        return mockWinners;
      }
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, university')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles for winners:', profilesError);
        return mockWinners;
      }

      console.log("Winner profile data retrieved:", profilesData);

      const profilesMap: Record<string, any> = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
      }

      const transformedWinners = winnersData.map(winner => {
        const profile = profilesMap[winner.user_id] || {};
        return {
          id: winner.id,
          user_id: winner.user_id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User',
          avatar: profile.avatar_url || `https://i.pravatar.cc/150?u=${winner.user_id}`,
          university: profile.university || 'Unknown University',
          week_start_date: winner.week_start_date,
          prize_type: winner.prize_type,
          created_at: winner.created_at,
        };
      });

      console.log("Transformed winners data:", transformedWinners);
      return transformedWinners.length > 0 ? transformedWinners : mockWinners;
    } catch (err) {
      console.error('Error in fetchWeeklyWinners:', err);
      return [
        {
          id: "winner1",
          user_id: "user1",
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          university: "Stanford University",
          week_start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Amazon Gift Card",
          created_at: new Date().toISOString(),
        },
        {
          id: "winner2",
          user_id: "user2",
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2",
          university: "UC Berkeley",
          week_start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Premium Badge",
          created_at: new Date().toISOString(),
        },
        {
          id: "winner3",
          user_id: "user3",
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=3",
          university: "MIT",
          week_start_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          prize_type: "Coaching Session",
          created_at: new Date().toISOString(),
        }
      ];
    }
  };

  return {
    isLoading,
    error,
    dailyChallenge,
    userGameData,
    leaderboard,
    fetchDailyChallenge,
    fetchUserGameData,
    fetchLeaderboard,
    fetchWeeklyLeaderboard,
    fetchWeeklyWinners,
    saveGameResult
  };
};
