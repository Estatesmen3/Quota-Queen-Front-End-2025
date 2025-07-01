
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "./ResumeUploader";
import { ResumeVersions } from "./ResumeVersions";
import { ResumeAnalysisView } from "./ResumeAnalysisView";
import { RAGContainer } from "../rag/RAGContainer";

export function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  
  const handleUploadComplete = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setActiveTab("analyze");
  };
  
  const handleSelectVersion = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setActiveTab("analyze");
  };
  
  const handleBackToVersions = () => {
    setSelectedResumeId(null);
    setActiveTab("versions");
  };
  
  if (activeTab === "analyze" && selectedResumeId) {
    return (
      <ResumeAnalysisView 
        resumeId={selectedResumeId} 
        onBack={handleBackToVersions}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
          <TabsTrigger value="versions">My Resumes</TabsTrigger>
          <TabsTrigger value="ask">Ask About Resume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <ResumeUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>
        
        <TabsContent value="versions" className="mt-6">
          <ResumeVersions onSelectVersion={handleSelectVersion} />
        </TabsContent>
        
        <TabsContent value="ask" className="mt-6">
          <RAGContainer 
            featureSource="resume_analyzer"
            title="Resume Q&A"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
