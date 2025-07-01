
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import StudentOverview from "@/components/recruiter/StudentOverview";
import StudentPerformance from "@/components/recruiter/StudentPerformance";
import ResumeScoreCard from "@/components/recruiter/ResumeScoreCard";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, Mail, Calendar } from "lucide-react";

interface StudentProfileTabsProps {
  studentId: string;
  studentProfile: any;
}

const StudentProfileTabs: React.FC<StudentProfileTabsProps> = ({ 
  studentId,
  studentProfile 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <StudentOverview 
              studentProfile={studentProfile} 
            />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6">
            <StudentPerformance 
              studentId={studentId}
              studentProfile={studentProfile}
            />
          </TabsContent>
          
          <TabsContent value="resume" className="mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ResumeScoreCard 
                  studentId={studentId} 
                />
              </div>
              <div className="xl:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg mb-2">Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <div>
                            <Mail className="mr-2 h-4 w-4" />
                            Message Candidate
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <div>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <div>
                            <Bookmark className="mr-2 h-4 w-4" />
                            Save to Talent Pool
                          </div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <div>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Profile
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfileTabs;
