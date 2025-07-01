import { useEffect, useState } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, PieChartIcon, Users, Calendar, TrendingUp, Search, MessageSquare, LineChart } from "lucide-react";
import { MessageInsights } from "@/components/analytics/MessageInsights";
import { EngagementHeatmap } from "@/components/analytics/EngagementHeatmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesIndustryReports } from "@/hooks/useSalesIndustryReports";
import { SalesIndustryReportCard } from "@/components/analytics/SalesIndustryReport";

const RecruiterAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  
  const { 
    reports: industryReports, 
    isLoading: isLoadingReports 
  } = useSalesIndustryReports({ 
    industry: selectedIndustry !== "all" ? selectedIndustry : undefined 
  });

  // Handle industry change
  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
  };

  // Mock data for analytics
  const interviewData = [
    { name: "Jan", count: 4 },
    { name: "Feb", count: 7 },
    { name: "Mar", count: 5 },
    { name: "Apr", count: 9 },
    { name: "May", count: 12 },
    { name: "Jun", count: 8 },
  ];

  const candidateSourceData = [
    { name: "University Referrals", value: 45 },
    { name: "Direct Applications", value: 30 },
    { name: "Talent Pool Search", value: 15 },
    { name: "Career Events", value: 10 },
  ];

  const skillsDistributionData = [
    { name: "Technical Sales", count: 18 },
    { name: "Customer Success", count: 14 },
    { name: "Account Management", count: 12 },
    { name: "Cold Calling", count: 11 },
    { name: "Negotiation", count: 10 },
    { name: "Product Knowledge", count: 8 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

  // Mock candidate data for AI Search
  const candidateSearchResults = [
    {
      id: "c1",
      name: "Morgan Chen",
      university: "Berkeley",
      match_score: 94,
      top_skills: ["Sales Demos", "Relationship Building", "Technical Knowledge"]
    },
    {
      id: "c2",
      name: "Jamie Rivera",
      university: "Stanford",
      match_score: 89,
      top_skills: ["Objection Handling", "Closing Techniques", "Value Proposition"]
    },
    {
      id: "c3",
      name: "Taylor Wilson",
      university: "UCLA",
      match_score: 87,
      top_skills: ["Active Listening", "Needs Analysis", "Solution Selling"]
    }
  ];

  // Mock function for search
  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Recruiting Analytics</h1>
          <p className="text-muted-foreground">
            Track your recruiting metrics and candidate engagement with AI-powered insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="overview">
              <BarChart2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="candidates">
              <Users className="h-4 w-4 mr-2" />
              AI Matching
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messaging
            </TabsTrigger>
            <TabsTrigger value="industry">
              <LineChart className="h-4 w-4 mr-2" />
              Industry Trends
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interviews Conducted</CardTitle>
                  <CardDescription>Monthly breakdown of interviews</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={interviewData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>Where your candidates come from</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={candidateSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {candidateSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
                <CardDescription>Top skills among candidates</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <EngagementHeatmap />
          </TabsContent>
          
          <TabsContent value="candidates" className="space-y-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Candidate Matching</CardTitle>
                <CardDescription>Find the best candidates using AI predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search by role or skills (e.g., 'SDR' or 'objection handling')" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="whitespace-nowrap"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    AI Search
                  </Button>
                </div>

                {searchTerm ? (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-medium">AI found 3 candidates matching "{searchTerm}"</h3>
                    
                    <div className="space-y-3">
                      {candidateSearchResults.map((candidate) => (
                        <div key={candidate.id} className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{candidate.name}</h4>
                              <p className="text-sm text-muted-foreground">{candidate.university}</p>
                            </div>
                            <div className="bg-green-100 text-green-800 font-medium rounded-full px-3 py-1 text-sm">
                              {candidate.match_score}% Match
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">Top skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {candidate.top_skills.map((skill, idx) => (
                                <span key={idx} className="bg-muted rounded-full px-3 py-1 text-xs">{skill}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm">View Profile</Button>
                            <Button size="sm">Contact</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Use AI Search to find best-matched candidates based on skills or role
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <MessageInsights />
          </TabsContent>
          
          <TabsContent value="industry" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesIndustryReportCard industry="SaaS" />
              <SalesIndustryReportCard industry="FinTech" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <SalesIndustryReportCard industry="Healthcare" />
              <SalesIndustryReportCard industry="Retail" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterAnalytics;
