
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, FileUp } from "lucide-react";
import { motion } from 'framer-motion';

type ScenarioMode = "ai" | "upload";

interface ScenarioModeSelectProps {
  selectedMode: ScenarioMode;
  onModeSelect: (mode: ScenarioMode) => void;
  onNextStep: () => void;
}

const ScenarioModeSelect = ({ 
  selectedMode, 
  onModeSelect, 
  onNextStep 
}: ScenarioModeSelectProps) => {
  
  const handleCardClick = (mode: ScenarioMode) => {
    onModeSelect(mode);
    setTimeout(onNextStep, 300); // Short delay for animation
  };

  const cardVariants = {
    selected: { 
      y: 0,
      scale: 1.02, 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    },
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <motion.h2 
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Step 1: Choose Your Scenario Method
          </span>
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Select how you'd like to create your practice scenario
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            variants={cardVariants}
            initial="notSelected"
            animate={selectedMode === 'ai' ? 'selected' : 'notSelected'}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedMode === 'ai' 
                  ? 'ring-2 ring-dopamine-purple ring-offset-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                  : 'hover:border-dopamine-purple/30 opacity-90 hover:opacity-100'
              } overflow-hidden`}
              onClick={() => handleCardClick('ai')}
            >
              <div className="absolute top-0 right-0 h-40 w-40 -mt-20 -mr-20 opacity-10">
                <div className="w-full h-full rounded-full bg-dopamine-purple blur-3xl"></div>
              </div>
              
              <CardHeader className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-dopamine-purple/5 to-dopamine-pink/5 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  // Fixed animation - replacing multi-keyframe rotate with tween
                  animate={{ rotate: 5 }}
                  transition={{ 
                    type: "tween", 
                    duration: 0.3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className={`h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-dopamine-purple/20 to-dopamine-pink/20 mb-4 ${
                    selectedMode === 'ai' ? 'animate-pulse-subtle' : ''
                  }`}
                >
                  <Sparkles className="h-10 w-10 text-dopamine-purple" />
                </motion.div>
                <CardTitle className="text-2xl mb-3 bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
                  Generate with AI
                </CardTitle>
                <CardDescription className="text-base">
                  Let AI create a custom sales scenario based on your inputs
                </CardDescription>
                
                {selectedMode === 'ai' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-4 right-4 h-8 w-8 bg-dopamine-purple rounded-full flex items-center justify-center text-white"
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                )}
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            variants={cardVariants}
            initial="notSelected"
            animate={selectedMode === 'upload' ? 'selected' : 'notSelected'}
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedMode === 'upload' 
                  ? 'ring-2 ring-dopamine-cyan ring-offset-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                  : 'hover:border-dopamine-cyan/30 opacity-90 hover:opacity-100'
              } overflow-hidden`}
              onClick={() => handleCardClick('upload')}
            >
              <div className="absolute top-0 right-0 h-40 w-40 -mt-20 -mr-20 opacity-10">
                <div className="w-full h-full rounded-full bg-dopamine-cyan blur-3xl"></div>
              </div>
              
              <CardHeader className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-dopamine-cyan/5 to-blue-500/5 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  // Fixed animation - replacing multi-keyframe y with tween
                  animate={{ y: -5 }}
                  transition={{ 
                    type: "tween", 
                    duration: 0.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className={`h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-dopamine-cyan/20 to-blue-500/20 mb-4 ${
                    selectedMode === 'upload' ? 'animate-pulse-subtle' : ''
                  }`}
                >
                  <FileUp className="h-10 w-10 text-dopamine-cyan" />
                </motion.div>
                <CardTitle className="text-2xl mb-3 bg-gradient-to-r from-dopamine-cyan to-blue-500 bg-clip-text text-transparent">
                  Upload Scenario
                </CardTitle>
                <CardDescription className="text-base">
                  Upload your own scenario document for AI analysis
                </CardDescription>
                
                {selectedMode === 'upload' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-4 right-4 h-8 w-8 bg-dopamine-cyan rounded-full flex items-center justify-center text-white"
                  >
                    <FileUp className="h-5 w-5" />
                  </motion.div>
                )}
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScenarioModeSelect;
