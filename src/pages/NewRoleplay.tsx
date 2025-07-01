
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import PracticeSegmentSelect from '@/components/roleplay/PracticeSegmentSelect';
import { Separator } from '@/components/ui/separator';
import { PracticeSegment } from '@/components/roleplay/PracticeSegmentSelect';
import { CheckCircle2, Sparkles, Zap, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const NewRoleplay = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to the practice segments when the page loads
    const timer = setTimeout(() => {
      const element = document.getElementById('practice-segments');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSegmentSelect = (segment: PracticeSegment) => {
    if (segment === 'elevator_pitch') {
      navigate('/student/roleplay/elevator-pitch');
    } else {
      navigate(`/student/roleplay/context-setup/${segment}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-background via-dopamine-purple/5 to-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 bg-gradient-to-r from-dopamine-purple/15 to-dopamine-pink/10 p-8 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Background decorative elements with animation */}
            <motion.div 
              className="absolute -top-20 -right-20 w-64 h-64 bg-dopamine-purple/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div 
              className="absolute -bottom-12 -left-12 w-40 h-40 bg-dopamine-pink/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="inline-block bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/20 p-3 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                <Sparkles className="h-8 w-8 text-dopamine-purple animate-pulse-subtle" />
              </motion.div>
              
              <motion.h1 
                className="text-3xl font-bold tracking-tight highlight-gradient mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Practice Sales Skills
              </motion.h1>
              
              <motion.p 
                className="text-muted-foreground mt-2 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Choose a segment of the sales call to practice, record your elevator pitch, or complete a full roleplay session
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 justify-center mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <div className="flex items-center text-sm text-dopamine-green bg-gradient-to-r from-dopamine-green/10 to-transparent px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    AI-Powered Feedback
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="flex items-center text-sm text-dopamine-blue bg-gradient-to-r from-dopamine-blue/10 to-transparent px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Personalized Scenarios
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="flex items-center text-sm text-dopamine-pink bg-gradient-to-r from-dopamine-pink/10 to-transparent px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Track Your Progress
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="flex items-center text-sm text-dopamine-orange bg-gradient-to-r from-dopamine-orange/10 to-transparent px-3 py-1.5 rounded-full">
                    <Zap className="h-4 w-4 mr-1" />
                    Build Confidence
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="mt-10 animate-bounce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <ArrowDown className="h-6 w-6 mx-auto text-dopamine-purple/60" />
              </motion.div>
            </div>
          </motion.div>

          <Separator className="mb-8 opacity-50" />

          <div id="practice-segments">
            <PracticeSegmentSelect onSelect={handleSegmentSelect} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewRoleplay;
