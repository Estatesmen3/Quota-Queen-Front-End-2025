
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [showFlash, setShowFlash] = useState(false);
  const [showFinalFlash, setShowFinalFlash] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Start first gradient pulse after 1.8 seconds
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 1800);
    
    // Start final gradient flash that transitions into the main page
    const finalFlashTimer = setTimeout(() => {
      setShowFinalFlash(true);
    }, 2600);
    
    // Complete the entire animation after 3.8 seconds
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3800);
    
    // Safety timer to ensure animation completes even in case of errors
    const safetyTimer = setTimeout(() => {
      onAnimationComplete();
    }, 5000);
    
    return () => {
      clearTimeout(flashTimer);
      clearTimeout(finalFlashTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-dopamine-purple to-dopamine-purple/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Main logo */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: showFlash ? 1.2 : 1, 
          opacity: showFinalFlash ? 0 : 1 
        }}
        transition={{ 
          scale: { duration: 0.6, ease: "easeOut" },
          opacity: { duration: 0.8, ease: "easeOut" }
        }}
      >
        <div className="w-40 h-40 md:w-64 md:h-64 rounded-xl bg-gradient-to-br from-dopamine-purple to-dopamine-pink flex items-center justify-center shadow-lg relative overflow-hidden">
          <Crown className="text-white w-20 h-20 md:w-32 md:h-32 z-10" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-dopamine-pink via-transparent to-white/30 opacity-50"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
        
        {/* Enhanced glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-dopamine-pink to-dopamine-purple opacity-0 blur-md"
          animate={{ 
            opacity: [0, 0.9, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: showFlash ? 0 : Infinity,
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
        
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-xl border-4 border-white/20"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.1, 0.5, 0]
          }}
          transition={{
            repeat: showFlash ? 0 : Infinity,
            duration: 1.8,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.2
          }}
        />
      </motion.div>
      
      {/* First gradient flash effect */}
      {showFlash && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-dopamine-pink to-dopamine-purple"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
      )}
      
      {/* Final expanding gradient flash that transitions to the main page */}
      {showFinalFlash && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-dopamine-blue via-dopamine-purple to-dopamine-pink"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 1.5],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
        />
      )}
    </motion.div>
  );
};
