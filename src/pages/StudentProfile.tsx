import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Medal, Briefcase, GraduationCap, LinkedinIcon, 
  MessageCircle, Star, Award, ArrowRight, University,
  BookOpen, TrendingUp, Zap, BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const studentProfiles = {
  "valen": {
    id: "valen",
    name: "Valen Brown",
    university: "Stetson University",
    major: "Professional Sales, Investment Finance, International Business",
    graduationYear: 2026,
    linkedin: "linkedin.com/in/valen-brown-4957542b1/",
    bio: "Triple major professional sales student with a passion for closing deals and driving business growth. Skilled in negotiation, strategic relationship building, and financial analysis. Looking to leverage my unique blend of sales expertise, financial acumen, and international business perspective to excel in a competitive sales role.",
    skills: ["Consultative Selling", "Financial Analysis", "Cross-Cultural Communication", "Negotiation", "Client Acquisition", "Sales Strategy"],
    achievements: [
      { title: "Global #1", description: "Top ranked sales professional worldwide", icon: Trophy },
      { title: "Triple Threat", description: "Excellence across three business disciplines", icon: Star },
      { title: "Perfect Score", description: "100% in Enterprise Sales Challenge", icon: Award }
    ],
    completedRoleplays: 37,
    averageScore: 99,
    topIndustries: [
      { name: "FinTech", score: 99 },
      { name: "SaaS", score: 98 },
      { name: "International Trade", score: 97 }
    ]
  },
  "user1": {
    id: "user1",
    name: "Sarah Johnson",
    university: "Stanford University",
    major: "Business Administration",
    graduationYear: 2023,
    linkedin: "linkedin.com/in/sarahjohnson",
    bio: "Results-driven business student with a passion for sales and marketing. I've completed multiple internships in SaaS sales and am looking to join a high-growth tech company after graduation.",
    skills: ["B2B Sales", "Lead Generation", "Pitch Development", "CRM Management"],
    achievements: [
      { title: "1st Place", description: "Global Sales Competition", icon: Trophy },
      { title: "SaaS Industry Leader", description: "Top 5% in SaaS sales roleplays", icon: Award },
      { title: "Perfect Score", description: "Discovery Call Challenge", icon: Star }
    ],
    completedRoleplays: 23,
    averageScore: 92,
    topIndustries: [
      { name: "SaaS", score: 95 },
      { name: "FinTech", score: 88 },
      { name: "E-commerce", score: 85 }
    ]
  },
  "user2": {
    id: "user2",
    name: "Michael Chen",
    university: "Harvard University", 
    major: "Finance",
    graduationYear: 2024,
    linkedin: "linkedin.com/in/michaelchen",
    bio: "Finance major with strong analytical skills and a growing interest in sales. I'm particularly interested in FinTech solutions and enjoy the consultative aspects of complex B2B sales cycles.",
    skills: ["Financial Analysis", "Consultative Selling", "Client Relationship Management", "Deal Structuring"],
    achievements: [
      { title: "2nd Place", description: "National Finance Competition", icon: Medal },
      { title: "FinTech Specialist", description: "Top performer in FinTech scenarios", icon: Award },
      { title: "Consistent Performer", description: "90+ scores in 15 consecutive roleplays", icon: TrendingUp }
    ],
    completedRoleplays: 18,
    averageScore: 89,
    topIndustries: [
      { name: "FinTech", score: 94 },
      { name: "Banking", score: 91 },
      { name: "Consulting", score: 87 }
    ]
  },
  "user3": {
    id: "user3",
    name: "Jessica Williams",
    university: "MIT",
    major: "Marketing",
    graduationYear: 2023,
    linkedin: "linkedin.com/in/jessicawilliams",
    bio: "Marketing major with a focus on digital strategy and analytics. I excel at understanding customer needs and crafting compelling value propositions that resonate with target audiences.",
    skills: ["Digital Marketing", "Customer Segmentation", "Value Proposition Design", "Competitive Analysis"],
    achievements: [
      { title: "Innovation Award", description: "Marketing Strategy Competition", icon: Zap },
      { title: "Top Performer", description: "Value Proposition Challenge", icon: Star },
      { title: "Most Improved", description: "34% score increase in 30 days", icon: TrendingUp }
    ],
    completedRoleplays: 31,
    averageScore: 87,
    topIndustries: [
      { name: "E-commerce", score: 92 },
      { name: "Tech", score: 90 },
      { name: "Healthcare", score: 83 }
    ]
  },
  "user4": {
    id: "user4",
    name: "Alex Rodriguez",
    university: "UC Berkeley",
    major: "Professional Sales",
    graduationYear: 2025,
    linkedin: "linkedin.com/in/alexrodriguez",
    bio: "Professional Sales major with a track record of exceeding targets. I've developed strong skills in prospecting, discovery, and closing through numerous roleplay scenarios and real-world sales competitions.",
    skills: ["Sales Prospecting", "Objection Handling", "Negotiation", "Solution Selling"],
    achievements: [
      { title: "Top Closer", description: "Highest close rate in competitive scenarios", icon: Trophy },
      { title: "Best Discovery", description: "Excellence in needs assessment", icon: Award },
      { title: "Rising Star", description: "Most promising new sales talent", icon: Star }
    ],
    completedRoleplays: 42,
    averageScore: 94,
    topIndustries: [
      { name: "SaaS", score: 96 },
      { name: "Manufacturing", score: 92 },
      { name: "Telecom", score: 90 }
    ]
  },
  "user5": {
    id: "user5",
    name: "Priya Patel",
    university: "University of Michigan",
    major: "Management",
    graduationYear: 2024,
    linkedin: "linkedin.com/in/priyapatel",
    bio: "Management student with leadership experience and a focus on sales operations. I'm skilled at organizing sales processes and helping teams exceed their targets through effective management techniques.",
    skills: ["Sales Operations", "Team Leadership", "Process Optimization", "Strategic Planning"],
    achievements: [
      { title: "Leadership Award", description: "Excellence in sales team management", icon: Award },
      { title: "Process Innovator", description: "Developed new sales methodology", icon: Zap },
      { title: "Team Builder", description: "Led highest performing virtual sales team", icon: TrendingUp }
    ],
    completedRoleplays: 16,
    averageScore: 88,
    topIndustries: [
      { name: "Retail", score: 93 },
      { name: "Consulting", score: 89 },
      { name: "Hospitality", score: 86 }
    ]
  },
  "user6": {
    id: "user6",
    name: "David Kim",
    university: "Cornell University",
    major: "Real Estate",
    graduationYear: 2023,
    linkedin: "linkedin.com/in/davidkim",
    bio: "Real Estate major with a passion for commercial property sales. I combine analytical skills with relationship building to create win-win scenarios for buyers and sellers in complex real estate transactions.",
    skills: ["Property Valuation", "Client Needs Analysis", "Contract Negotiation", "Market Research"],
    achievements: [
      { title: "Deal Maker", description: "Highest value in simulated transactions", icon: Trophy },
      { title: "Negotiation Expert", description: "Excellence in advanced negotiation", icon: Award },
      { title: "Client Champion", description: "Highest client satisfaction ratings", icon: Star }
    ],
    completedRoleplays: 19,
    averageScore: 91,
    topIndustries: [
      { name: "Commercial Real Estate", score: 95 },
      { name: "Residential Real Estate", score: 93 },
      { name: "Property Management", score: 87 }
    ]
  },
  "user7": {
    id: "user7",
    name: "Emma Wilson",
    university: "NYU",
    major: "Entrepreneurship",
    graduationYear: 2024,
    linkedin: "linkedin.com/in/emmawilson",
    bio: "Entrepreneurship major with a focus on startups and innovation. I excel at identifying market opportunities and crafting compelling pitches that drive investment and customer adoption.",
    skills: ["Pitch Development", "Market Analysis", "Product Positioning", "Growth Strategy"],
    achievements: [
      { title: "Pitch Perfect", description: "Winner, startup pitch competition", icon: Trophy },
      { title: "Innovation Leader", description: "Created top-rated sales strategy", icon: Zap },
      { title: "Growth Hacker", description: "Highest conversion metrics", icon: TrendingUp }
    ],
    completedRoleplays: 27,
    averageScore: 90,
    topIndustries: [
      { name: "Tech Startups", score: 94 },
      { name: "SaaS", score: 92 },
      { name: "Consumer Products", score: 87 }
    ]
  },
  "user8": {
    id: "user8",
    name: "James Thompson",
    university: "UCLA",
    major: "International Business",
    graduationYear: 2023,
    linkedin: "linkedin.com/in/jamesthompson",
    bio: "International Business major with experience in cross-cultural sales negotiations. I specialize in helping companies expand into new markets and adapt their sales approach to different cultural contexts.",
    skills: ["Cross-cultural Communication", "Global Market Entry", "International Negotiations", "Export Sales"],
    achievements: [
      { title: "Global Seller", description: "Excellence in international sales scenarios", icon: Award },
      { title: "Cultural Intelligence", description: "Highest scores in cross-cultural negotiations", icon: Star },
      { title: "Market Expansion", description: "Best international strategy development", icon: TrendingUp }
    ],
    completedRoleplays: 24,
    averageScore: 89,
    topIndustries: [
      { name: "Global Logistics", score: 93 },
      { name: "International Trade", score: 91 },
      { name: "Manufacturing", score: 86 }
    ]
  },
  "user9": {
    id: "user9",
    name: "Sophia Garcia",
    university: "University of Pennsylvania",
    major: "Supply Chain Management",
    graduationYear: 2024,
    linkedin: "linkedin.com/in/sophiagarcia",
    bio: "Supply Chain Management major with a focus on sales operations and logistics solutions. I excel at understanding complex business requirements and proposing solutions that optimize the entire supply chain.",
    skills: ["Solution Selling", "Logistics Optimization", "Value Chain Analysis", "ROI Calculation"],
    achievements: [
      { title: "Supply Chain Expert", description: "Top performer in logistics scenarios", icon: Award },
      { title: "Efficiency Champion", description: "Created highest-ROI solution", icon: Zap },
      { title: "Complex Sale Specialist", description: "Excellence in multi-stakeholder deals", icon: Star }
    ],
    completedRoleplays: 21,
    averageScore: 86,
    topIndustries: [
      { name: "Logistics", score: 92 },
      { name: "Manufacturing", score: 88 },
      { name: "Retail", score: 83 }
    ]
  },
  "user10": {
    id: "user10",
    name: "Robert Choate",
    university: "University of Texas",
    major: "Marketing",
    graduationYear: 2023,
    linkedin: "linkedin.com/in/robertchoate",
    bio: "Marketing major with a passion for sales enablement and customer acquisition. I specialize in bridging the gap between marketing and sales to create cohesive strategies that drive revenue growth.",
    skills: ["Sales Enablement", "Customer Journey Mapping", "Marketing Automation", "Lead Qualification"],
    achievements: [
      { title: "Sales & Marketing Integration", description: "Excellence in aligned strategies", icon: Award },
      { title: "Lead Generation Expert", description: "Highest quality lead scoring system", icon: Star },
      { title: "Content Strategist", description: "Most effective sales enablement content", icon: BookOpen }
    ],
    completedRoleplays: 10,
    averageScore: 88,
    topIndustries: [
      { name: "SaaS", score: 91 },
      { name: "Digital Marketing", score: 89 },
      { name: "Media & Entertainment", score: 84 }
    ]
  }
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (id && studentProfiles[id as keyof typeof studentProfiles]) {
        setStudent(studentProfiles[id as keyof typeof studentProfiles]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message sent! 🚀",
      description: `Your message has been sent to ${student?.name}.`,
      variant: "default",
    });
    
    if (student?.id) {
      navigate(`/messages?userId=${student.id}`);
    }
    
    setMessage("");
  };
  
  const handleMessageButtonClick = () => {
    if (student?.id) {
      navigate(`/messages?userId=${student.id}`);
    }
  };
  
  const handleAwardClick = (achievement: any) => {
    toast({
      title: `${achievement.title} 🏆`,
      description: achievement.description,
      variant: "default",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-6 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-primary">Loading profile...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-6 md:p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground">We couldn't find the student profile you're looking for.</p>
            <Button className="mt-4" asChild>
              <Link to="/leaderboard">Back to Leaderboard</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
            <p className="text-muted-foreground mt-1">
              View detailed information about this sales professional
            </p>
          </div>
          <Button asChild>
            <Link to="/leaderboard">
              Back to Leaderboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary hover:bg-primary/90 transition-all transform hover:scale-105">
                  {student.averageScore}% Score
                </Badge>
              </div>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
                  <AvatarImage src={""} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-primary/70 text-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center text-2xl">{student.name}</CardTitle>
                <CardDescription className="text-center flex items-center gap-1 mt-1">
                  <University className="h-3.5 w-3.5" />
                  {student.university}
                </CardDescription>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {student.major} • Class of {student.graduationYear}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3 transform transition-all hover:scale-105 hover:bg-muted">
                    <div className="text-2xl font-bold text-primary">{student.completedRoleplays}</div>
                    <div className="text-xs text-muted-foreground">Completed Roleplays</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 transform transition-all hover:scale-105 hover:bg-muted">
                    <div className="text-2xl font-bold text-primary">{student.topIndustries.length}</div>
                    <div className="text-xs text-muted-foreground">Industries</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-secondary/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Achievements</h3>
                  <div className="space-y-2">
                    {student.achievements.map((achievement: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleAwardClick(achievement)}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <achievement.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-col gap-3">
                  <a 
                    href={`https://${student.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full group">
                      <LinkedinIcon className="mr-2 h-4 w-4 text-[#0A66C2]" />
                      LinkedIn Profile
                      <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                  <Button 
                    className="w-full pulse-animation"
                    onClick={handleMessageButtonClick}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{student.bio}</p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="performance">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="performance" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="industries" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Industry Expertise
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance Over Time</CardTitle>
                    <CardDescription>
                      Score progression across {student.completedRoleplays} completed roleplays
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Performance chart visualization</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{student.averageScore}%</div>
                        <div className="text-xs text-muted-foreground">Average Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">93%</div>
                        <div className="text-xs text-muted-foreground">Highest Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">+12%</div>
                        <div className="text-xs text-muted-foreground">Improvement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">24</div>
                        <div className="text-xs text-muted-foreground">Global Rank</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Skill Breakdown</CardTitle>
                    <CardDescription>
                      Performance by sales skill category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Discovery</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Objection Handling</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Value Proposition</span>
                          <span className="font-medium">91%</span>
                        </div>
                        <Progress value={91} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Closing</span>
                          <span className="font-medium">82%</span>
                        </div>
                        <Progress value={82} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Relationship Building</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-2 bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="industries" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Industry Expertise</CardTitle>
                    <CardDescription>
                      Performance across different industries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {student.topIndustries.map((industry: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>{industry.name}</span>
                            <span className="font-medium">{industry.score}%</span>
                          </div>
                          <Progress value={industry.score} className="h-2 bg-muted" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {student.topIndustries.map((industry: any, index: number) => (
                        <Card key={index} className="bg-muted/30 hover:bg-muted/50 transition-colors">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{industry.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-sm text-muted-foreground">
                              <div className="flex justify-between items-center">
                                <span>Completed Scenarios:</span>
                                <span className="font-medium">{Math.floor(student.completedRoleplays / student.topIndustries.length)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Average Score:</span>
                                <span className="font-medium">{industry.score}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Industry Rank:</span>
                                <span className="font-medium">#{index + 3}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Roleplays</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { 
                          title: "Enterprise SaaS Solution Sale", 
                          industry: "SaaS", 
                          date: "3 days ago",
                          score: 95
                        },
                        { 
                          title: "Financial Services Consultation", 
                          industry: student.topIndustries[0]?.name || "FinTech", 
                          date: "1 week ago",
                          score: 92
                        },
                        { 
                          title: "B2B Product Demonstration", 
                          industry: student.topIndustries[1]?.name || "Tech", 
                          date: "2 weeks ago",
                          score: 88
                        }
                      ].map((roleplay, index) => (
                        <div key={index} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{roleplay.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {roleplay.industry} • {roleplay.date}
                              </div>
                            </div>
                            <Badge className="bg-primary/90">{roleplay.score}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="#">
                        View All Roleplays 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
