
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  scenarioMode: 'ai' | 'upload';
}

const StepIndicator = ({ steps, currentStep, scenarioMode }: StepIndicatorProps) => {
  // Colors based on scenario mode
  const getColors = () => {
    if (scenarioMode === 'ai') {
      return {
        active: 'text-dopamine-purple border-dopamine-purple bg-dopamine-purple',
        glow: 'rgba(139, 92, 246, 0.5)',
        text: 'text-dopamine-purple',
        line: 'from-dopamine-purple to-dopamine-pink'
      };
    } else {
      return {
        active: 'text-dopamine-cyan border-dopamine-cyan bg-dopamine-cyan',
        glow: 'rgba(14, 165, 233, 0.5)',
        text: 'text-dopamine-cyan',
        line: 'from-dopamine-cyan to-blue-500'
      };
    }
  };
  
  const colors = getColors();
  
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step circle with label */}
              <div className="flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    boxShadow: isCurrent ? 
                      `0 0 15px 5px ${colors.glow}` : 
                      'none',
                  }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 text-center font-semibold transition-all",
                    isCompleted 
                      ? `${colors.active} text-white shadow-lg` 
                      : isCurrent 
                        ? `border-${scenarioMode === 'ai' ? 'dopamine-purple' : 'dopamine-cyan'} ${colors.text} shadow-md` 
                        : "border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Step label with consistent vertical alignment */}
                <motion.div 
                  initial={false}
                  animate={{
                    opacity: isCurrent ? 1 : 0.8,
                    scale: isCurrent ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 h-10 flex items-center justify-center"
                >
                  <span 
                    className={cn(
                      "text-sm text-center font-medium",
                      isCurrent 
                        ? `${colors.text} font-semibold`
                        : isCompleted 
                          ? "text-gray-900" 
                          : "text-gray-500"
                    )}
                  >
                    {step}
                  </span>
                </motion.div>
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={false}
                  animate={{
                    opacity: index < currentStep ? 1 : 0.4,
                  }}
                  className={cn(
                    "w-full max-w-[100px] h-[3px] flex-grow mx-2 rounded-full",
                    index < currentStep 
                      ? `bg-gradient-to-r ${colors.line}` 
                      : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
