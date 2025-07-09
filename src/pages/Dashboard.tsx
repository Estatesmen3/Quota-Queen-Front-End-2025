
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import CallControl from "@/components/calls/CallControl";
import ProfileSection from "@/components/dashboard/ProfileSection";
import GoalsSection from "@/components/dashboard/GoalsSection";
import SetGoalsDialog from "@/components/dashboard/SetGoalsDialog";
import PerformanceLibrary from "@/components/dashboard/PerformanceLibrary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ResourcesSection from "@/components/dashboard/ResourcesSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { profile } = useAuth();
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Random sparkle effect timing
    const interval = setInterval(() => {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }, 3000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Dashboard Header */}
        <DashboardHeader 
          profile={profile}
          onSetGoals={() => setIsGoalsDialogOpen(true)}
          showSparkles={showSparkles}
        />

        {/* Profile Section */}
        <ProfileSection />

        {/* Goals Section */}
        <GoalsSection />

        <motion.div 
          className=""
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Video Call Controls */}
          {/* <motion.div variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100
              }
            }
          }}>
            <CallControl />
          </motion.div> */}
          
          {/* Performance Library */}
          <motion.div variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100
              }
            }
          }}>
            <PerformanceLibrary />
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Recent Activities */}
          <RecentActivities />

          {/* Resources */}
          <ResourcesSection />

          {/* Messages Quick Access */}
          <MessagesSection />
        </motion.div>
      </div>

      <SetGoalsDialog 
        open={isGoalsDialogOpen} 
        onOpenChange={setIsGoalsDialogOpen} 
        onGoalAdded={() => {}} 
      />
    </DashboardLayout>
  );
};

export default Dashboard;