
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Search, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GradientCard from "@/components/recruiter/GradientCard";

interface Candidate {
  id: string;
  name: string;
  school: string;
  score: number;
  skills: string[];
}

interface TopCandidatesProps {
  candidates: Candidate[];
}

const TopCandidates = ({ candidates }: TopCandidatesProps) => {
  return (
    <GradientCard 
      className="lg:col-span-2"
      gradientClassName="dopamine-gradient-3"
      header={
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Top Candidates
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse-subtle" />
            </CardTitle>
            <CardDescription>
              Highest performing students in your talent pool
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="glow-on-hover" asChild>
            <Link to="/recruiter/talent-pool">
              <Search className="mr-2 h-4 w-4" />
              View All
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="group animate-fade-in">
            <Link to={`/recruiter/student/${candidate.id}`} className="flex items-start justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-[10px] text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {candidate.score}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                    {candidate.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{candidate.school}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.skills.map((skill, index) => (
                      <span key={index} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Progress 
                  value={candidate.score} 
                  className="w-20 h-1.5 bg-muted" 
                  indicatorClassName={`bg-gradient-to-r ${
                    candidate.score > 90 
                      ? "from-green-500 to-emerald-500" 
                      : "from-amber-500 to-orange-500"
                  }`} 
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary" asChild>
          <Link to="/recruiter/talent-pool">
            View all candidates
          </Link>
        </Button>
      </div>
    </GradientCard>
  );
};

export default TopCandidates;
