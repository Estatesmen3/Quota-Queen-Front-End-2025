
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface UseScenarioCreationProps {
  userId: string | undefined;
  segment: string | undefined;
}

export const useScenarioCreation = ({ userId, segment }: UseScenarioCreationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scenarioGenerated, setScenarioGenerated] = useState(false);
  const [generatedScenarioId, setGeneratedScenarioId] = useState<string | null>(null);
  const [generatedScenarioTitle, setGeneratedScenarioTitle] = useState<string | null>(null);

  const generateScenario = async (formData: any) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a roleplay scenario",
        variant: "destructive"
      });
      return null;
    }
    
    if (!segment) {
      toast({
        title: "Invalid segment",
        description: "Please select a valid practice segment",
        variant: "destructive"
      });
      return null;
    }
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-roleplay-scenario', {
        body: {
          userId,
          segment,
          ...formData
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate scenario");
      }
      
      if (!data.success || !data.sessionId) {
        throw new Error(data.error || "Failed to create roleplay session");
      }
      
      toast({
        title: "Scenario generated successfully",
        description: "Your roleplay scenario is ready for practice"
      });
      
      setScenarioGenerated(true);
      setGeneratedScenarioId(data.sessionId);
      setGeneratedScenarioTitle(data.scenarioTitle || "Sales Pitch");
      
      return {
        sessionId: data.sessionId,
        scenarioTitle: data.scenarioTitle
      };
      
    } catch (error: any) {
      console.error("Error generating scenario:", error);
      toast({
        title: "Error generating scenario",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const processDocuments = async (scenarioFile: File, rubricFile: File | null) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a roleplay scenario",
        variant: "destructive"
      });
      return null;
    }
    
    if (!scenarioFile) {
      toast({
        title: "Missing scenario file",
        description: "Please upload a scenario document",
        variant: "destructive"
      });
      return null;
    }
    
    setIsAnalyzing(true);
    
    try {
      const scenarioFilePath = `${userId}/${Date.now()}_${scenarioFile.name}`;
      const { data: scenarioUploadData, error: scenarioUploadError } = await supabase.storage
        .from('documents')
        .upload(scenarioFilePath, scenarioFile);
      
      if (scenarioUploadError) throw scenarioUploadError;
      
      const { data: scenarioDocumentData, error: scenarioDocumentError } = await supabase
        .from('rag_documents')
        .insert({
          user_id: userId,
          title: scenarioFile.name,
          file_url: scenarioFilePath,
          feature_source: 'roleplay_scenario',
          user_role: 'student'
        })
        .select()
        .single();
      
      if (scenarioDocumentError) throw scenarioDocumentError;
      
      let rubricDocumentId = null;
      if (rubricFile) {
        const rubricFilePath = `${userId}/${Date.now()}_${rubricFile.name}`;
        const { data: rubricUploadData, error: rubricUploadError } = await supabase.storage
          .from('documents')
          .upload(rubricFilePath, rubricFile);
        
        if (rubricUploadError) throw rubricUploadError;
        
        const { data: rubricDocumentData, error: rubricDocumentError } = await supabase
          .from('rag_documents')
          .insert({
            user_id: userId,
            title: rubricFile.name,
            file_url: rubricFilePath,
            feature_source: 'roleplay_rubric',
            user_role: 'student'
          })
          .select()
          .single();
        
        if (rubricDocumentError) throw rubricDocumentError;
        
        rubricDocumentId = rubricDocumentData.id;
      }
      
      const fileReader = new FileReader();
      
      return new Promise<{ sessionId: string; scenarioTitle: string } | null>((resolve) => {
        fileReader.onload = async (e) => {
          const fileContent = e.target?.result as string;
          
          toast({
            title: "Processing scenario",
            description: "AI is analyzing your scenario document...",
          });
          
          try {
            const { data, error } = await supabase.functions.invoke('rag-scenario-parser', {
              body: {
                documentId: scenarioDocumentData.id,
                documentText: fileContent,
                userId: userId,
                rubricDocumentId: rubricDocumentId
              }
            });
            
            if (error) throw error;
            
            if (data.success && data.sessionId) {
              toast({
                title: "Scenario created",
                description: "Your scenario has been processed and a practice session created!"
              });
              
              setScenarioGenerated(true);
              setGeneratedScenarioId(data.sessionId);
              setGeneratedScenarioTitle(data.scenarioTitle || "Sales Pitch");
              
              resolve({
                sessionId: data.sessionId,
                scenarioTitle: data.scenarioTitle || "Sales Pitch"
              });
            } else if (data.fallbackScenario) {
              toast({
                title: "Using fallback scenario",
                description: "We couldn't fully analyze your document, but created a practice scenario for you."
              });
              
              setScenarioGenerated(true);
              setGeneratedScenarioId(data.sessionId);
              setGeneratedScenarioTitle("Sales Pitch");
              
              resolve({
                sessionId: data.sessionId,
                scenarioTitle: "Sales Pitch"
              });
            } else {
              throw new Error("Failed to process scenario");
            }
          } catch (error) {
            console.error("Error processing scenario:", error);
            toast({
              title: "Error processing scenario",
              description: "There was a problem analyzing your document. Please try again.",
              variant: "destructive"
            });
            resolve(null);
          } finally {
            setIsAnalyzing(false);
          }
        };
        
        fileReader.readAsText(scenarioFile);
      });
      
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error uploading files",
        description: "There was a problem uploading your files. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      return null;
    }
  };

  return {
    isGenerating,
    isAnalyzing,
    scenarioGenerated,
    generatedScenarioId,
    generatedScenarioTitle,
    generateScenario,
    processDocuments
  };
};
