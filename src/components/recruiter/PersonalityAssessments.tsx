
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RAGContainer } from "../rag/RAGContainer";
import { useAuth } from "@/context/AuthContext";
import PersonalityAssessmentManager from "./PersonalityAssessmentManager";

const PersonalityAssessments = () => {
  const [activeTab, setActiveTab] = useState("manage");
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Assessments</TabsTrigger>
          <TabsTrigger value="generate">AI Question Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="mt-6">
          <PersonalityAssessmentManager />
        </TabsContent>
        
        <TabsContent value="generate" className="mt-6">
          <RAGContainer 
            featureSource="recruiter_assessments"
            title="AI Assessment Question Generator"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalityAssessments;
