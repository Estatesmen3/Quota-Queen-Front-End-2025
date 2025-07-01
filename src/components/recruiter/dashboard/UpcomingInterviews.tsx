
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import GradientCard from "@/components/recruiter/GradientCard";
import ScheduleInterviewDialog from "@/components/recruiter/ScheduleInterviewDialog";

interface UpcomingInterviewsProps {
  calls: any[];
  isLoading: boolean;
  error: any;
}

const UpcomingInterviews = ({ calls, isLoading, error }: UpcomingInterviewsProps) => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  // Show only the first 2 upcoming calls
  const displayedCalls = calls?.slice(0, 2) || [];

  return (
    <>
      <GradientCard
        gradientClassName="dopamine-gradient-2"
        header={
          <div>
            <CardTitle className="flex items-center gap-2">
              Upcoming Interviews
              <BadgeCheck className="h-4 w-4 text-dopamine-green animate-spin-slow" />
            </CardTitle>
            <CardDescription>
              Your scheduled interview sessions
            </CardDescription>
          </div>
        }
      >
        <div className="space-y-3">
          {error ? (
            <div className="text-center p-4 text-muted-foreground text-sm border border-muted rounded-lg">
              <AlertCircle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
              <p>Unable to load interviews</p>
              <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : displayedCalls.length > 0 ? (
            displayedCalls.map((call, index) => (
              <div 
                key={call.id}
                className="border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/25 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{call.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    call.status === "in_progress" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {call.status === "in_progress" ? "Active" : "Scheduled"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{call.description || "No description"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">
                    {call.scheduled_at ? format(new Date(call.scheduled_at), "PPP 'at' p") : "Not scheduled"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground text-sm">
              No upcoming interviews scheduled
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="glow-on-hover" asChild>
            <Link to="/recruiter/calendar">
              View All
            </Link>
          </Button>
          <Button size="sm" className="glow-on-hover dopamine-gradient-1" onClick={() => setScheduleDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </GradientCard>

      {/* Add the schedule dialog */}
      <ScheduleInterviewDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        candidate={null}
      />
    </>
  );
};

export default UpcomingInterviews;
