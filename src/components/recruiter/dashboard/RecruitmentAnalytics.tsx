
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Star, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GradientCard from "@/components/recruiter/GradientCard";
import TrendBadge from "@/components/recruiter/TrendBadge";

const RecruitmentAnalytics = () => {
  return (
    <GradientCard
      gradientClassName="bg-gradient-to-r from-primary/10 via-background to-accent/10"
      header={
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              Recruitment Analytics
              <Star className="h-4 w-4 text-yellow-400 animate-pulse-subtle" />
            </CardTitle>
            <CardDescription>
              Key metrics from your recruitment activities
            </CardDescription>
          </div>
          <Button variant="outline" className="glow-on-hover" asChild>
            <Link to="/recruiter/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Full Analytics
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            Application Conversion
            <AlertCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
          </h4>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">24%</span>
            <TrendBadge value={3.2} />
          </div>
          <Progress value={24} className="h-1.5 bg-muted" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
        
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            Interview Rate
            <AlertCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
          </h4>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">68%</span>
            <TrendBadge value={5.7} />
          </div>
          <Progress value={68} className="h-1.5 bg-muted" indicatorClassName="bg-gradient-to-r from-sky-500 to-indigo-500" />
        </div>
        
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            Offer Acceptance
            <AlertCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
          </h4>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">82%</span>
            <TrendBadge value={-2.1} />
          </div>
          <Progress value={82} className="h-1.5 bg-muted" indicatorClassName="bg-gradient-to-r from-pink-500 to-rose-500" />
        </div>
        
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            Time to Hire
            <AlertCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground/70" />
          </h4>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">18</span>
            <span className="text-xs">days</span>
            <TrendBadge value={-2} suffix="d" />
          </div>
          <Progress value={70} className="h-1.5 bg-muted" indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-500" />
        </div>
      </div>
    </GradientCard>
  );
};

export default RecruitmentAnalytics;
