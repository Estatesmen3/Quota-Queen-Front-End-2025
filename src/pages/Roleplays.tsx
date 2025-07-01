
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Briefcase, BarChart, Clock, Search, FilterX } from "lucide-react";

// Define the roleplay template type
interface RoleplayTemplate {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: string;
  duration: string;
  popular?: boolean;
  new?: boolean;
}

const Roleplays = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [roleplayTemplates, setRoleplayTemplates] = useState<RoleplayTemplate[]>([]);

  useEffect(() => {
    // In a real app, we would fetch templates from the database
    // For now, let's use mock data
    const mockTemplates: RoleplayTemplate[] = [
      {
        id: "cold-call-saas",
        title: "Cold Call - SaaS Product",
        description: "Practice your cold calling skills by introducing a new SaaS product to a potential client.",
        industry: "saas",
        difficulty: "beginner",
        duration: "5-10 min",
        popular: true
      },
      {
        id: "discovery-fintech",
        title: "Discovery Call - FinTech Solution",
        description: "Run a discovery call to understand pain points and qualify a lead for a financial technology solution.",
        industry: "fintech",
        difficulty: "intermediate",
        duration: "10-15 min",
        new: true
      },
      {
        id: "objection-handling",
        title: "Objection Handling - Price Concerns",
        description: "Practice overcoming pricing objections from a reluctant decision-maker.",
        industry: "saas",
        difficulty: "intermediate",
        duration: "8-12 min",
        popular: true
      },
      {
        id: "demo-healthcare",
        title: "Product Demo - Healthcare Software",
        description: "Give a compelling product demonstration to a healthcare provider considering your solution.",
        industry: "healthcare",
        difficulty: "advanced",
        duration: "15-20 min"
      },
      {
        id: "closing-enterprise",
        title: "Closing Techniques - Enterprise Deal",
        description: "Practice various closing strategies to secure a large enterprise contract.",
        industry: "enterprise",
        difficulty: "advanced",
        duration: "10-15 min",
        popular: true
      },
      {
        id: "follow-up-ecommerce",
        title: "Follow-up Call - Ecommerce Platform",
        description: "Make an effective follow-up call to a prospect who previously showed interest in your ecommerce solution.",
        industry: "ecommerce",
        difficulty: "beginner",
        duration: "5-10 min"
      },
      {
        id: "upsell-existing",
        title: "Upselling - Existing Customer",
        description: "Practice upselling additional features to an existing customer who is already using your basic package.",
        industry: "saas",
        difficulty: "intermediate",
        duration: "10-15 min",
        new: true
      },
      {
        id: "negotiation-marketing",
        title: "Negotiation - Marketing Agency",
        description: "Navigate a complex negotiation with a marketing agency client who wants custom pricing.",
        industry: "marketing",
        difficulty: "advanced",
        duration: "15-20 min"
      }
    ];

    setRoleplayTemplates(mockTemplates);
  }, []);

  // Filter templates based on search and filters
  const filteredTemplates = roleplayTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "all" || template.industry === industryFilter;
    const matchesDifficulty = difficultyFilter === "all" || template.difficulty === difficultyFilter;
    
    return matchesSearch && matchesIndustry && matchesDifficulty;
  });

  const handleStartRoleplay = (templateId: string) => {
    // In a real app, we would create a new roleplay session
    // For now, let's navigate to the new roleplay page with a template parameter
    navigate(`/roleplay/new?template=${templateId}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setDifficultyFilter("all");
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Roleplays</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our library of sales scenarios or create your own
          </p>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Roleplays</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="my">My Roleplays</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roleplays..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || industryFilter !== "all" || difficultyFilter !== "all") && (
                  <Button variant="outline" onClick={clearFilters} size="icon">
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{template.title}</CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                          {template.popular && <Badge className="bg-orange-500">Popular</Badge>}
                          {template.new && <Badge className="bg-green-500">New</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mt-2 mb-4">
                          <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}
                          </span>
                          <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                            <BarChart className="h-3 w-3 mr-1" />
                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                          </span>
                          <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration}
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => handleStartRoleplay(template.id)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Roleplay
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No roleplays found</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.filter(t => t.popular).map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    {/* Same card content as above */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                        {template.popular && <Badge className="bg-orange-500">Popular</Badge>}
                        {template.new && <Badge className="bg-green-500">New</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}
                        </span>
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <BarChart className="h-3 w-3 mr-1" />
                          {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                        </span>
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.duration}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartRoleplay(template.id)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Roleplay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.filter(t => t.new).map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    {/* Same card content as above */}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                        {template.popular && <Badge className="bg-orange-500">Popular</Badge>}
                        {template.new && <Badge className="bg-green-500">New</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}
                        </span>
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <BarChart className="h-3 w-3 mr-1" />
                          {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                        </span>
                        <span className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.duration}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartRoleplay(template.id)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Roleplay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="my" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <PlayCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No custom roleplays yet</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  You haven't created any custom roleplay scenarios yet.
                </p>
                <Button onClick={() => navigate("/roleplay/new")}>
                  Create a Custom Roleplay
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roleplays;
