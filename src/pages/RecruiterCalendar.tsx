
import React, { useState } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, List, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useCallsData } from "@/hooks/useCallsData";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ScheduleInterviewDialog from "@/components/recruiter/ScheduleInterviewDialog";

const RecruiterCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const { upcomingCalls, isLoading } = useCallsData();
  
  // Filter interviews for the selected date
  const filteredInterviews = date 
    ? upcomingCalls.filter(call => {
        if (!call.scheduled_at) return false;
        const callDate = new Date(call.scheduled_at);
        return (
          callDate.getDate() === date.getDate() &&
          callDate.getMonth() === date.getMonth() &&
          callDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Get today's interviews
  const todayInterviews = upcomingCalls.filter(call => {
    if (!call.scheduled_at) return false;
    const callDate = new Date(call.scheduled_at);
    const today = new Date();
    return (
      callDate.getDate() === today.getDate() &&
      callDate.getMonth() === today.getMonth() &&
      callDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="highlight-gradient">Interview Calendar</span>
            </h1>
            <p className="text-muted-foreground">
              Manage and schedule your candidate interviews
            </p>
          </div>
          <Button className="glow-on-hover dopamine-gradient-1" onClick={() => setScheduleDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-2">
              Today
              {todayInterviews.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {todayInterviews.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All Interviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                    {filteredInterviews.length > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {filteredInterviews.length} {filteredInterviews.length === 1 ? 'interview' : 'interviews'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : filteredInterviews.length > 0 ? (
                    <div className="space-y-4">
                      {filteredInterviews.map((interview) => (
                        <div key={interview.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <h3 className="font-medium">{interview.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {interview.scheduled_at && format(new Date(interview.scheduled_at), "h:mm a")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {interview.status === "scheduled" && (
                              <Button size="sm">Join</Button>
                            )}
                            <Button size="sm" variant="outline">Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No interviews scheduled for this day</p>
                      <Button variant="outline" className="mt-4" onClick={() => setScheduleDialogOpen(true)}>
                        Schedule Interview
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Interviews</span>
                  <Badge variant="outline">
                    {todayInterviews.length} {todayInterviews.length === 1 ? 'interview' : 'interviews'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : todayInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {todayInterviews.map((interview) => (
                      <div key={interview.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h3 className="font-medium">{interview.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {interview.scheduled_at && format(new Date(interview.scheduled_at), "h:mm a")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {interview.status === "scheduled" && (
                            <Button size="sm">Join</Button>
                          )}
                          <Button size="sm" variant="outline">Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No interviews scheduled for today</p>
                    <Button variant="outline" className="mt-4" onClick={() => setScheduleDialogOpen(true)}>
                      Schedule Interview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Upcoming Interviews</span>
                  <Badge variant="outline">
                    {upcomingCalls.length} {upcomingCalls.length === 1 ? 'interview' : 'interviews'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : upcomingCalls.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingCalls.map((interview) => (
                      <div key={interview.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h3 className="font-medium">{interview.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3" />
                            {interview.scheduled_at ? format(new Date(interview.scheduled_at), "PPP 'at' h:mm a") : "Not scheduled"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {interview.status === "scheduled" && (
                            <Button size="sm">Join</Button>
                          )}
                          <Button size="sm" variant="outline">Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No upcoming interviews scheduled</p>
                    <Button variant="outline" className="mt-4" onClick={() => setScheduleDialogOpen(true)}>
                      Schedule Interview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ScheduleInterviewDialog 
        open={scheduleDialogOpen} 
        onOpenChange={setScheduleDialogOpen} 
        candidate={null}
      />
    </RecruiterLayout>
  );
};

export default RecruiterCalendar;
