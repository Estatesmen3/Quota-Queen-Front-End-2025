
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

interface TrendBadgeProps {
  value: number;
  suffix?: string;
  className?: string;
}

const TrendBadge = ({ value, suffix = "%", className }: TrendBadgeProps) => {
  const isPositive = value > 0;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5",
        isPositive 
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        className
      )}
    >
      {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
      {Math.abs(value)}{suffix}
    </span>
  );
};

export default TrendBadge;
