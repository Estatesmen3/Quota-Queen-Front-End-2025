
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { ResumeAnalyzer } from "./ResumeAnalyzer";
import { JobMatcher } from "./JobMatcher";
import { CareerInsights } from "./CareerInsights";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function CareerTools() {
  const [activeTab, setActiveTab] = useState("resume");
  const { profile } = useAuth();
  const isStudent = profile?.user_type === "student";
  
  // If user is not a student, redirect to dashboard
  if (!isStudent) {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <div className="bg-white bg-opacity-70 backdrop-blur-sm p-2 rounded-lg shadow-sm inline-block">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-muted/50 p-1 backdrop-blur-sm">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger 
                value="resume" 
                className={`flex items-center relative ${activeTab === "resume" ? "bg-gradient-to-r from-dopamine-purple/10 to-dopamine-purple/5" : ""}`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume Analyzer
                {activeTab === "resume" && (
                  <motion.div 
                    className="absolute top-0 right-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles className="h-3 w-3 text-dopamine-purple" />
                  </motion.div>
                )}
              </TabsTrigger>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger 
                value="jobs" 
                className={`flex items-center relative ${activeTab === "jobs" ? "bg-gradient-to-r from-dopamine-blue/10 to-dopamine-blue/5" : ""}`}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Job Matcher
                {activeTab === "jobs" && (
                  <motion.div 
                    className="absolute top-0 right-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles className="h-3 w-3 text-dopamine-blue" />
                  </motion.div>
                )}
              </TabsTrigger>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <TabsTrigger 
                value="insights" 
                className={`flex items-center relative ${activeTab === "insights" ? "bg-gradient-to-r from-dopamine-pink/10 to-dopamine-pink/5" : ""}`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Career Insights
                {activeTab === "insights" && (
                  <motion.div 
                    className="absolute top-0 right-1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Sparkles className="h-3 w-3 text-dopamine-pink" />
                  </motion.div>
                )}
              </TabsTrigger>
            </motion.div>
          </TabsList>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === "resume" && (
            <motion.div
              key="resume"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="resume" className="space-y-4 mt-0 bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <ResumeAnalyzer />
              </TabsContent>
            </motion.div>
          )}
          
          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="jobs" className="space-y-4 mt-0 bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <JobMatcher />
              </TabsContent>
            </motion.div>
          )}
          
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="insights" className="space-y-4 mt-0 bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <CareerInsights />
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
