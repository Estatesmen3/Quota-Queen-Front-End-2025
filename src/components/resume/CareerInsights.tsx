
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  LineChart,
  BarChart,
  DollarSign,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CareerInsights() {
  const [region, setRegion] = useState("national");
  
  // Mock career insight data for students
  const careerInsights = {
    topSkills: [
      { name: "Solution Selling", growth: 24 },
      { name: "CRM Expertise", growth: 18 },
      { name: "Digital Prospecting", growth: 32 },
      { name: "Sales Analytics", growth: 27 },
      { name: "Consultative Selling", growth: 15 }
    ],
    salaryTrends: {
      sdr: { entry: "55K-70K", mid: "70K-85K", senior: "85K-100K" },
      ae: { entry: "70K-90K", mid: "90K-120K", senior: "120K-160K" },
      manager: { entry: "100K-130K", mid: "130K-160K", senior: "160K-200K" }
    },
    careerPaths: [
      { role: "SDR/BDR", duration: "1-2 years", nextRole: "Account Executive" },
      { role: "Account Executive", duration: "2-4 years", nextRole: "Senior AE / Team Lead" },
      { role: "Team Lead", duration: "1-3 years", nextRole: "Sales Manager" },
      { role: "Sales Manager", duration: "3-5 years", nextRole: "Director of Sales" }
    ],
    courses: [
      { title: "Cold Calling Mastery", level: "Beginner", category: "Prospecting" },
      { title: "Objection Handling", level: "Intermediate", category: "Closing" },
      { title: "Enterprise Sales Strategies", level: "Advanced", category: "Enterprise" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Career Insights</h2>
        <Tabs value={region} onValueChange={setRegion} className="w-auto">
          <TabsList>
            <TabsTrigger value="national">National</TabsTrigger>
            <TabsTrigger value="west">West</TabsTrigger>
            <TabsTrigger value="midwest">Midwest</TabsTrigger>
            <TabsTrigger value="northeast">Northeast</TabsTrigger>
            <TabsTrigger value="south">South</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              In-Demand Sales Skills
            </CardTitle>
            <CardDescription>Skills with the highest growth in job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerInsights.topSkills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span className="font-medium">+{skill.growth}% YoY</span>
                  </div>
                  <Progress value={skill.growth * 3} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Career Progression Path
            </CardTitle>
            <CardDescription>Typical sales career evolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-muted pt-2">
              {careerInsights.careerPaths.map((path, i) => (
                <div key={i} className="mb-8 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[25px] top-1.5"></div>
                  <h3 className="font-medium">{path.role}</h3>
                  <p className="text-sm text-muted-foreground">Typical Duration: {path.duration}</p>
                  <p className="text-sm mt-1">Next Step: {path.nextRole}</p>
                  {i < careerInsights.careerPaths.length - 1 && (
                    <div className="absolute h-full border-l border-dashed border-muted -left-[25px] top-4 z-[-1]"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Salary Expectations
            </CardTitle>
            <CardDescription>Current salary ranges by role and experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium border-b pb-2 mb-2">
                <div>Role</div>
                <div>Entry Level</div>
                <div>Mid-Level</div>
                <div>Senior</div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div className="font-medium">SDR/BDR</div>
                <div>{careerInsights.salaryTrends.sdr.entry}</div>
                <div>{careerInsights.salaryTrends.sdr.mid}</div>
                <div>{careerInsights.salaryTrends.sdr.senior}</div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div className="font-medium">Account Executive</div>
                <div>{careerInsights.salaryTrends.ae.entry}</div>
                <div>{careerInsights.salaryTrends.ae.mid}</div>
                <div>{careerInsights.salaryTrends.ae.senior}</div>
              </div>
              <div className="grid grid-cols-4 text-sm">
                <div className="font-medium">Sales Manager</div>
                <div>{careerInsights.salaryTrends.manager.entry}</div>
                <div>{careerInsights.salaryTrends.manager.mid}</div>
                <div>{careerInsights.salaryTrends.manager.senior}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recommended Training
            </CardTitle>
            <CardDescription>Courses to help you develop in-demand skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerInsights.courses.map((course, i) => (
                <div key={i} className="border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/25 transition-all duration-200">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Enroll</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
