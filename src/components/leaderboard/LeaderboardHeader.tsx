
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SalesGamesDropdown from "@/components/salesgames/SalesGamesDropdown";

interface LeaderboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LeaderboardHeader = ({ searchQuery, setSearchQuery }: LeaderboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Top performing students across all challenges and assessments
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search by name, university or industry" 
            className="pl-9 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <SalesGamesDropdown />
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
