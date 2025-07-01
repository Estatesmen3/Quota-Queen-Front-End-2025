
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Filter, 
  Target, 
  Users, 
  TrendingUp, 
  Zap, 
  Award,
  Briefcase,
  Search,
  GraduationCap,
  BarChart3,
  LineChart,
  PieChart,
  MessageSquare,
  MessagesSquare,
  CalendarDays,
  UserPlus,
  Video,
  Trophy,
  Globe
} from "lucide-react";

const ForRecruiters = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 dopamine-gradient-1">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Discover Elite Sales Talent
              </h1>
              <p className="text-lg text-white/90">
                Identify high-potential candidates based on real performance data, not just resumes. 
                Engage directly with students through our platform and find your next sales champions.
              </p>
              <div className="mt-10">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 glow-on-hover" asChild>
                  <Link to="/talent-pool">Access Talent Pool</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-dopamine-purple">Why Quota Queen for Recruiters?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform gives you unprecedented insights into sales talent, helping you find 
                candidates who can actually close deals, not just talk about it.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="card-hover-effect border-dopamine-pink/20 shadow-[0_10px_25px_-5px_rgba(236,73,153,0.15)] border-2">
                <CardHeader>
                  <div className="bg-dopamine-pink/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Target className="text-dopamine-pink h-6 w-6" />
                  </div>
                  <CardTitle className="text-dopamine-pink">Data-Driven Recruiting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See candidates' actual sales performance scores, not just what they claim on a resume.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover-effect border-dopamine-orange/20 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)] border-2">
                <CardHeader>
                  <div className="bg-dopamine-orange/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Filter className="text-dopamine-orange h-6 w-6" />
                  </div>
                  <CardTitle className="text-dopamine-orange">Advanced Filtering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Filter by performance metrics, industry specialization, graduation date, and more.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover-effect border-dopamine-blue/20 shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)] border-2">
                <CardHeader>
                  <div className="bg-dopamine-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Zap className="text-dopamine-blue h-6 w-6" />
                  </div>
                  <CardTitle className="text-dopamine-blue">Direct Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect directly with promising candidates through our integrated messaging system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-dopamine-orange">How Quota Queen Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform's unique approach connects you with top sales talent based on real performance metrics.
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-dopamine-pink via-dopamine-purple to-dopamine-blue -translate-x-1/2"></div>
              
              <div className="space-y-16">
                <div className="relative grid md:grid-cols-2 items-center gap-8">
                  <div className="md:text-right md:pr-12">
                    <h3 className="text-xl font-bold mb-2 text-dopamine-blue">Create Your Recruiter Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and set up your company profile, including the types of sales roles you're looking to fill.
                    </p>
                  </div>
                  <div className="md:pl-12">
                    <Card className="dopamine-gradient-3 text-white border-none shadow-lg border-2 border-dopamine-blue/30">
                      <CardContent className="pt-6">
                        <Building className="h-12 w-12 mb-3" />
                        <p className="font-medium">
                          Create your company presence on our platform to start connecting with sales talent.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="relative grid md:grid-cols-2 items-center gap-8">
                  <div className="md:order-last md:text-left md:pl-12">
                    <h3 className="text-xl font-bold mb-2 text-dopamine-pink">Browse Talented Candidates</h3>
                    <p className="text-muted-foreground">
                      Explore our talent pool with detailed performance analytics across various sales scenarios and industries.
                    </p>
                  </div>
                  <div className="md:order-first md:pr-12">
                    <Card className="dopamine-gradient-2 text-white border-none shadow-lg border-2 border-dopamine-pink/30">
                      <CardContent className="pt-6">
                        <Search className="h-12 w-12 mb-3" />
                        <p className="font-medium">
                          Discover candidates with proven performance in real-world sales situations.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="relative grid md:grid-cols-2 items-center gap-8">
                  <div className="md:text-right md:pr-12">
                    <h3 className="text-xl font-bold mb-2 text-dopamine-purple">Engage and Recruit</h3>
                    <p className="text-muted-foreground">
                      Connect directly with promising candidates, request custom role-plays, and streamline your hiring process.
                    </p>
                  </div>
                  <div className="md:pl-12">
                    <Card className="dopamine-gradient-1 text-white border-none shadow-lg border-2 border-dopamine-purple/30">
                      <CardContent className="pt-6">
                        <Zap className="h-12 w-12 mb-3" />
                        <p className="font-medium">
                          Contact top performers directly and make data-driven hiring decisions.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Tabs */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-dopamine-blue">Powerful Recruiting Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tools designed specifically for sales recruiters to find and evaluate top talent.
              </p>
            </div>

            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
                <TabsTrigger value="analytics" className="text-center">Analytics</TabsTrigger>
                <TabsTrigger value="engagement" className="text-center">Engagement</TabsTrigger>
                <TabsTrigger value="events" className="text-center">Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-dopamine-purple">Performance Analytics</h3>
                    <p className="text-muted-foreground mb-6">
                      Get deep insights into candidate performance across different sales scenarios, 
                      industries, and skill sets.
                    </p>
                    <ul className="space-y-3">
                      {[
                        {icon: TrendingUp, text: "Compare candidates across multiple performance dimensions"},
                        {icon: Target, text: "Identify specialists in your target industries"},
                        {icon: Filter, text: "Filter by specific sales skills and competencies"}
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex h-6 w-6 mr-2 text-dopamine-pink">
                            <item.icon className="h-6 w-6" />
                          </span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted p-4 md:p-6 rounded-lg border-2 border-dopamine-purple/20 shadow-[0_5px_15px_-5px_rgba(139,92,246,0.25)]">
                    {/* Real dashboard-like analytics view */}
                    <div className="bg-background rounded-lg overflow-hidden border border-border">
                      {/* Header with tabs similar to dashboard */}
                      <div className="bg-muted/50 p-3 border-b border-border flex items-center justify-between">
                        <h4 className="font-medium text-sm">Talent Pool Analytics</h4>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            This Month
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      {/* Stats overview similar to StatsOverview component */}
                      <div className="grid grid-cols-3 gap-3 p-3">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Top Performers</span>
                            <Users className="h-3.5 w-3.5 text-dopamine-purple" />
                          </div>
                          <p className="text-xl font-semibold">38</p>
                          <div className="text-xs text-dopamine-green flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> 12% increase
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Avg Rating</span>
                            <Award className="h-3.5 w-3.5 text-dopamine-pink" />
                          </div>
                          <p className="text-xl font-semibold">87%</p>
                          <div className="text-xs text-dopamine-green flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> 4% increase
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">New Talent</span>
                            <UserPlus className="h-3.5 w-3.5 text-dopamine-blue" />
                          </div>
                          <p className="text-xl font-semibold">26</p>
                          <div className="text-xs text-dopamine-green flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> 8% increase
                          </div>
                        </div>
                      </div>
                      
                      {/* Chart/Graph visualization */}
                      <div className="p-3 pt-0">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium">Performance by Skill</span>
                            <div className="flex space-x-2">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-dopamine-purple"></div>
                                <span className="text-xs text-muted-foreground">Negotiation</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-dopamine-pink"></div>
                                <span className="text-xs text-muted-foreground">Objection Handling</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Simulated chart bars */}
                          <div className="h-24 flex items-end space-x-2">
                            {[65, 72, 58, 80, 74, 85, 78, 92, 68, 75].map((height, i) => (
                              <div key={i} className="flex-grow flex flex-col items-center">
                                <div className="w-full bg-muted rounded-sm overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-t from-dopamine-purple to-dopamine-pink w-full"
                                    style={{ height: `${height * 0.24}px` }}
                                  ></div>
                                </div>
                                <span className="text-[9px] text-muted-foreground mt-1">T{i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick filters */}
                      <div className="border-t border-border p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">
                            SaaS Experience
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">
                            +80% Close Rate
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">
                            Tech Background
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-full">
                            + Add Filter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-dopamine-orange">Candidate Engagement</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect directly with promising candidates and evaluate their fit for your specific roles.
                    </p>
                    <ul className="space-y-3">
                      {[
                        {icon: Users, text: "Direct messaging with candidates"},
                        {icon: Briefcase, text: "Custom role-play scenarios for your open positions"},
                        {icon: Award, text: "Create sponsored challenges to identify top talent"}
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex h-6 w-6 mr-2 text-dopamine-orange">
                            <item.icon className="h-6 w-6" />
                          </span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted p-4 md:p-6 rounded-lg border-2 border-dopamine-orange/20 shadow-[0_5px_15px_-5px_rgba(249,115,22,0.25)]">
                    {/* Real messages interface based on actual components */}
                    <div className="bg-background rounded-lg overflow-hidden border border-border h-[400px] flex flex-col">
                      {/* Header with candidate name */}
                      <div className="bg-muted/50 p-3 border-b border-border flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-dopamine-orange/20 flex items-center justify-center text-xs font-medium text-dopamine-orange mr-3">
                            AM
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Alex Morgan</h4>
                            <p className="text-xs text-muted-foreground">Stanford University • SaaS Sales</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Messages area */}
                      <div className="flex-grow p-3 space-y-3 overflow-auto">
                        <div className="flex items-end space-x-2 max-w-[80%]">
                          <div className="w-6 h-6 rounded-full bg-dopamine-orange/20 flex-shrink-0"></div>
                          <div className="bg-muted rounded-lg rounded-bl-none p-3">
                            <p className="text-sm">Hi there! Thank you for reaching out. I'm excited to learn more about the SDR position at TechCorp.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-end space-x-2 max-w-[80%] ml-auto">
                          <div className="bg-dopamine-orange/10 text-dopamine-orange/90 rounded-lg rounded-br-none p-3">
                            <p className="text-sm">Hello Alex! We were impressed by your performance in the SaaS challenge. Your objection handling skills were particularly strong.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-end space-x-2 max-w-[80%]">
                          <div className="w-6 h-6 rounded-full bg-dopamine-orange/20 flex-shrink-0"></div>
                          <div className="bg-muted rounded-lg rounded-bl-none p-3">
                            <p className="text-sm">Thank you! I've been focusing on improving my objection handling techniques. I'd love to know more about what you're looking for in candidates.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-end space-x-2 max-w-[80%] ml-auto">
                          <div className="bg-dopamine-orange/10 text-dopamine-orange/90 rounded-lg rounded-br-none p-3">
                            <p className="text-sm">We're looking for SDRs who can handle complex objections in the enterprise SaaS space. Would you be available for a custom role-play assessment this week?</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Message input */}
                      <div className="border-t border-border p-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-grow bg-muted/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-dopamine-orange/50"
                          />
                          <Button size="icon" className="h-9 w-9 bg-dopamine-orange hover:bg-dopamine-orange/90">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-dopamine-green">Virtual Recruiting Events</h3>
                    <p className="text-muted-foreground mb-6">
                      Host virtual recruiting events, competitions, and informational sessions to attract top sales talent.
                    </p>
                    <ul className="space-y-3">
                      {[
                        {icon: GraduationCap, text: "Virtual career fairs for multiple universities"},
                        {icon: Zap, text: "Sales competitions with real-time performance tracking"},
                        {icon: Building, text: "Company information sessions and Q&A opportunities"}
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex h-6 w-6 mr-2 text-dopamine-green">
                            <item.icon className="h-6 w-6" />
                          </span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted p-4 md:p-6 rounded-lg border-2 border-dopamine-green/20 shadow-[0_5px_15px_-5px_rgba(34,197,94,0.25)]">
                    {/* Calendar/Events dashboard interface */}
                    <div className="bg-background rounded-lg overflow-hidden border border-border flex flex-col">
                      {/* Calendar header */}
                      <div className="bg-muted/50 p-3 border-b border-border flex items-center justify-between">
                        <h4 className="font-medium text-sm">Recruiting Calendar</h4>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                            June 2024
                          </Button>
                          <Button variant="default" size="sm" className="h-8 text-xs bg-dopamine-green hover:bg-dopamine-green/90">
                            + New Event
                          </Button>
                        </div>
                      </div>
                      
                      {/* Events grid */}
                      <div className="p-3 space-y-3">
                        {/* Active challenge */}
                        <div className="bg-dopamine-green/10 border border-dopamine-green/20 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Trophy className="h-5 w-5 text-dopamine-green mr-2" />
                              <div>
                                <h5 className="font-medium text-sm">Enterprise SaaS Challenge</h5>
                                <p className="text-xs text-muted-foreground">June 10-17 • 124 participants</p>
                              </div>
                            </div>
                            <div className="bg-dopamine-green/20 text-dopamine-green text-xs font-medium px-2 py-0.5 rounded-full">
                              Active
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-dopamine-green/10 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Top School</p>
                              <p className="font-medium">Stanford</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Avg. Score</p>
                              <p className="font-medium">86%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Top Skills</p>
                              <p className="font-medium">Objection Handling</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Upcoming event */}
                        <div className="bg-muted/30 border border-border rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Video className="h-5 w-5 text-dopamine-blue mr-2" />
                              <div>
                                <h5 className="font-medium text-sm">Virtual Career Fair</h5>
                                <p className="text-xs text-muted-foreground">June 22 • 14:00-17:00 ET</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="mt-2 grid grid-cols-4 gap-2">
                            <div className="col-span-3">
                              <div className="flex flex-wrap gap-1.5">
                                <div className="bg-background text-xs px-2 py-0.5 rounded-full border">
                                  Stanford
                                </div>
                                <div className="bg-background text-xs px-2 py-0.5 rounded-full border">
                                  MIT
                                </div>
                                <div className="bg-background text-xs px-2 py-0.5 rounded-full border">
                                  Berkeley
                                </div>
                                <div className="bg-background text-xs px-2 py-0.5 rounded-full border">
                                  +4
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-dopamine-green">
                                68 RSVPs
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Another event */}
                        <div className="bg-muted/30 border border-border rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <MessagesSquare className="h-5 w-5 text-dopamine-pink mr-2" />
                              <div>
                                <h5 className="font-medium text-sm">Tech Sales Ask Me Anything</h5>
                                <p className="text-xs text-muted-foreground">July 8 • 16:00-17:30 ET</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="mt-2 text-xs flex justify-between items-center">
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>Open to all students</span>
                            </div>
                            <div className="text-dopamine-pink">
                              42 RSVPs
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick actions */}
                      <div className="border-t border-border p-3 flex space-x-2 justify-end">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          View All Events
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          Create Challenge
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-dopamine-purple">Recruiter Plans</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your recruiting needs, from single positions to enterprise talent acquisition.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  description: "Perfect for small businesses or occasional hiring",
                  features: [
                    "Access to candidate directory",
                    "Basic filtering and search",
                    "View performance metrics",
                    "5 direct messages per month",
                    "1 custom role-play assessment"
                  ],
                  buttonText: "Schedule Demo",
                  highlight: false
                },
                {
                  name: "Professional",
                  description: "Ideal for growing teams with regular hiring needs",
                  features: [
                    "Everything in Starter",
                    "Advanced analytics dashboard",
                    "Custom filters and saved searches",
                    "25 direct messages per month", 
                    "5 custom role-play assessments",
                    "Branded company profile"
                  ],
                  buttonText: "Schedule Demo",
                  highlight: true
                },
                {
                  name: "Enterprise",
                  description: "For large companies with continuous recruitment needs",
                  features: [
                    "Everything in Professional",
                    "Unlimited direct messages",
                    "Unlimited custom assessments",
                    "Custom recruiting events",
                    "API integration with ATS",
                    "Dedicated account manager",
                    "Priority candidate access"
                  ],
                  buttonText: "Schedule Demo",
                  highlight: false
                }
              ].map((plan, i) => (
                <Card 
                  key={i} 
                  className={`card-hover-effect relative overflow-hidden border-2 ${
                    plan.highlight 
                      ? "border-dopamine-purple/50 shadow-[0_10px_25px_-5px_rgba(139,92,246,0.25)] scale-105 z-10" 
                      : "border-border/50"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-dopamine-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-pink to-dopamine-purple"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-dopamine-purple">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4 text-center">
                      <span className="text-lg font-medium text-muted-foreground">Custom Pricing</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="text-dopamine-pink">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        plan.highlight 
                          ? "bg-dopamine-purple hover:bg-dopamine-purple/90" 
                          : "border-dopamine-purple text-dopamine-purple hover:bg-dopamine-purple/10"
                      } glow-on-hover`} 
                      variant={plan.highlight ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/signup">{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 dopamine-gradient-1 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Sales Recruiting?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join leading companies already using Quota Queen to find their next sales champions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 glow-on-hover" asChild>
                <Link to="/talent-pool">Access Talent Pool</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForRecruiters;
