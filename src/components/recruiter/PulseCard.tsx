
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PulseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: boolean;
}

const PulseCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  gradient = false,
  className,
  ...props
}: PulseCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md card-hover-effect border",
        gradient && "bg-gradient-to-br from-background to-muted/50",
        className
      )} 
      {...props}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center pulse-animation">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-2">
            <span 
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-medium",
                trend.isPositive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PulseCard;
