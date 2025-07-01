
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Search, Clock, User, Users, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleInterviewDialog from "./ScheduleInterviewDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock assessment result data - this would come from your DB in production
const assessmentResults = [
  {
    id: "1",
    candidate: {
      id: "c1",
      name: "Emma Johnson",
      email: "emma.j@university.edu",
      avatar: "",
      school: "Stanford University"
    },
    assessment: "Sales Development Representative Assessment",
    completedAt: "2023-03-15T14:30:00Z",
    score: 87,
    strengths: ["Objection Handling", "Product Knowledge"],
    areas: ["Time Management", "Follow-up Techniques"]
  },
  {
    id: "2",
    candidate: {
      id: "c2",
      name: "Michael Chen",
      email: "michael.c@university.edu",
      avatar: "",
      school: "MIT"
    },
    assessment: "Business Development Representative Assessment",
    completedAt: "2023-03-14T10:15:00Z",
    score: 92,
    strengths: ["Prospecting", "Communication"],
    areas: ["CRM Usage"]
  },
  {
    id: "3",
    candidate: {
      id: "c3",
      name: "Sophia Williams",
      email: "sophia.w@university.edu",
      avatar: "",
      school: "UCLA"
    },
    assessment: "Account Executive Role Play",
    completedAt: "2023-03-12T16:45:00Z",
    score: 78,
    strengths: ["Relationship Building", "Closing Techniques"],
    areas: ["Discovery Questions", "Value Proposition Delivery"]
  }
];

const ResultsTab = () => {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const handleSchedule = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsScheduleOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>View candidate performance on your assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {assessmentResults.length > 0 ? (
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="high">High Scorers</TabsTrigger>
                </TabsList>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="search" 
                    placeholder="Search candidates..." 
                    className="pl-8 h-9 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[200px]"
                  />
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                {assessmentResults.map((result) => (
                  <div 
                    key={result.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/25 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.candidate.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {result.candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{result.candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{result.candidate.school}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          result.score >= 90 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                          result.score >= 75 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {result.score}%
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className="font-medium">Assessment:</span> {result.assessment}
                    </div>
                    
                    {selectedResult === result.id && (
                      <div className="mt-4 space-y-3 animate-fade-in">
                        <div>
                          <h4 className="text-sm font-medium mb-1.5">Strengths</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {result.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1.5">Areas for Improvement</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {result.areas.map((area, i) => (
                              <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-3 border-t">
                          <Button size="sm" variant="outline" className="h-8">
                            <FileText className="mr-1 h-3.5 w-3.5" />
                            Full Report
                          </Button>
                          <Button size="sm" className="h-8" onClick={() => handleSchedule(result.candidate)}>
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            Schedule Interview
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="recent" className="space-y-4">
                <p className="text-muted-foreground text-sm">Showing results from the last 7 days</p>
                {assessmentResults.slice(0, 2).map((result) => (
                  <div 
                    key={result.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/25 transition-all duration-200 cursor-pointer"
                  >
                    {/* Similar content as above, simplified for brevity */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {result.candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{result.candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{result.assessment}</p>
                        </div>
                      </div>
                      <Button size="sm" className="h-8" onClick={() => handleSchedule(result.candidate)}>
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="high" className="space-y-4">
                <p className="text-muted-foreground text-sm">Showing candidates with scores above 85%</p>
                {assessmentResults.filter(r => r.score > 85).map((result) => (
                  <div 
                    key={result.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/25 transition-all duration-200 cursor-pointer"
                  >
                    {/* Similar content as above, simplified for brevity */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {result.candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{result.candidate.name}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-green-600">{result.score}%</span>
                            <span className="text-xs text-muted-foreground">{result.assessment}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="h-8" onClick={() => handleSchedule(result.candidate)}>
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-muted-foreground">No results to display yet. Assign assessments to candidates to see their performance here.</p>
          )}
        </CardContent>
      </Card>

      <ScheduleInterviewDialog 
        open={isScheduleOpen} 
        onOpenChange={setIsScheduleOpen}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default ResultsTab;
