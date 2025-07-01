
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProfileData } from "@/types/profiles";
import { PlayCircle, Trophy, Target, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  profile: ProfileData | null;
  onSetGoals: () => void;
  showSparkles: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  profile, 
  onSetGoals,
  showSparkles 
}) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.first_name || "User"}
        </p>
        {showSparkles && (
          <div className="absolute -top-2 -right-8">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" 
          onClick={onSetGoals}
          className="hover:bg-gradient-to-r hover:from-dopamine-purple/10 hover:to-dopamine-pink/10 transition-all duration-300"
        >
          <Target className="mr-2 h-4 w-4" />
          Set Goals
        </Button>
        <Button 
          asChild
          className="hover:shadow-md hover:shadow-dopamine-purple/20 transition-all duration-300"
        >
          <Link to="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </Button>
        <Button 
          asChild
          className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:shadow-lg hover:shadow-dopamine-pink/20 transition-all duration-300"
        >
          <Link to="/roleplay/new">
            <PlayCircle className="mr-2 h-4 w-4" />
            Practice
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
