
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PersonalityAssessment } from "@/types/messages";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FileText, Clock, Users } from "lucide-react";
import CreateAssessmentDialog from "./CreateAssessmentDialog";
import AssessmentCard from "./AssessmentCard";

interface AssessmentWithStats extends PersonalityAssessment {
  completions?: number;
  avgScore?: number;
  skillsEvaluated?: string[];
}

const PersonalityAssessmentManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [activeAssessments, setActiveAssessments] = useState<AssessmentWithStats[]>([]);
  const [draftAssessments, setDraftAssessments] = useState<AssessmentWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("personality_assessments")
          .select("*")
          .eq("recruiter_id", user.id);
          
        if (error) throw error;
        
        // Transform the data and split into active and draft assessments
        const transformed = data.map((assessment: PersonalityAssessment) => {
          // For demo purposes, generating random stats. In a real app these would come from the database
          const completions = Math.floor(Math.random() * 50) + 1;
          const avgScore = Math.floor(Math.random() * 30) + 65;
          const traits = assessment.traits || [];
          
          return {
            ...assessment,
            completions,
            avgScore,
            skillsEvaluated: traits
          };
        });
        
        setActiveAssessments(transformed.filter((a: AssessmentWithStats) => a.is_published));
        setDraftAssessments(transformed.filter((a: AssessmentWithStats) => !a.is_published));
      } catch (error) {
        console.error("Error fetching assessments:", error);
        toast({
          title: "Error",
          description: "Failed to load assessments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssessments();
  }, [user, toast]);

  const handleCreateAssessment = async (assessmentData: Partial<PersonalityAssessment>) => {
    if (!user) return;
    
    try {
      // Ensure that all required fields are present
      if (!assessmentData.title || !assessmentData.model_type) {
        toast({
          title: "Error",
          description: "Title and assessment model are required",
          variant: "destructive"
        });
        return;
      }
      
      const newAssessment = {
        title: assessmentData.title,
        model_type: assessmentData.model_type,
        description: assessmentData.description || null,
        target_role: assessmentData.target_role || null,
        completion_time: assessmentData.completion_time || null,
        traits: assessmentData.traits || [],
        recruiter_id: user.id,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("personality_assessments")
        .insert(newAssessment)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add to draft assessments
      setDraftAssessments([
        ...draftAssessments, 
        { 
          ...data,
          completions: 0,
          avgScore: 0,
          skillsEvaluated: data.traits || []
        }
      ]);
      
      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      
      setIsCreatingAssessment(false);
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Personality Assessments</h2>
          <p className="text-muted-foreground">Manage personality assessments for your candidates</p>
        </div>
        <Button onClick={() => setIsCreatingAssessment(true)}>
          Create New Assessment
        </Button>
        
        <CreateAssessmentDialog 
          open={isCreatingAssessment}
          onOpenChange={setIsCreatingAssessment}
          onCreateAssessment={handleCreateAssessment}
        />
      </div>
      
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Active Assessments
          </TabsTrigger>
          <TabsTrigger value="drafts">
            <FileText className="h-4 w-4 mr-2" />
            Draft Assessments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading assessments...</p>
            </div>
          ) : activeAssessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAssessments.map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={{
                    id: assessment.id,
                    title: assessment.title,
                    description: assessment.description || "",
                    created: new Date(assessment.created_at).toLocaleDateString(),
                    completions: assessment.completions,
                    avgScore: assessment.avgScore,
                    skillsEvaluated: assessment.skillsEvaluated || []
                  }}
                  type="active"
                />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Active Assessments</h3>
                <p className="text-muted-foreground mb-4">
                  Publish a draft assessment to make it available to candidates.
                </p>
                <Button onClick={() => setIsCreatingAssessment(true)}>
                  Create Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="drafts">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading drafts...</p>
            </div>
          ) : draftAssessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftAssessments.map((assessment) => (
                <AssessmentCard 
                  key={assessment.id} 
                  assessment={{
                    id: assessment.id,
                    title: assessment.title,
                    description: assessment.description || "",
                    created: new Date(assessment.created_at).toLocaleDateString(),
                    skillsEvaluated: assessment.skillsEvaluated || []
                  }}
                  type="draft"
                />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="py-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Draft Assessments</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new assessment to get started.
                </p>
                <Button onClick={() => setIsCreatingAssessment(true)}>
                  Create Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalityAssessmentManager;
