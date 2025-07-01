
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Play, Search, BookOpen, Trophy, Users, BarChart3, Target, Clock, BookMarked, Gift, Award, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sponsoredChallenges, setSponsoredChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  useEffect(() => {
    const fetchSponsoredChallenges = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("sponsored_challenges")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;

        console.log("Fetched challenges:", data);
        setSponsoredChallenges(data || []);
      } catch (error) {
        console.error("Error fetching sponsored challenges:", error);
        toast({
          title: "Error loading challenges",
          description: "Could not load sponsored challenges. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsoredChallenges();
  }, [toast]);

  const filteredChallenges = sponsoredChallenges.filter(challenge => {
    const matchesSearch = searchFilter === "" ||
      challenge.company_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      challenge.product_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      challenge.scenario_title.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesIndustry = industryFilter === "all" ||
      challenge.industry.toLowerCase() === industryFilter.toLowerCase();

    return matchesSearch && matchesIndustry;
  });

  const startChallenge = (id: string, data: any) => {
    console.log("Navigating with data:", data);
    localStorage.setItem("challengeData", JSON.stringify(data));
    navigate(`/challenge/${id}`, { state: data });
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
          <p className="text-muted-foreground mt-2">
            Compete against top university sales talent
          </p>
        </div>

        <div className="space-y-6">
          <section className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-90"></div>
            <div className="relative p-8 md:p-10 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Master Sales Techniques</h2>
                  <p className="text-lg opacity-90">
                    Personalized AI-powered practice sessions with expert feedback.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      size="lg"
                      variant="default"
                      className="bg-white text-purple-700 hover:bg-white/90"
                      onClick={() => navigate('/roleplay/new')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Practicing
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={<Trophy />} title="Compete" description="Join competitions" />
                  <StatCard icon={<BarChart3 />} title="Improve" description="Track progress" />
                  <StatCard icon={<Users />} title="Connect" description="Network" />
                  <StatCard icon={<Target />} title="Focus" description="Skill development" />
                </div>
              </div>
            </div>
          </section>

          <Tabs defaultValue="sponsored" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <TabsList>
                <TabsTrigger value="sponsored">
                  <Gift className="mr-2 h-4 w-4" />
                  Sponsored Challenges
                </TabsTrigger>
                <TabsTrigger value="features">
                  <BookMarked className="mr-2 h-4 w-4" />
                  Features
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="sponsored" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-10">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredChallenges.length > 0 ? (
                  filteredChallenges.map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{challenge.scenario_title}</CardTitle>
                            <CardDescription className="text-sm mt-1 font-medium text-primary/80">
                              {challenge.company_name} • {challenge.product_name}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {challenge.scenario_description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-background">
                            <Target className="mr-1 h-3 w-3" />
                            {challenge.industry}
                          </Badge>
                          <Badge variant="outline" className="bg-background">
                            <BarChart3 className="mr-1 h-3 w-3" />
                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="bg-background">
                            <Clock className="mr-1 h-3 w-3" />
                            10-15 min
                          </Badge>
                        </div>
                        {challenge.prize_description && (
                          <div className="mt-2 py-2 px-3 bg-green-500/10 rounded-md border border-green-500/20 flex items-center justify-between">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-green-600 mr-1.5" />
                              <span className="text-sm font-semibold text-green-700">{challenge.prize_description}</span>
                            </div>
                            <Award className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          onClick={() =>
                            startChallenge(challenge.id, challenge)
                          }
                          className="w-full"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Challenge
                        </Button>

                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No sponsored challenges found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No challenges match your current filters. Try adjusting your search criteria or check back later.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard
                  title="Practice Sales Skills"
                  description="Practice with our AI assistant that simulates real prospects. Get instant feedback on your sales calls."
                  icon={<Play className="h-8 w-8 text-blue-500" />}
                  action="Start Practice"
                  onClick={() => navigate('/roleplay/new')}
                  color="blue"
                />

                <FeatureCard
                  title="Leaderboard"
                  description="Compete against other students in sales competitions and climb the rankings."
                  icon={<Trophy className="h-8 w-8 text-yellow-500" />}
                  action="View Rankings"
                  onClick={() => navigate('/leaderboard')}
                  color="yellow"
                />

                <FeatureCard
                  title="Resources"
                  description="Access our curated library of sales training materials from industry experts."
                  icon={<BookOpen className="h-8 w-8 text-green-500" />}
                  action="Browse Resources"
                  onClick={() => navigate('/resources')}
                  color="green"
                />

                <FeatureCard
                  title="Community"
                  description="Connect with fellow sales students and professionals to build your network."
                  icon={<Users className="h-8 w-8 text-purple-500" />}
                  action="Join Community"
                  onClick={() => navigate('/community')}
                  color="purple"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
    <div className="text-white/90 mb-2">{icon}</div>
    <h3 className="font-medium text-white">{title}</h3>
    <p className="text-sm text-white/80">{description}</p>
  </div>
);

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
  color: string;
}

const FeatureCard = ({ title, description, icon, action, onClick, color }: FeatureCardProps) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-600/5",
    yellow: "from-yellow-500/10 to-amber-600/5",
    green: "from-green-500/10 to-emerald-600/5",
    purple: "from-purple-500/10 to-violet-600/5",
    pink: "from-pink-500/10 to-rose-600/5",
    orange: "from-orange-500/10 to-amber-600/5",
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <div className={`p-6 bg-gradient-to-r ${colorMap[color]}`}>
        <div className="flex justify-between">
          <div>
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-white mb-4">
              {icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={onClick} variant="outline" className="w-full justify-center">
            {action}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Explore;
