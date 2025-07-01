
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Award, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useTalentPools } from "@/hooks/useTalentPools";

const WeeklyTopCandidates = () => {
  const {
    topCandidates,
    isLoadingTopCandidates,
    topCandidatesError
  } = useTalentPools();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-500";
    if (score >= 75) return "from-blue-500 to-cyan-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  if (isLoadingTopCandidates) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Weekly Top Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} className="h-14" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topCandidatesError) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Weekly Top Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Error loading top candidates. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Weekly Top Candidates
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                AI-powered suggestions based on roleplay performance, skills match, and growth potential
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {topCandidates.length === 0 ? (
          <div className="p-6 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              No top candidates data available yet.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Check back next week for AI-recommended candidates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topCandidates.map((candidate, index) => (
              <Link 
                key={candidate.id}
                to={`/recruiter/student/${candidate.id}`}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-muted">
                      {candidate.avatar_url ? (
                        <AvatarImage src={candidate.avatar_url} alt={`${candidate.first_name} ${candidate.last_name}`} />
                      ) : (
                        <AvatarFallback>
                          {getInitials(candidate.first_name, candidate.last_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-[10px] text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors flex items-center">
                      {candidate.first_name} {candidate.last_name}
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {candidate.university && (
                        <span className="text-[10px] text-muted-foreground">
                          {candidate.university}
                        </span>
                      )}
                      {candidate.reason && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">
                          {candidate.reason}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-medium">{candidate.score}%</div>
                  <Progress 
                    value={candidate.score} 
                    className="w-16 h-1.5 bg-muted" 
                    indicatorClassName={`bg-gradient-to-r ${getScoreColor(candidate.score)}`} 
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyTopCandidates;
