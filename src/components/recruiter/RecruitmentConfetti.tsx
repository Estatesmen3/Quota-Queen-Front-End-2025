
import React from "react";

interface ConfettiConfig {
  count?: number;
  colors?: string[];
}

// Empty confetti component that doesn't render anything
const RecruitmentConfetti = ({ count = 150, colors = ["#8B5CF6", "#EC4899", "#F97316", "#0EA5E9", "#10B981"] }: ConfettiConfig) => {
  return null;
};

export default RecruitmentConfetti;
