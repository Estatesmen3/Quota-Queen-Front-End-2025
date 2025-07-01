
import React from "react";
import ActivityCard from "@/components/dashboard/ActivityCard";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "roleplay" | "video";
  title: string;
  completedTime: string;
  score: number;
}

const RecentActivities: React.FC = () => {
  // Mock data for activities
  const recentActivities = [
    {
      id: "1",
      type: "roleplay" as const,
      title: "Enterprise SaaS Sales",
      completedTime: "yesterday",
      score: 91
    },
    {
      id: "2",
      type: "video" as const,
      title: "Mock Interview Practice",
      completedTime: "2 days ago",
      score: 78
    },
    {
      id: "3",
      type: "roleplay" as const,
      title: "Cold Call Prospecting",
      completedTime: "3 days ago",
      score: 85
    }
  ];

  return (
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
      <ActivityCard activities={recentActivities} />
    </motion.div>
  );
};

export default RecentActivities;
