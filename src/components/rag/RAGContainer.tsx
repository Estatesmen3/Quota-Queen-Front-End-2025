
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentList } from "./DocumentList";
import { DocumentQuery } from "./DocumentQuery";
import { FeatureSource } from "@/services/ragService";

interface RAGContainerProps {
  featureSource: FeatureSource;
  title: string;
}

export function RAGContainer({ featureSource, title }: RAGContainerProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const handleUploadComplete = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setActiveTab("query");
  };
  
  const handleSelectDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setActiveTab("query");
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="query">Ask Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <DocumentUploader 
            featureSource={featureSource} 
            onUploadComplete={handleUploadComplete} 
          />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <DocumentList 
            featureSource={featureSource} 
            onSelectDocument={handleSelectDocument} 
          />
        </TabsContent>
        
        <TabsContent value="query" className="mt-6">
          {selectedDocumentId ? (
            <DocumentQuery 
              documentId={selectedDocumentId} 
              featureSource={featureSource} 
            />
          ) : (
            <div className="p-6 text-center bg-muted rounded-lg">
              <p>Please select a document from the "My Documents" tab to start querying.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
