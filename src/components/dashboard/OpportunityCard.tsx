
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  skill: string;
  progress: number;
}

export interface OpportunityProps {
  opportunity: Opportunity;
  onUpdate: () => void;
}

const OpportunityCard: React.FC<OpportunityProps> = ({ opportunity, onUpdate }) => {
  const [progress, setProgress] = useState(opportunity.progress);
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle starting practice for this opportunity
  const handleStartPractice = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    toast({
      title: "Practice started!",
      description: `You're now working on ${opportunity.title}`,
    });
    
    try {
      // Simulate progress increase
      const newProgress = Math.min(progress + 10, 100);
      setProgress(newProgress);
      
      // Update the opportunity progress in the database
      // Note: In a real implementation, you'd have a proper table for tracking 
      // user opportunities and their progress
      await supabase
        .from('student_opportunities')
        .update({ 
          status: newProgress === 100 ? 'completed' : 'in_progress' 
        })
        .eq('id', opportunity.id)
        .eq('student_id', user.id);
      
      toast({
        title: "Progress updated!",
        description: `You've made progress on ${opportunity.skill}`,
      });
      
      // Call the onUpdate prop to refresh the parent component
      onUpdate();
    } catch (error) {
      console.error("Error updating opportunity:", error);
      toast({
        title: "Error updating progress",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-1 bg-primary transition-all duration-500 ${
        isHovered ? 'w-full' : `w-[${progress}%]`
      }`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium">{opportunity.title}</h4>
          <Badge variant="outline" className="text-xs">
            {opportunity.skill}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Current progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Target className="h-3.5 w-3.5 mr-1" />
            <span>
              {progress < 30 ? 'Just started' : 
               progress < 70 ? 'In progress' : 
               progress < 100 ? 'Almost there' : 'Completed!'}
            </span>
          </div>
          <Button 
            size="sm" 
            variant={isHovered ? "default" : "outline"}
            onClick={handleStartPractice}
            className="transition-all duration-300"
            disabled={isUpdating || progress === 100}
          >
            {progress === 100 ? (
              <>
                <Trophy className="h-3.5 w-3.5 mr-1 text-amber-500" />
                Mastered
              </>
            ) : (
              <>
                {isUpdating ? 'Updating...' : 'Practice'}
                {!isUpdating && 
                  <ArrowRight className={`h-3.5 w-3.5 ml-1 transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : ''
                  }`} />
                }
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
