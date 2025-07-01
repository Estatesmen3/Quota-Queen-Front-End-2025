
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { FileUp, X, FileText } from "lucide-react";

interface ScenarioUploadFormProps {
  setIsUploadValid: (isValid: boolean) => void;
  onScenarioFileChange: (file: File | null) => void;
  onRubricFileChange: (file: File | null) => void;
}

const ScenarioUploadForm = ({ 
  setIsUploadValid, 
  onScenarioFileChange, 
  onRubricFileChange 
}: ScenarioUploadFormProps) => {
  const { toast } = useToast();
  const [scenarioFile, setScenarioFile] = useState<File | null>(null);
  const [rubricFile, setRubricFile] = useState<File | null>(null);

  // Update validity whenever the scenario file changes
  React.useEffect(() => {
    setIsUploadValid(!!scenarioFile);
  }, [scenarioFile, setIsUploadValid]);

  const handleScenarioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, or text file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setScenarioFile(file);
      onScenarioFileChange(file);
      
      toast({
        title: "Scenario uploaded",
        description: "Your scenario file has been attached."
      });
    }
  };

  const handleRubricUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setRubricFile(file);
      onRubricFileChange(file);
      
      toast({
        title: "Rubric uploaded",
        description: "Your rubric file has been attached."
      });
    }
  };

  const removeScenarioFile = () => {
    setScenarioFile(null);
    onScenarioFileChange(null);
  };

  const removeRubricFile = () => {
    setRubricFile(null);
    onRubricFileChange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Step 2: Upload Your Documents
          </span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload your scenario document and optional rubric for AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario Upload Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            initial="notSelected"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            variants={{
              notSelected: { 
                y: 0, 
                scale: 1,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
              },
              hover: { 
                y: -5,
                scale: 1.03,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Card className="cursor-pointer transition-all duration-300 h-full overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 -mt-20 -mr-20 opacity-10">
                <div className="w-full h-full rounded-full bg-dopamine-blue blur-3xl"></div>
              </div>
              
              <CardHeader className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-dopamine-blue/5 to-blue-500/5 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ 
                    type: "tween", 
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-dopamine-blue/20 to-blue-500/20 mb-4"
                >
                  <FileUp className="h-12 w-12 text-dopamine-blue" />
                </motion.div>
                <CardTitle className="text-2xl mb-3 bg-gradient-to-r from-dopamine-blue to-blue-500 bg-clip-text text-transparent">
                  Scenario Document
                </CardTitle>
                <CardDescription className="text-base">
                  Upload your sales scenario document (PDF, DOCX, or TXT)
                </CardDescription>
                
                {scenarioFile ? (
                  <div className="mt-4 w-full flex items-center justify-between p-3 bg-dopamine-blue/5 rounded-md border border-dopamine-blue/20">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-dopamine-blue" />
                      <div className="text-sm font-medium truncate max-w-[150px]">
                        {scenarioFile.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ({Math.round(scenarioFile.size / 1024)} KB)
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeScenarioFile}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-dopamine-blue/20 rounded-md hover:border-dopamine-blue/40 transition-colors">
                    <FileUp className="h-10 w-10 text-dopamine-blue/50 mb-2" />
                    <p className="text-sm text-center text-muted-foreground mb-2">
                      Drag and drop your scenario document here, or click to browse
                    </p>
                    <input
                      type="file"
                      id="scenarioUpload"
                      onChange={handleScenarioUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="scenarioUpload">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer border-dopamine-blue/30 text-dopamine-blue hover:bg-dopamine-blue/10"
                      >
                        Select Document
                      </Button>
                    </label>
                  </div>
                )}
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Your document should contain a sales roleplay scenario with:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Company/product information</li>
                    <li>Buyer persona details</li>
                    <li>Scenario context/background</li>
                    <li>Sales objectives or goals</li>
                  </ul>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* Rubric Upload Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            initial="notSelected"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            variants={{
              notSelected: { 
                y: 0, 
                scale: 1,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
              },
              hover: { 
                y: -5,
                scale: 1.03,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Card className="cursor-pointer transition-all duration-300 h-full overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 -mt-20 -mr-20 opacity-10">
                <div className="w-full h-full rounded-full bg-dopamine-pink blur-3xl"></div>
              </div>
              
              <CardHeader className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-dopamine-pink/5 to-rose-500/5 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: 5 }}
                  transition={{ 
                    type: "tween", 
                    duration: 0.3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-dopamine-pink/20 to-rose-500/20 mb-4"
                >
                  <FileText className="h-10 w-10 text-dopamine-pink" />
                </motion.div>
                <CardTitle className="text-2xl mb-3 bg-gradient-to-r from-dopamine-pink to-rose-500 bg-clip-text text-transparent">
                  Evaluation Rubric
                </CardTitle>
                <CardDescription className="text-base">
                  Upload an evaluation rubric to assess performance (Optional)
                </CardDescription>
                
                {rubricFile ? (
                  <div className="mt-4 w-full flex items-center justify-between p-3 bg-dopamine-pink/5 rounded-md border border-dopamine-pink/20">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-dopamine-pink" />
                      <div className="text-sm font-medium truncate max-w-[150px]">
                        {rubricFile.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ({Math.round(rubricFile.size / 1024)} KB)
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeRubricFile}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-dopamine-pink/20 rounded-md hover:border-dopamine-pink/40 transition-colors">
                    <FileUp className="h-10 w-10 text-dopamine-pink/50 mb-2" />
                    <p className="text-sm text-center text-muted-foreground mb-2">
                      Drag and drop your rubric document here, or click to browse
                    </p>
                    <input
                      type="file"
                      id="rubricUpload"
                      onChange={handleRubricUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="rubricUpload">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer border-dopamine-pink/30 text-dopamine-pink hover:bg-dopamine-pink/10"
                      >
                        Select Rubric
                      </Button>
                    </label>
                  </div>
                )}
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Your rubric document should include:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Evaluation criteria</li>
                    <li>Performance indicators</li>
                    <li>Scoring guidelines</li>
                    <li>Success metrics</li>
                  </ul>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScenarioUploadForm;
