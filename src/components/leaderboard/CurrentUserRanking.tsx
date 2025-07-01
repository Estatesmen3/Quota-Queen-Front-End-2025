
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MoveUp, Target, UserCircle2 } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';
import { useAuth } from "@/context/AuthContext";

interface CurrentUserRankingProps {
  currentUserRank: LeaderboardEntry;
}

const CurrentUserRanking = ({ currentUserRank }: CurrentUserRankingProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  if (!currentUserRank) return null;
  
  return (
    <Card className="border-2 border-dopamine-purple/20 shadow-md overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Your Current Ranking</CardTitle>
          <Badge variant="outline" className="bg-dopamine-purple/10 text-dopamine-purple">
            Rank #{currentUserRank.rank}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/student/profile/${currentUserRank.id}`)}
          >
            <Avatar className="h-10 w-10 border-2 border-dopamine-pink/50">
              <AvatarImage src={profile?.avatar_url || currentUserRank.avatar} alt="Your profile" />
              <AvatarFallback><UserCircle2 className="h-6 w-6" /></AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium flex items-center gap-2">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : currentUserRank.name}
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                {currentUserRank.change > 0 && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
                    <MoveUp className="h-3 w-3 mr-1" />
                    Moving Up
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentUserRank.score} points
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center justify-end gap-2">
              Progress to next rank
              <Target className="h-4 w-4 text-dopamine-purple" />
            </div>
            <div className="flex items-center gap-3">
              <Progress 
                value={75} 
                className="w-[200px]" 
                indicatorClassName="bg-gradient-to-r from-dopamine-purple to-dopamine-pink" 
              />
              <span className="text-sm font-medium">75%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentUserRanking;
