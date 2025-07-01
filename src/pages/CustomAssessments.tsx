
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, CheckCircle, Clock, Users, Calendar, ClipboardList, Send, UserPlus, Target, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for assessments
const mockAssessments = [
  {
    id: "a1",
    title: "Enterprise Account Executive Assessment",
    description: "This assessment evaluates candidates for our Enterprise Account Executive position. It includes a discovery call, objection handling, and closing scenarios.",
    scenario: "You're speaking with a CTO who is considering switching from a competitor's solution to ours. They have concerns about implementation time and team adoption.",
    candidates: [
      { id: "c1", name: "Sarah Johnson", status: "Completed", score: 92 },
      { id: "c2", name: "Michael Chen", status: "In Progress" },
      { id: "c3", name: "Alex Rodriguez", status: "Invited" }
    ],
    createdAt: "2023-11-10",
    isActive: true
  },
  {
    id: "a2",
    title: "SDR Cold Call Assessment",
    description: "This assessment tests SDR candidates on their ability to handle cold calls, navigate gatekeepers, and set appointments.",
    scenario: "You're calling a potential client who has never heard of our company. Your goal is to pique their interest and schedule a demo with the decision maker.",
    candidates: [
      { id: "c4", name: "Jessica Williams", status: "Completed", score: 87 },
      { id: "c5", name: "Priya Patel", status: "Completed", score: 88 }
    ],
    createdAt: "2023-10-25",
    isActive: true
  }
];

const CustomAssessments = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState(mockAssessments);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scenario: "",
    isActive: true
  });

  // Mock candidate data
  const availableCandidates = [
    { id: "user1", name: "Sarah Johnson", university: "Stanford University" },
    { id: "user2", name: "Michael Chen", university: "Harvard University" },
    { id: "user3", name: "Jessica Williams", university: "MIT" },
    { id: "user4", name: "Alex Rodriguez", university: "UC Berkeley" },
    { id: "user5", name: "Priya Patel", university: "University of Michigan" },
    { id: "valen", name: "Valen Brown", university: "Stetson University" },
  ];

  // Function to create a new assessment
  const createAssessment = async () => {
    try {
      // Here we would normally send the data to Supabase
      const newAssessment = {
        id: `a${assessments.length + 1}`,
        ...formData,
        candidates: selectedCandidates.map(id => {
          const candidate = availableCandidates.find(c => c.id === id);
          return {
            id,
            name: candidate.name,
            status: "Invited"
          };
        }),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      // Mock API call
      toast({
        title: "Assessment created",
        description: "Your assessment has been created and invitations sent to candidates.",
      });
      
      setAssessments([...assessments, newAssessment]);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        scenario: "",
        isActive: true
      });
      setSelectedCandidates([]);
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle candidate selection
  const toggleCandidateSelection = (candidateId) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Assessments</h1>
            <p className="text-muted-foreground mt-1">
              Create tailored sales assessments for specific roles
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="glow-on-hover">
                <Plus className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create Custom Assessment</DialogTitle>
                <DialogDescription>
                  Design a tailored sales assessment for candidates to evaluate their fit for specific roles.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Assessment Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Enterprise Account Executive Assessment"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the purpose of this assessment..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="scenario">Scenario</Label>
                  <Textarea 
                    id="scenario" 
                    value={formData.scenario}
                    onChange={(e) => setFormData({...formData, scenario: e.target.value})}
                    placeholder="Describe the sales scenario candidates will roleplay..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive" 
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Make assessment active immediately</Label>
                </div>
                
                <div className="grid gap-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label>Select Candidates</Label>
                    <span className="text-sm text-muted-foreground">
                      {selectedCandidates.length} selected
                    </span>
                  </div>
                  
                  <div className="border rounded-md max-h-[200px] overflow-y-auto p-2">
                    {availableCandidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 ${
                          selectedCandidates.includes(candidate.id) 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleCandidateSelection(candidate.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">{candidate.university}</p>
                          </div>
                        </div>
                        {selectedCandidates.includes(candidate.id) && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={createAssessment}
                  disabled={!formData.title || !formData.scenario || selectedCandidates.length === 0}
                >
                  Create Assessment & Send Invitations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Assessments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 mt-6">
            {assessments.filter(a => a.isActive).map((assessment) => (
              <Card key={assessment.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">{assessment.title}</CardTitle>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Created on {new Date(assessment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    
                    <CardDescription className="mt-4 text-base">
                      {assessment.description}
                    </CardDescription>
                    
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <div className="text-sm font-medium mb-2">Scenario:</div>
                      <p className="text-sm">{assessment.scenario}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Candidates ({assessment.candidates.length}):</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {assessment.candidates.map((candidate) => (
                          <div 
                            key={candidate.id}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{candidate.name}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${candidate.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                                ${candidate.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
                                ${candidate.status === 'Invited' ? 'bg-yellow-100 text-yellow-800' : ''}
                              `}
                            >
                              {candidate.status}
                              {candidate.score ? ` (${candidate.score}%)` : ''}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-48 p-6 bg-muted flex flex-row md:flex-col items-center justify-center gap-2">
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Candidates
                    </Button>
                    <Button className="w-full" size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send Reminders
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {assessments.filter(a => a.isActive).length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active assessments</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You don't have any active assessments yet. Create a new assessment to evaluate candidates for specific roles.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      New Assessment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>{/* ... Same dialog content as above ... */}</DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4 mt-6">
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No completed assessments</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Completed assessments will appear here once all candidates have finished.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-8 bg-soft-blue border-primary/30">
          <Target className="h-5 w-5 text-primary" />
          <AlertTitle>Pro Tip: Custom Assessments</AlertTitle>
          <AlertDescription>
            Custom assessments let you evaluate candidates for specific roles at your company. Create role-specific scenarios and invite candidates to complete them to better assess their fit.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
};

export default CustomAssessments;
