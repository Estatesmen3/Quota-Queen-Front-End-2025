
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
  title: z.string().min(2, {
    message: "Goal title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  targetDate: z.date().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface SetGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalAdded: () => void;
}

export function SetGoalsDialog({ open, onOpenChange, onGoalAdded }: SetGoalsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalsCount, setGoalsCount] = useState(0);

  // Fetch the number of active goals the user has
  React.useEffect(() => {
    const fetchGoalsCount = async () => {
      if (!user) return;
      
      const { count, error } = await supabase
        .from('student_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching goals count:', error);
        return;
      }
      
      setGoalsCount(count || 0);
    };
    
    fetchGoalsCount();
  }, [user, open]);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: GoalFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to set goals.",
        variant: "destructive",
      });
      return;
    }

    if (goalsCount >= 3) {
      toast({
        title: "Goal Limit Reached",
        description: "You can only have 3 active goals at a time. Complete or remove existing goals first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('student_goals')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          target_date: data.targetDate || null,
        });

      if (error) throw error;
      
      toast({
        title: "Goal Created",
        description: "Your new goal has been set successfully!",
      });
      
      form.reset();
      onGoalAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Failed to Create Goal",
        description: "There was an error creating your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Set New Goal</DialogTitle>
          <DialogDescription>
            Create a new goal to track your progress. You can have up to 3 active goals at a time.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Master discovery questions" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, specific title for your goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you want to achieve and how..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Creating...
                  </>
                ) : (
                  "Create Goal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SetGoalsDialog;
