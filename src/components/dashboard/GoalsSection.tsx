
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Target, Calendar, CheckCircle, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import SetGoalsDialog from "./SetGoalsDialog";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
}

export function GoalsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchGoals = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('student_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Failed to load goals",
        description: "There was an error loading your goals.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const updateGoalProgress = async (id: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('student_goals')
        .update({ progress })
        .eq('id', id);
      
      if (error) throw error;
      
      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, progress } : goal
      ));
      
      if (progress === 100) {
        completeGoal(id);
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Failed to update progress",
        description: "There was an error updating the goal progress.",
        variant: "destructive",
      });
    }
  };

  const completeGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_goals')
        .update({ status: 'completed' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Goal Completed!",
        description: "Congratulations on completing your goal!",
      });
      
      fetchGoals();
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGoals(goals.filter(goal => goal.id !== id));
      
      toast({
        title: "Goal Removed",
        description: "Your goal has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Failed to remove goal",
        description: "There was an error removing your goal.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Your Goals
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsDialogOpen(true)}
          disabled={goals.length >= 3}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          {goals.length >= 3 ? "Max Goals Set" : "Add Goal"}
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-medium mb-2">No Goals Set</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Setting specific goals can help you track your progress and improve faster.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>Set Your First Goal</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-card rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {goal.target_date ? (
                    <span>Target: {format(new Date(goal.target_date), "MMM d, yyyy")}</span>
                  ) : (
                    <span>No target date</span>
                  )}
                </div>
                
                <div className="flex gap-1.5">
                  {[25, 50, 75, 100].map((progress) => (
                    <Button
                      key={progress}
                      variant={goal.progress >= progress ? "default" : "outline"}
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => updateGoalProgress(goal.id, progress)}
                      disabled={goal.progress >= progress}
                    >
                      {progress === 100 ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-xs">{progress}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SetGoalsDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onGoalAdded={fetchGoals} 
      />
    </div>
  );
}

export default GoalsSection;
