
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { MatchedCandidate } from '@/hooks/useAiCandidateMatching';
import { Award, AlertCircle, ArrowUpRight, Briefcase, ChevronRight, TrendingUp, Star } from 'lucide-react';

interface PredictiveMatchingCardProps {
  candidate: MatchedCandidate;
  showDetails?: boolean;
}

export function PredictiveMatchingCard({ candidate, showDetails = false }: PredictiveMatchingCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewProfile = () => {
    navigate(`/recruiter/student/${candidate.id}`);
  };
  
  const handleSaveCandidate = () => {
    // Implement save functionality
    toast({
      title: "Candidate saved",
      description: `${candidate.first_name} ${candidate.last_name} has been saved to your talent pool.`,
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-2">
      <CardHeader className="pb-2 bg-gradient-to-r from-background via-dopamine-purple/5 to-dopamine-pink/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-dopamine-purple">
              <AvatarImage src={candidate.avatar_url} alt={`${candidate.first_name} ${candidate.last_name}`} />
              <AvatarFallback>
                {candidate.first_name?.[0]}{candidate.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold">
                {candidate.first_name} {candidate.last_name}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {candidate.best_fit_roles?.[0] || "Sales Professional"}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-bold bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
              {candidate.ai_match_score}% Match
            </div>
            <div className="text-xs text-muted-foreground">AI Score</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-md bg-dopamine-purple/5">
            <div className="text-lg font-bold">{candidate.average_score}%</div>
            <div className="text-xs text-muted-foreground">Performance</div>
          </div>
          <div className="p-2 rounded-md bg-dopamine-pink/5">
            <div className="text-lg font-bold">{candidate.retention_probability}%</div>
            <div className="text-xs text-muted-foreground">Retention</div>
          </div>
          <div className="p-2 rounded-md bg-dopamine-blue/5">
            <div className="text-lg font-bold">{candidate.engagement_score}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>
        
        {/* Skills progress bars */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div>Confidence</div>
            <div className="font-semibold">{candidate.confidence_score}%</div>
          </div>
          <Progress value={candidate.confidence_score} className="h-2" />
          
          <div className="flex justify-between items-center text-xs mt-2">
            <div>Persuasion</div>
            <div className="font-semibold">{candidate.persuasion_score}%</div>
          </div>
          <Progress value={candidate.persuasion_score} className="h-2" />
          
          <div className="flex justify-between items-center text-xs mt-2">
            <div>Objection Handling</div>
            <div className="font-semibold">{candidate.objection_score}%</div>
          </div>
          <Progress value={candidate.objection_score} className="h-2" />
        </div>
        
        {/* Candidate strengths */}
        {showDetails && (
          <>
            <div className="pt-2">
              <div className="text-sm font-semibold mb-1 flex items-center gap-1">
                <Award className="h-4 w-4 text-green-500" />
                <span>Key Strengths</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {candidate.strengths.map((strength, idx) => (
                  <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          
            {/* Improvement areas */}
            {candidate.improvement_areas.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-1 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Growth Areas</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.improvement_areas.map((area, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          
            {/* Red flags */}
            {candidate.red_flags.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Potential Concerns</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.red_flags.map((flag, idx) => (
                    <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={handleViewProfile} 
          className="flex-1 bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90"
        >
          View Profile
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSaveCandidate}
          className="flex-1"
        >
          Save Candidate
          <Star className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
