
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, Award, Star, Crown, Flame, Sparkles, GraduationCap,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  showAllEntries: boolean;
  toggleShowAllEntries: () => void;
  currentPage: number;
  totalPages: number;
  navigateToPage: (page: number) => void;
  generatePageNumbers: () => number[];
}

const LeaderboardTable = ({ 
  entries, 
  showAllEntries, 
  toggleShowAllEntries,
  currentPage,
  totalPages,
  navigateToPage,
  generatePageNumbers
}: LeaderboardTableProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [visibleAnimation, setVisibleAnimation] = useState<string | null>(null);

  const handleViewProfile = (userId: string) => {
    setVisibleAnimation(userId);
    
    setTimeout(() => {
      setVisibleAnimation(null);
      if (profile?.user_type === 'recruiter') {
        navigate(`/recruiter/student/${userId}`);
      } else {
        navigate(`/student/profile/${userId}`);
      }
    }, 800);
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

  return (
    <Card className="overflow-hidden border-2 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-background via-dopamine-purple/5 to-dopamine-pink/5">
        <CardTitle>Overall Performance</CardTitle>
        <CardDescription>
          Students ranked by overall performance across all challenges
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div 
                key={entry.id} 
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors relative overflow-hidden",
                  entry.highlighted && "bg-gradient-to-r from-dopamine-purple/5 to-dopamine-pink/5",
                  visibleAnimation === entry.id && "bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/10"
                )}
              >
                {visibleAnimation === entry.id && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="animate-fade-in absolute inset-0 bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/10 pulse-animation"></div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex items-center justify-center min-w-8 h-8 rounded-full font-semibold",
                    entry.rank <= 3 ? 
                      "bg-gradient-to-r from-dopamine-purple to-dopamine-pink text-white" : 
                      "bg-primary/10 text-primary"
                  )}>
                    {renderRankIcon(entry.rank)}
                  </div>
                  
                  <Avatar className={cn(
                    "h-10 w-10 border transition-all",
                    entry.rank <= 3 ? "border-dopamine-pink animate-pulse-subtle" : "border-primary/10",
                    visibleAnimation === entry.id && "scale-110 border-primary"
                  )}>
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 inline mr-1" />
                      {entry.university}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {entry.streak && entry.streak > 3 && (
                    <div className="hidden md:flex items-center gap-1 text-xs font-medium text-orange-500">
                      <Flame className="h-3.5 w-3.5" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 max-w-[200px] hidden md:flex">
                    {entry.badges && entry.badges.map((badge) => (
                      <Badge 
                        key={badge} 
                        variant={badge === "Quota Queen" ? "quotaQueen" : "secondary"}
                        className={cn(
                          "text-xs",
                          badge === "Top Performer" && "bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/20 text-dopamine-purple",
                          badge === "Rising Star" && "bg-gradient-to-r from-dopamine-blue/20 to-dopamine-purple/20 text-dopamine-blue",
                          badge === "Technical Expert" && "bg-gradient-to-r from-dopamine-green/20 to-dopamine-blue/20 text-dopamine-green",
                          badge === "Fast Learner" && "bg-gradient-to-r from-dopamine-orange/20 to-dopamine-pink/20 text-dopamine-orange"
                        )}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-lg">{entry.score}</div>
                    <div className={`flex items-center text-xs ${
                      entry.change > 0 ? 'text-green-500' : 
                      entry.change < 0 ? 'text-red-500' : 
                      'text-muted-foreground'
                    }`}>
                      {entry.change > 0 ? (
                        <><ChevronUp className="h-3 w-3" />{entry.change}</>
                      ) : entry.change < 0 ? (
                        <><ChevronDown className="h-3 w-3" />{Math.abs(entry.change)}</>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant={entry.rank <= 3 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleViewProfile(entry.id)}
                    className={cn(
                      entry.rank === 1 && "bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90",
                      entry.rank === 2 && "bg-gradient-to-r from-dopamine-blue to-dopamine-purple hover:from-dopamine-blue/90 hover:to-dopamine-purple/90",
                      entry.rank === 3 && "bg-gradient-to-r from-dopamine-green to-dopamine-blue hover:from-dopamine-green/90 hover:to-dopamine-blue/90",
                      visibleAnimation === entry.id && "animate-pulse"
                    )}
                  >
                    {entry.rank <= 3 && <Sparkles className="h-3.5 w-3.5 mr-1" />}
                    View Profile
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No results found. Try adjusting your search.
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center py-4 border-t space-y-4">
          <Button 
            variant="ghost" 
            onClick={toggleShowAllEntries}
            className="text-dopamine-purple hover:text-dopamine-pink hover:bg-dopamine-purple/5 group"
          >
            {showAllEntries ? (
              <>
                View Less
                <ChevronUp className="ml-2 h-4 w-4 group-hover:animate-bounce" />
              </>
            ) : (
              <>
                View More
                <ChevronDown className="ml-2 h-4 w-4 group-hover:animate-bounce" />
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {generatePageNumbers().map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToPage(page)}
                className={cn(
                  "h-8 w-8 p-0",
                  currentPage === page && "bg-gradient-to-r from-dopamine-purple to-dopamine-pink"
                )}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
