
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Activity, Clock } from "lucide-react";

interface StudentPerformanceProps {
  studentId: string;
  studentProfile?: any; // Added the studentProfile prop
}

const StudentPerformance: React.FC<StudentPerformanceProps> = ({ studentId, studentProfile }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary/80" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className="text-sm font-bold">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Roleplays</div>
                <div className="text-lg font-semibold">12</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Avg. Score</div>
                <div className="text-lg font-semibold">82%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Growth</div>
                <div className="text-lg font-semibold text-green-600">+15%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary/80" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="roleplays">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="roleplays">Roleplays</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roleplays" className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent roleplay data available</p>
                </div>
              </TabsContent>
              
              <TabsContent value="assessments" className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent assessment data available</p>
                </div>
              </TabsContent>
              
              <TabsContent value="interviews" className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No recent interview data available</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPerformance;
