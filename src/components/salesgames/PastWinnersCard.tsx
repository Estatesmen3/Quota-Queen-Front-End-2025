
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Calendar, ExternalLink } from 'lucide-react';

interface WeeklyWinner {
  id: string;
  user_id: string;
  name: string;
  avatar?: string;
  university?: string;
  week_start_date: string;
  prize_type: string;
  created_at: string;
}

interface PastWinnersCardProps {
  weeklyWinners: WeeklyWinner[];
  handleUserClick: (userId: string) => void;
}

const PastWinnersCard = ({ weeklyWinners, handleUserClick }: PastWinnersCardProps) => {
  return (
    <Card className="md:w-80 border-2 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/10">
        <CardTitle className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-dopamine-purple" />
          Past Weekly Champions
        </CardTitle>
        <CardDescription>
          Top performers from previous weeks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {weeklyWinners.length > 0 ? (
            weeklyWinners.map((winner) => {
              const weekDate = new Date(winner.week_start_date);
              const formattedDate = format(weekDate, 'MMM d, yyyy');
              
              return (
                <div 
                  key={winner.id} 
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleUserClick(winner.user_id)}
                >
                  <Avatar className="h-10 w-10 border-2 border-dopamine-pink">
                    <AvatarImage src={winner.avatar} alt={winner.name} />
                    <AvatarFallback>{winner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {winner.name}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Week of {formattedDate}
                    </div>
                  </div>
                  
                  <Badge className="ml-auto bg-gradient-to-r from-dopamine-purple to-dopamine-pink">
                    🏆 Winner
                  </Badge>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No winners yet. The first champion will be crowned this Sunday!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PastWinnersCard;
