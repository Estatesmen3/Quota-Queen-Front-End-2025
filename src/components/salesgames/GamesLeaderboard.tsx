
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Loader2, Trophy, Award, Star, Crown, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useSalesGames, SalesGameEntry } from '@/hooks/useSalesGames';
import { toast } from 'sonner';
import WeeklyLeaderboardCard from './WeeklyLeaderboardCard';
import PastWinnersCard from './PastWinnersCard';

const GamesLeaderboard = () => {
  const { fetchWeeklyLeaderboard, fetchWeeklyWinners } = useSalesGames();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<SalesGameEntry[]>([]);
  const [weeklyWinners, setWeeklyWinners] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Fetch leaderboard data
        const leaderboardData = await fetchWeeklyLeaderboard();
        console.log("Weekly leaderboard data:", leaderboardData);
        setWeeklyLeaderboard(leaderboardData || []);
        
        // Fetch winners data
        const winnersData = await fetchWeeklyWinners(5);
        console.log("Weekly winners data:", winnersData);
        setWeeklyWinners(winnersData || []);
      } catch (error) {
        console.error('Error loading games leaderboard data:', error);
        setLoadingError('Failed to load leaderboard data. Please try again later.');
        toast.error('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchWeeklyLeaderboard, fetchWeeklyWinners]);

  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const mondayDate = new Date(now);
    mondayDate.setUTCDate(now.getUTCDate() - daysFromMonday);
    
    const sundayDate = new Date(mondayDate);
    sundayDate.setUTCDate(mondayDate.getUTCDate() + 6);
    
    return `${format(mondayDate, 'MMM d')} - ${format(sundayDate, 'MMM d, yyyy')}`;
  };

  const renderRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Crown className="text-dopamine-pink h-5 w-5" />;
    } else if (rank === 2) {
      return <Star className="text-dopamine-purple h-5 w-5" />;
    } else if (rank === 3) {
      return <Award className="text-dopamine-blue h-5 w-5" />;
    }
    return <span className="font-bold">{rank}</span>;
  };

  const handleUserClick = (userId: string) => {
    // Route to the appropriate profile page based on user type
    if (profile?.user_type === 'recruiter') {
      navigate(`/recruiter/student/${userId}`);
    } else {
      navigate(`/student/profile/${userId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 mr-2 animate-spin text-dopamine-blue" />
        <span>Loading leaderboard data...</span>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-red-500">
          <span className="font-semibold">Error loading leaderboard:</span> {loadingError}
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Weekly Leaderboard */}
        <WeeklyLeaderboardCard 
          weeklyLeaderboard={weeklyLeaderboard}
          handleUserClick={handleUserClick}
          getCurrentWeekRange={getCurrentWeekRange}
          renderRankIcon={renderRankIcon}
        />

        {/* Past Winners */}
        <PastWinnersCard 
          weeklyWinners={weeklyWinners}
          handleUserClick={handleUserClick}
        />
      </div>
    </div>
  );
};

export default GamesLeaderboard;
