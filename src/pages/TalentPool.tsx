
import { useState } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TalentPoolSearch from "@/components/TalentPoolSearch";
import { RAGContainer } from "@/components/rag/RAGContainer";

const TalentPool = () => {
  const [activeTab, setActiveTab] = useState("search");
  
  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Talent Pool</h1>
          <p className="text-muted-foreground">
            Search, filter, and manage your talent pool of candidates
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Candidates</TabsTrigger>
            <TabsTrigger value="match">AI Matching</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <TalentPoolSearch />
          </TabsContent>
          
          <TabsContent value="match" className="mt-6">
            <RAGContainer 
              featureSource="talent_pool"
              title="AI-Powered Candidate Matching"
            />
          </TabsContent>
        </Tabs>
      </div>
    </RecruiterLayout>
  );
};

export default TalentPool;
