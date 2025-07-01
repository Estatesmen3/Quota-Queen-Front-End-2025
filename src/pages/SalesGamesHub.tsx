
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleHelp, BrainCircuit, Puzzle, Trophy, Dices } from 'lucide-react';
import { useSalesGames } from '@/hooks/useSalesGames';

const SalesGamesHub = () => {
  const navigate = useNavigate();
  const { fetchLeaderboard } = useSalesGames();

  React.useEffect(() => {
    // Load leaderboard data when component mounts
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Games</h1>
            <p className="text-muted-foreground">
              Practice your sales skills with these fun daily challenges
            </p>
          </div>
          <Button onClick={() => navigate('/student/leaderboard')} variant="outline">
            <Trophy className="mr-2 h-4 w-4" />
            View Leaderboard
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Objection Challenge Card */}
          <Card className="overflow-hidden border-b-4 border-b-dopamine-blue">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <CircleHelp className="h-5 w-5 text-dopamine-blue" />
                Objection Challenge
              </CardTitle>
              <CardDescription>Counter objections like a pro</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Test your ability to handle complex sales objections and improve your responses.
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Button className="w-full" onClick={() => navigate('/student/sales-games/objection')}>
                Play Now
              </Button>
            </CardFooter>
          </Card>

          {/* Sales Wordle Card */}
          <Card className="overflow-hidden border-b-4 border-b-dopamine-green">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-dopamine-green" />
                Swordle
              </CardTitle>
              <CardDescription>Guess the sales term</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Expand your sales vocabulary by guessing the daily sales-related word.
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Button className="w-full" onClick={() => navigate('/student/sales-games/wordle')}>
                Play Now
              </Button>
            </CardFooter>
          </Card>

          {/* Negotiation Master Card */}
          <Card className="overflow-hidden border-b-4 border-b-dopamine-purple">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-dopamine-purple" />
                Negotiation Master
              </CardTitle>
              <CardDescription>Practice your negotiation skills</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Master the art of negotiation with daily scenarios and challenges.
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <Button className="w-full" onClick={() => navigate('/student/sales-games/negotiation')}>
                Play Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesGamesHub;
