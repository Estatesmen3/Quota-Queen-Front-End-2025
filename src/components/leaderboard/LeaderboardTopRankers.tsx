
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Star, Award, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

interface LeaderboardTopRankersProps {
  topRankers: LeaderboardEntry[];
}

const LeaderboardTopRankers = ({ topRankers }: LeaderboardTopRankersProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Ensure we have data to display
  if (!topRankers || topRankers.length === 0) {
    console.log("No top rankers data available");
    return (
      <div className="hidden md:flex justify-center items-center py-12">
        <p className="text-muted-foreground">No leaderboard data available</p>
      </div>
    );
  }

  // If we have fewer than 3 rankers, pad the array with placeholder data
  const paddedRankers = [...topRankers];
  while (paddedRankers.length < 3) {
    paddedRankers.push({
      id: `placeholder-${paddedRankers.length}`,
      rank: paddedRankers.length + 1,
      name: "No data yet",
      avatar: "",
      university: "Unknown University",
      score: 0,
      change: 0,
      badges: []
    });
  }

  return (
    <div className="hidden md:flex justify-center items-end space-x-6 py-8">
      {paddedRankers.slice(0, 3).map((entry, index) => {
        const height = index === 0 ? "h-40" : index === 1 ? "h-32" : "h-28";
        const width = index === 0 ? "w-36" : "w-32";
        const bgColor = index === 0 
          ? "bg-gradient-to-b from-dopamine-pink to-dopamine-purple" 
          : index === 1 
            ? "bg-gradient-to-b from-dopamine-purple to-dopamine-blue" 
            : "bg-gradient-to-b from-dopamine-blue to-dopamine-green";
        
        return (
          <div key={entry.id} className="flex flex-col items-center">
            <Avatar 
              className={cn(
                "border-4 mb-3 transition-transform hover:scale-105 shadow-lg cursor-pointer",
                index === 0 ? "border-dopamine-pink" : 
                index === 1 ? "border-dopamine-purple" : 
                "border-dopamine-blue"
              )}
              style={{ width: 80, height: 80 }}
              onClick={() => {
                if (entry.id && !entry.id.startsWith('placeholder')) {
                  // Route based on user type
                  const route = profile?.user_type === 'recruiter' 
                    ? `/recruiter/student/${entry.id}` 
                    : `/student/profile/${entry.id}`;
                  navigate(route);
                }
              }}
            >
              <AvatarImage src={entry.avatar} alt={entry.name} />
              <AvatarFallback>
                {entry.id && entry.id.startsWith('placeholder') ? 
                  <UserCircle2 className="h-10 w-10 text-muted-foreground" /> : 
                  entry.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <span className="font-bold text-center">{entry.name}</span>
            <span className="text-sm text-muted-foreground">{entry.score} pts</span>
            
            <div 
              className={cn(
                "mt-3 rounded-t-md flex items-center justify-center shadow-lg",
                bgColor,
                height, width
              )}
            >
              <div className="flex flex-col items-center">
                {index === 0 ? (
                  <Crown className="h-6 w-6 text-white mb-1" />
                ) : index === 1 ? (
                  <Star className="h-6 w-6 text-white mb-1" />
                ) : (
                  <Award className="h-6 w-6 text-white mb-1" />
                )}
                <span className="text-2xl font-bold text-white">{entry.rank}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTopRankers;
