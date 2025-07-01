
import { useState } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, BarChart, Brain, Settings } from "lucide-react";
import AssessmentCard from "@/components/recruiter/AssessmentCard";
import CreateAssessmentDialog from "@/components/recruiter/CreateAssessmentDialog";
import AssessmentSettings from "@/components/recruiter/AssessmentSettings";
import ResultsTab from "@/components/recruiter/ResultsTab";
import PersonalityAssessments from "@/components/recruiter/PersonalityAssessments";

const RecruiterAssessments = () => {
  const [currentTab, setCurrentTab] = useState("active");
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);

  // Mock assessment data
  const activeAssessments = [
    {
      id: "1",
      title: "Sales Discovery Assessment",
      description: "Evaluates the candidate's ability to conduct an effective discovery call with a potential client.",
      created: "2023-05-15",
      completions: 12,
      avgScore: 78,
      skillsEvaluated: ["Discovery", "Questioning", "Active Listening", "Needs Analysis"]
    },
    {
      id: "2",
      title: "Account Management Scenario",
      description: "Tests how candidates handle an escalation from an unhappy client.",
      created: "2023-06-02",
      completions: 8,
      avgScore: 82,
      skillsEvaluated: ["Conflict Resolution", "Relationship Management", "Problem Solving"]
    }
  ];

  const draftAssessments = [
    {
      id: "3",
      title: "Technical Demonstration Challenge",
      description: "Candidates must present and explain a software solution to a non-technical audience.",
      created: "2023-06-10",
      skillsEvaluated: ["Product Knowledge", "Communication", "Technical Sales"]
    }
  ];

  const handleCreateAssessment = () => {
    setIsCreatingAssessment(false);
    // In a real app, this would create the assessment in the database
  };

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Assessments</h1>
            <p className="text-muted-foreground">
              Create and manage sales assessments for candidates
            </p>
          </div>
          
          <CreateAssessmentDialog 
            open={isCreatingAssessment} 
            onOpenChange={setIsCreatingAssessment}
            onCreateAssessment={handleCreateAssessment}
          />
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="drafts">
              <Clock className="h-4 w-4 mr-2" />
              Drafts
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="personality">
              <Brain className="h-4 w-4 mr-2" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAssessments.map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  type="active" 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {draftAssessments.map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={assessment} 
                  type="draft" 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <ResultsTab />
          </TabsContent>
          
          <TabsContent value="personality" className="space-y-4">
            <PersonalityAssessments />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AssessmentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterAssessments;
