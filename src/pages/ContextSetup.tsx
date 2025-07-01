import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

// Import our step components
import ScenarioModeSelect from '@/components/roleplay/steps/ScenarioModeSelect';
import AiScenarioForm from '@/components/roleplay/steps/AiScenarioForm';
import ScenarioUploadForm from '@/components/roleplay/steps/ScenarioUploadForm';
import EvaluationSetupForm from '@/components/roleplay/steps/EvaluationSetupForm';
import StepIndicator from '@/components/roleplay/steps/StepIndicator';
import StepNavigation from '@/components/roleplay/steps/StepNavigation';
import UploadRoleplay from '@/components/roleplay/UploadRoleplay';

const ContextSetup = () => {
  const { segment } = useParams<{ segment: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Scenario generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingScenario, setIsAnalyzingScenario] = useState(false);
  const [scenarioFile, setScenarioFile] = useState<File | null>(null);
  const [rubricFile, setRubricFile] = useState<File | null>(null);
  const [scenarioContent, setScenarioContent] = useState<string | null>(null);
  const [rubricContent, setRubricContent] = useState<string | null>(null);
  const [scenarioGenerated, setScenarioGenerated] = useState(false);
  const [generatedScenarioId, setGeneratedScenarioId] = useState<string | null>(null);
  const [generatedScenarioTitle, setGeneratedScenarioTitle] = useState<string | null>(null);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [scenarioMode, setScenarioMode] = useState<"ai" | "upload">("ai");
  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUploadValid, setIsUploadValid] = useState(false);
  
  // Evaluation setup state
  const [practiceSegment, setPracticeSegment] = useState<string | undefined>(segment);
  const [timeLimit, setTimeLimit] = useState(10);
  
  const stepTitles = {
    ai: ["Select Method", "Configure Scenario", "Generate", "Evaluation Setup", "Record & Upload"],
    upload: ["Select Method", "Upload Documents", "Process", "Evaluation Setup", "Record & Upload"]
  };

  const segmentTitles: Record<string, string> = {
    'full_roleplay': 'Full Sales Call',
    'intro_rapport': 'Introduction & Rapport Building',
    'agenda': 'Setting the Agenda',
    'needs_identification': 'Needs Identification',
    'presentation': 'Solution Presentation',
    'objection_handling': 'Objection Handling',
    'closing': 'Closing Techniques',
  };

  const segmentColors: Record<string, string> = {
    'full_roleplay': 'from-dopamine-purple/10 to-dopamine-pink/5',
    'intro_rapport': 'from-dopamine-blue/10 to-indigo-500/5',
    'agenda': 'from-teal-500/10 to-cyan-500/5',
    'needs_identification': 'from-amber-500/10 to-orange-500/5',
    'presentation': 'from-dopamine-pink/10 to-rose-500/5',
    'objection_handling': 'from-red-500/10 to-orange-500/5',
    'closing': 'from-yellow-500/10 to-amber-500/5',
  };

  const isNextEnabled = () => {
    if (currentStep === 0) return true; // Method selection step
    if (currentStep === 1) {
      return scenarioMode === 'ai' ? isFormValid : isUploadValid;
    }
    if (currentStep === 3) return true; // Evaluation setup step is always valid
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (scenarioMode === 'ai') {
        handleAiScenarioGenerate();
      } else {
        handleUploadScenario();
      }
      return;
    }
    
    if (currentStep < stepTitles[scenarioMode].length - 1) {
      const newStepsCompleted = [...stepsCompleted];
      newStepsCompleted[currentStep] = true;
      setStepsCompleted(newStepsCompleted);
      
      setCurrentStep(prev => prev + 1);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModeSelect = (mode: "ai" | "upload") => {
    setScenarioMode(mode);
    setStepsCompleted([true, false, false, false, false]);
  };

  useEffect(() => {
    if (scenarioFile && !scenarioContent) {
      if (scenarioFile instanceof File) {
        extractFileContent(scenarioFile, 'scenario');
      } else {
        console.error("scenarioFile is not a File instance");
      }
    }
    
    if (rubricFile && !rubricContent) {
      if (rubricFile instanceof File) {
        extractFileContent(rubricFile, 'rubric');
      } else {
        console.error("rubricFile is not a File instance");
      }
    }
  }, [scenarioFile, rubricFile]);

  const extractFileContent = async (file: File, type: 'scenario' | 'rubric') => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileContent = e.target?.result as string;
      
      if (type === 'scenario') {
        setScenarioContent(fileContent);
      } else {
        setRubricContent(fileContent);
      }
    };
    
    fileReader.readAsText(file);
  };

  const handleAiScenarioGenerate = async (values?: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a roleplay scenario",
        variant: "destructive"
      });
      return;
    }
    
    if (!segment) {
      toast({
        title: "Invalid segment",
        description: "Please select a valid practice segment",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    const formValues = values || document.querySelector('form')?.elements;
    
    try {
      const formData: Record<string, any> = {
        userId: user.id,
        segment,
        timeLimit: formValues?.timeLimit?.value || "10",
        buyerPersona: formValues?.buyerPersona?.value || "",
        industry: formValues?.industry?.value || "",
        personality: formValues?.personality?.value || "",
        rubric: formValues?.rubric?.value || "",
        additionalNotes: formValues?.additionalNotes?.value || "",
      };
      
      if (scenarioContent) {
        formData.scenarioContent = scenarioContent;
      }
      
      if (rubricContent) {
        formData.rubricContent = rubricContent;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-roleplay-scenario', {
        body: formData
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
      setGeneratedScenarioTitle(data.scenario?.title || "Sales Pitch");
      
      const newStepsCompleted = [...stepsCompleted];
      newStepsCompleted[currentStep] = true;
      setStepsCompleted(newStepsCompleted);
      setCurrentStep(2);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
      
    } catch (error: any) {
      console.error("Error generating scenario:", error);
      toast({
        title: "Error generating scenario",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadScenario = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a roleplay scenario",
        variant: "destructive"
      });
      return;
    }
    
    if (!scenarioFile) {
      toast({
        title: "Missing scenario file",
        description: "Please upload a scenario document",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzingScenario(true);
    
    try {
      const scenarioFilePath = `${user.id}/${Date.now()}_${scenarioFile.name}`;
      const { data: scenarioUploadData, error: scenarioUploadError } = await supabase.storage
        .from('documents')
        .upload(scenarioFilePath, scenarioFile);
      
      if (scenarioUploadError) throw scenarioUploadError;
      
      const { data: scenarioDocumentData, error: scenarioDocumentError } = await supabase
        .from('rag_documents')
        .insert({
          user_id: user.id,
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
        const rubricFilePath = `${user.id}/${Date.now()}_${rubricFile.name}`;
        const { data: rubricUploadData, error: rubricUploadError } = await supabase.storage
          .from('documents')
          .upload(rubricFilePath, rubricFile);
        
        if (rubricUploadError) throw rubricUploadError;
        
        const { data: rubricDocumentData, error: rubricDocumentError } = await supabase
          .from('rag_documents')
          .insert({
            user_id: user.id,
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
      fileReader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        toast({
          title: "Processing scenario",
          description: "AI is analyzing your scenario document...",
        });
        
        try {
          const requestData: Record<string, any> = {
            documentId: scenarioDocumentData.id,
            documentText: fileContent,
            userId: user.id,
          };
          
          if (rubricDocumentId) {
            requestData.rubricDocumentId = rubricDocumentId;
          }
          
          const { data, error } = await supabase.functions.invoke('rag-scenario-parser', {
            body: requestData
          });
          
          if (error) throw error;
          
          if (data.success && data.sessionId) {
            toast({
              title: "Scenario created",
              description: "Your scenario has been processed and a practice session created!"
            });
            
            setScenarioGenerated(true);
            setGeneratedScenarioId(data.sessionId);
            setGeneratedScenarioTitle(data.scenario?.title || "Uploaded Scenario");
            
            const newStepsCompleted = [...stepsCompleted];
            newStepsCompleted[currentStep] = true;
            setStepsCompleted(newStepsCompleted);
            setCurrentStep(2);
            
          } else if (data.fallbackScenario) {
            toast({
              title: "Using fallback scenario",
              description: "We couldn't fully analyze your document, but created a practice scenario for you."
            });
          }
        } catch (error) {
          console.error("Error processing scenario:", error);
          toast({
            title: "Error processing scenario",
            description: "There was a problem analyzing your document. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsAnalyzingScenario(false);
        }
      };
      
      fileReader.readAsText(scenarioFile);
      
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error uploading files",
        description: "There was a problem uploading your files. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzingScenario(false);
    }
  };

  const handlePracticeSegmentChange = (segment: string) => {
    setPracticeSegment(segment);
  };

  const handleTimeLimitChange = (minutes: number) => {
    setTimeLimit(minutes);
  };

  const startPractice = () => {
    if (generatedScenarioId) {
      navigate(`/roleplay/${generatedScenarioId}`);
    } else {
      toast({
        title: "Missing scenario",
        description: "Please complete the scenario generation first",
        variant: "destructive"
      });
    }
  };

  const backgroundGradient = segmentColors[segment || ''] || 'from-purple-500/10 to-pink-500/10';

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Step 1: Select Method
        return (
          <ScenarioModeSelect 
            selectedMode={scenarioMode} 
            onModeSelect={handleModeSelect} 
            onNextStep={() => nextStep()}
          />
        );
        
      case 1: // Step 2: Configure Scenario or Upload Documents
        if (scenarioMode === 'ai') {
          return (
            <AiScenarioForm 
              onSubmit={handleAiScenarioGenerate}
              setIsFormValid={setIsFormValid}
            />
          );
        } else {
          return (
            <ScenarioUploadForm 
              setIsUploadValid={setIsUploadValid}
              onScenarioFileChange={setScenarioFile}
              onRubricFileChange={setRubricFile}
            />
          );
        }
        
      case 2: // Step 3: Generate/Process
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight highlight-gradient">
                Step 3: {scenarioMode === 'ai' ? 'Generate Scenario' : 'Process Documents'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {scenarioMode === 'ai' 
                  ? 'We are generating your custom AI scenario' 
                  : 'We are analyzing your uploaded documents'}
              </p>
            </div>

            <Card className={`bg-gradient-to-br ${
              scenarioMode === 'ai' 
                ? 'from-dopamine-purple/10 to-dopamine-pink/5' 
                : 'from-dopamine-cyan/10 to-blue-500/5'
            } border-0 shadow-md p-8`}>
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                {isGenerating || isAnalyzingScenario ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`h-16 w-16 rounded-full ${
                          scenarioMode === 'ai' ? 'bg-dopamine-purple/30' : 'bg-dopamine-cyan/30'
                        } animate-ping`}></div>
                      </div>
                      <Loader2 className={`h-16 w-16 animate-spin ${
                        scenarioMode === 'ai' ? 'text-dopamine-purple' : 'text-dopamine-cyan'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold mt-6">
                      {scenarioMode === 'ai' 
                        ? 'Generating your scenario...' 
                        : 'Analyzing your documents...'}
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      {scenarioMode === 'ai'
                        ? 'Our AI is crafting a customized sales scenario based on your specifications.'
                        : 'Our AI is extracting key information from your uploaded documents.'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className={`h-16 w-16 rounded-full ${
                      scenarioMode === 'ai' 
                        ? 'bg-dopamine-purple/20 text-dopamine-purple' 
                        : 'bg-dopamine-cyan/20 text-dopamine-cyan'
                    } flex items-center justify-center`}>
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mt-6">
                      {scenarioGenerated ? 'Scenario Ready!' : 'Processing Complete!'}
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {generatedScenarioTitle ? `"${generatedScenarioTitle}"` : 'Your scenario'} is now ready for practice.
                    </p>
                    
                    <Button 
                      onClick={nextStep} 
                      className={`bg-gradient-to-r ${
                        scenarioMode === 'ai'
                          ? 'from-dopamine-purple to-dopamine-pink'
                          : 'from-dopamine-cyan to-blue-500'
                      } text-white px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition-all`}
                    >
                      <span>Continue to Evaluation Setup</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        );
        
      case 3: // Step 4: Evaluation Setup
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight highlight-gradient">
                Step 4: Evaluation Setup
              </h2>
              <p className="text-muted-foreground mt-2">
                Configure your practice session parameters
              </p>
            </div>
            
            <EvaluationSetupForm 
              segment={practiceSegment}
              scenarioMode={scenarioMode}
              onPracticeSegmentChange={handlePracticeSegmentChange}
              onTimeLimitChange={handleTimeLimitChange}
            />
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={nextStep} 
                className={`bg-gradient-to-r ${
                  scenarioMode === 'ai'
                    ? 'from-dopamine-purple to-dopamine-pink'
                    : 'from-dopamine-cyan to-blue-500'
                } text-white px-6 py-2 rounded-lg`}
              >
                <span>Continue to Recording</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        );
        
      case 4: // Step 5: Record & Upload
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight highlight-gradient">
                Step 5: Record & Upload
              </h2>
              <p className="text-muted-foreground mt-2">
                Record your {practiceSegment && segmentTitles[practiceSegment]} practice, then upload the video for AI analysis
              </p>
            </div>

            <div className="mb-8">
              <UploadRoleplay 
                scenarioTitle={generatedScenarioTitle || `${practiceSegment && segmentTitles[practiceSegment]} Practice`}
                scenarioId={generatedScenarioId}
                segment={practiceSegment}
              />
            </div>
            
            <Card className="border-0 p-4 bg-muted/30">
              <CardContent className="p-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> For best results, record yourself delivering a complete practice session. 
                  Speak clearly and position yourself so that your face and gestures are visible.
                  Your time limit is set to {timeLimit} minutes.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
        
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-col mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {segmentTitles[segment || 'full_roleplay']} Practice
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up your practice scenario for the {segmentTitles[segment || 'full_roleplay'].toLowerCase()} phase of a sales call
            </p>
          </motion.div>

          <Separator className="my-6" />
          
          {/* Step indicator */}
          <StepIndicator 
            steps={stepTitles[scenarioMode]} 
            currentStep={currentStep}
            scenarioMode={scenarioMode}
          />
          
          {/* Step content */}
          <motion.div 
            className="my-8"
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderStepContent()}
          </motion.div>
          
          {/* Navigation (except for the first step which has its own next button) */}
          {currentStep !== 0 && (
            <StepNavigation 
              currentStep={currentStep}
              totalSteps={stepTitles[scenarioMode].length}
              onBack={prevStep}
              onNext={nextStep}
              isNextDisabled={!isNextEnabled()}
              isProcessing={isGenerating || isAnalyzingScenario}
              scenarioMode={scenarioMode}
              nextText={currentStep === 4 ? "Finish" : undefined}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContextSetup;
