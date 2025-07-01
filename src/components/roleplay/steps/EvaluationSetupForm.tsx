
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Clock, CheckCircle, Sparkles } from "lucide-react";

interface EvaluationSetupFormProps {
  segment?: string;
  scenarioMode: 'ai' | 'upload';
  onPracticeSegmentChange: (segment: string) => void;
  onTimeLimitChange: (timeLimit: number) => void;
}

const EvaluationSetupForm = ({
  segment,
  scenarioMode,
  onPracticeSegmentChange,
  onTimeLimitChange
}: EvaluationSetupFormProps) => {
  const [timeLimit, setTimeLimit] = useState(10);
  const [practiceSegment, setPracticeSegment] = useState(segment || 'full_roleplay');
  
  // Apply changes when values change
  useEffect(() => {
    onTimeLimitChange(timeLimit);
    onPracticeSegmentChange(practiceSegment);
  }, [timeLimit, practiceSegment, onTimeLimitChange, onPracticeSegmentChange]);

  const segmentOptions = [
    { value: 'full_roleplay', label: 'Full Sales Call' },
    { value: 'intro_rapport', label: 'Introduction & Rapport Building' },
    { value: 'agenda', label: 'Setting the Agenda' },
    { value: 'needs_identification', label: 'Needs Identification' },
    { value: 'presentation', label: 'Solution Presentation' },
    { value: 'objection_handling', label: 'Objection Handling' },
    { value: 'closing', label: 'Closing Techniques' },
  ];

  const segmentColors = {
    'full_roleplay': 'bg-gradient-to-b from-dopamine-purple/30 to-dopamine-pink/20',
    'intro_rapport': 'bg-gradient-to-b from-dopamine-blue/30 to-sky-500/20',
    'agenda': 'bg-gradient-to-b from-teal-500/30 to-cyan-500/20',
    'needs_identification': 'bg-gradient-to-b from-amber-500/30 to-orange-500/20',
    'presentation': 'bg-gradient-to-b from-dopamine-pink/30 to-rose-500/20',
    'objection_handling': 'bg-gradient-to-b from-red-500/30 to-orange-500/20',
    'closing': 'bg-gradient-to-b from-yellow-500/30 to-amber-500/20',
  };

  const getSegmentIcon = () => {
    return <Sparkles className="h-4 w-4 mr-1.5 inline-block" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className={`bg-gradient-to-br ${
        scenarioMode === 'ai' 
          ? 'from-dopamine-purple/10 to-dopamine-pink/5' 
          : 'from-dopamine-cyan/10 to-blue-500/5'
      } border-0 shadow-md overflow-hidden`}>
        <div className="absolute top-0 right-0 h-32 w-32 -mt-10 -mr-10 opacity-10">
          <div className={`w-full h-full rounded-full ${
            scenarioMode === 'ai' ? 'bg-dopamine-purple' : 'bg-dopamine-cyan'
          } blur-2xl`}></div>
        </div>
        
        <CardContent className="space-y-6 p-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Practice Segment Selection */}
            <div className="space-y-2">
              <Label htmlFor="practiceSegment" className="font-medium flex items-center">
                <Sparkles className={`h-4 w-4 mr-1.5 ${
                  scenarioMode === 'ai' ? 'text-dopamine-purple' : 'text-dopamine-cyan'
                }`} />
                Practice Segment
              </Label>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Select 
                  value={practiceSegment} 
                  onValueChange={(value) => setPracticeSegment(value)}
                >
                  <SelectTrigger 
                    id="practiceSegment" 
                    className={`w-full transition-all duration-300 ring-offset-background hover:ring-2 hover:ring-offset-2 ${
                      scenarioMode === 'ai' 
                        ? 'hover:ring-dopamine-purple/40' 
                        : 'hover:ring-dopamine-cyan/40'
                    }`}
                  >
                    <SelectValue placeholder="Select practice segment" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {segmentOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="flex items-center cursor-pointer transition-colors hover:bg-muted rounded-md px-2 py-1.5 my-1"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`h-6 w-6 rounded-full ${segmentColors[option.value] || ''} flex items-center justify-center`}>
                            {getSegmentIcon()}
                          </div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-1">
                Select which part of the sales conversation you want to focus on
              </p>
            </div>

            {/* Time Limit Selection */}
            <div className="space-y-2">
              <Label htmlFor="timeLimit" className="font-medium flex items-center">
                <Clock className={`h-4 w-4 mr-1.5 ${
                  scenarioMode === 'ai' ? 'text-dopamine-purple' : 'text-dopamine-cyan'
                }`} />
                Time Limit (minutes)
              </Label>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      max="30"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value) || 10)}
                      className={`pr-10 transition-all duration-300 ring-offset-background hover:ring-2 hover:ring-offset-2 ${
                        scenarioMode === 'ai' 
                          ? 'hover:ring-dopamine-purple/40' 
                          : 'hover:ring-dopamine-cyan/40'
                      }`}
                    />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-1">
                Set a time limit for your practice session (1-30 minutes)
              </p>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className={`bg-foreground/5 p-4 rounded-lg mt-4 border border-foreground/10 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 ${
              segmentColors[practiceSegment] || 'bg-gradient-to-br from-dopamine-purple/5 to-dopamine-pink/5'
            } opacity-30`}></div>
            
            <div className="flex items-start space-x-3 relative z-10">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br ${
                scenarioMode === 'ai' 
                  ? 'from-dopamine-purple/20 to-dopamine-pink/20' 
                  : 'from-dopamine-cyan/20 to-blue-500/20'
              } flex items-center justify-center`}>
                <Timer className={`h-4 w-4 ${
                  scenarioMode === 'ai' ? 'text-dopamine-purple' : 'text-dopamine-cyan'
                }`} />
              </div>
              <div>
                <h4 className="text-sm font-medium">Practice Session Configuration</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  These settings will help structure your practice and ensure you're focusing on the right skills.
                  You'll be evaluated based on the specific segment you choose.
                </p>
                <div className="mt-3 flex items-center text-sm text-dopamine-purple/90">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  <span>Real-time AI coaching and evaluation</span>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EvaluationSetupForm;
