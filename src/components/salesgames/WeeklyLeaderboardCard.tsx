
import React from 'react';
import { format } from 'date-fns';
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trophy, 
  Crown, 
  Star,
  Award,
  Flame,
  Calendar,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SalesGameEntry } from '@/hooks/useSalesGames';

interface WeeklyLeaderboardCardProps {
  weeklyLeaderboard: SalesGameEntry[];
  handleUserClick: (userId: string) => void;
  getCurrentWeekRange: () => string;
  renderRankIcon: (rank: number) => React.ReactNode;
}

const WeeklyLeaderboardCard = ({ 
  weeklyLeaderboard, 
  handleUserClick, 
  getCurrentWeekRange,
  renderRankIcon 
}: WeeklyLeaderboardCardProps) => {
  const { profile } = useAuth();
  
  return (
    <Card className="flex-1 border-2 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-dopamine-green/10 to-dopamine-blue/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-dopamine-green" />
              Weekly Games Leaderboard
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {getCurrentWeekRange()} (Resets Every Monday)
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-dopamine-green/10 text-dopamine-green">
            🎮 Games Only
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {weeklyLeaderboard.length > 0 ? (
            weeklyLeaderboard.slice(0, 10).map((entry) => (
              <div 
                key={entry.id} 
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                  entry.rank && entry.rank <= 3 && "bg-gradient-to-r from-dopamine-green/5 to-dopamine-blue/5"
                )}
                onClick={() => handleUserClick(entry.user_id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex items-center justify-center min-w-8 h-8 rounded-full font-semibold",
                    entry.rank <= 3 ? 
                      "bg-gradient-to-r from-dopamine-green to-dopamine-blue text-white" : 
                      "bg-primary/10 text-primary"
                  )}>
                    {renderRankIcon(entry.rank || 0)}
                  </div>
                  
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {entry.name}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      {entry.streak && entry.streak > 3 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200">
                          <Flame className="h-3 w-3 mr-1" /> {entry.streak} day streak
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {entry.university || 'University not specified'}
                    </div>
                  </div>
                </div>
                
                <div className="font-semibold">{entry.score} pts</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No game scores recorded for this week yet. Be the first to play!
            </div>
          )}
        </div>
        
        {weeklyLeaderboard.length > 0 && (
          <div className="p-4 bg-muted/30 text-center text-sm text-muted-foreground">
            <p>The weekly winner is announced every Sunday at 11:59 PM!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyLeaderboardCard;
