
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Calendar, Star, Award, Bookmark, BookmarkCheck, BarChart2, FileText, PenTool } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const RecruiterStudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [notes, setNotes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  // Mock student data - in a real app, this would come from an API call
  const student = {
    id: id || "user1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    university: "Stanford University",
    major: "Business Administration",
    graduationYear: 2024,
    bio: "Enthusiastic and dedicated business student with a passion for sales and marketing. I have completed multiple internships in tech sales and am looking for opportunities to grow my career in B2B sales.",
    email: "sarah.johnson@stanford.edu",
    phone: "(650) 555-1234",
    linkedin: "linkedin.com/in/sarahjohnson",
    skills: [
      { name: "Cold Calling", level: 85 },
      { name: "Negotiation", level: 78 },
      { name: "Product Demos", level: 92 },
      { name: "CRM Management", level: 80 },
      { name: "Account Management", level: 75 }
    ],
    badges: ["Top Performer", "Rising Star", "Communication Expert"],
    performances: [
      {
        id: "perf1",
        title: "SaaS Sales Discovery Call",
        date: "2023-05-15",
        score: 92,
        duration: "12:45"
      },
      {
        id: "perf2",
        title: "Enterprise Solution Pitch",
        date: "2023-06-02",
        score: 88,
        duration: "15:20"
      },
      {
        id: "perf3",
        title: "Objection Handling Scenario",
        date: "2023-06-20",
        score: 90,
        duration: "8:30"
      }
    ],
    assessments: [
      {
        id: "assess1",
        title: "Technical Product Knowledge",
        date: "2023-05-10",
        score: 85
      },
      {
        id: "assess2",
        title: "Cold Call Simulation",
        date: "2023-05-25",
        score: 92
      }
    ]
  };

  const toggleSaved = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved candidates" : "Added to saved candidates",
      description: isSaved 
        ? "The candidate has been removed from your saved list" 
        : "The candidate has been added to your saved list",
    });
  };

  const saveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your notes about this candidate have been saved",
    });
  };

  const scheduleInterview = (date: string) => {
    setIsScheduling(false);
    toast({
      title: "Interview scheduled",
      description: `Interview with ${student.name} scheduled for ${date}`,
    });
  };

  const handleMessageStudent = () => {
    navigate(`/messages?userId=${student.id}`);
  };

  const handleViewPerformance = (performanceId: string) => {
    navigate(`/performance/${performanceId}`);
  };

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <span aria-hidden="true">&larr;</span>
            </Button>
            <h1 className="text-3xl font-bold">Student Profile</h1>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                  <DialogDescription>
                    Select a time to interview {student.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Available Times</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Tomorrow at 10:00 AM", "Tomorrow at 2:00 PM", "Friday at 11:00 AM", "Friday at 3:30 PM"].map((time, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          onClick={() => scheduleInterview(time)}
                          className="justify-start"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduling(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={toggleSaved}>
              {isSaved ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Candidate
                </>
              )}
            </Button>
            
            <Button onClick={handleMessageStudent}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mt-2">
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <CardDescription className="text-base">{student.university}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center flex-wrap gap-2">
                    {student.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Major:</span>
                      <span className="font-medium">{student.major}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Graduation:</span>
                      <span className="font-medium">{student.graduationYear}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{student.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{student.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">LinkedIn:</span>
                      <span className="font-medium">{student.linkedin}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills Assessment</CardTitle>
                <CardDescription>
                  Key skills based on performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recruiter Notes</CardTitle>
                <CardDescription>
                  Private notes about this candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Add your notes about this candidate here..."
                  className="min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={saveNotes}
                  disabled={!notes.trim()}
                  className="w-full"
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {student.name.split(' ')[0]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{student.bio}</p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="performances" className="space-y-4">
              <TabsList>
                <TabsTrigger value="performances">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Performances
                </TabsTrigger>
                <TabsTrigger value="assessments">
                  <FileText className="h-4 w-4 mr-2" />
                  Assessments
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <Award className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performances" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Sales Performance Library</CardTitle>
                    <CardDescription>
                      Review {student.name.split(' ')[0]}'s sales role-play performances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {student.performances.map((performance) => (
                        <div 
                          key={performance.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{performance.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(performance.date), 'MMM d, yyyy')} • {performance.duration}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="flex gap-1 items-center">
                              <Star className="h-3 w-3 text-amber-500" />
                              {performance.score}%
                            </Badge>
                            
                            <Button 
                              size="sm"
                              onClick={() => handleViewPerformance(performance.id)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assessments" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Assessment Results</CardTitle>
                    <CardDescription>
                      {student.name.split(' ')[0]}'s performance on formal assessments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {student.assessments.map((assessment) => (
                        <div 
                          key={assessment.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{assessment.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(assessment.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="flex gap-1 items-center">
                              <Star className="h-3 w-3 text-amber-500" />
                              {assessment.score}%
                            </Badge>
                            
                            <Button 
                              size="sm"
                              variant="outline"
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Badges & Achievements</CardTitle>
                    <CardDescription>
                      Recognitions earned through exceptional performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.badges.map((badge) => (
                        <Card key={badge}>
                          <CardHeader className="py-3 text-center">
                            <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                            <CardTitle className="text-base">{badge}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterStudentProfile;
