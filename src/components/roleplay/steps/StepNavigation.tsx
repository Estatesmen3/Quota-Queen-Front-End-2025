
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isProcessing?: boolean;
  nextText?: string;
  scenarioMode: 'ai' | 'upload';
}

const StepNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
  isProcessing = false,
  nextText,
  scenarioMode,
}: StepNavigationProps) => {
  const isPrimaryButton = scenarioMode === 'ai';
  const buttonGradient = isPrimaryButton 
    ? 'from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90'
    : 'from-dopamine-cyan to-blue-500 hover:from-dopamine-cyan/90 hover:to-blue-500/90';
  
  const buttonShadow = isPrimaryButton
    ? 'shadow-[0_4px_18px_0_rgba(139,92,246,0.35)]'
    : 'shadow-[0_4px_18px_0_rgba(14,165,233,0.35)]';
  
  return (
    <motion.div 
      className="flex justify-between mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {currentStep > 0 ? (
        <motion.div
          whileHover={{ x: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button 
            variant="outline" 
            onClick={onBack}
            className="group transition-all duration-300 hover:bg-gray-100 border border-gray-300"
            disabled={isProcessing}
          >
            <ArrowLeft className={`h-4 w-4 mr-2 group-hover:${
              isPrimaryButton ? 'text-dopamine-purple' : 'text-dopamine-cyan'
            } transition-colors`} />
            <span className={`group-hover:${
              isPrimaryButton ? 'text-dopamine-purple' : 'text-dopamine-cyan'
            } transition-colors`}>Back</span>
          </Button>
        </motion.div>
      ) : (
        <div></div> // Empty div to maintain flex layout
      )}
      
      {currentStep < totalSteps - 1 && (
        <motion.div
          whileHover={{ x: 3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button 
            onClick={onNext}
            className={`bg-gradient-to-r ${buttonGradient} text-white ${buttonShadow} hover:shadow-lg transition-all duration-300`}
            disabled={isNextDisabled || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="relative">
                  Processing
                  <span className="absolute -right-4 top-0 animate-pulse">...</span>
                </span>
              </>
            ) : (
              <>
                <span>{nextText || 'Next'}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepNavigation;
