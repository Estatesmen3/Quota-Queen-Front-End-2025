import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Award, Heart, Share2, Send, Bell, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFollow = (name: string) => {
    toast({
      title: `You're now following ${name}`,
      description: "You'll see their updates in your feed",
      duration: 3000,
    });
  };

  const handleLike = (postId: number) => {
    toast({
      title: "Post liked!",
      description: "You've earned 5 engagement points",
      duration: 2000,
    });
  };

  const posts = [
    {
      id: 1,
      author: "Robert Choate",
      avatar: "",
      role: "Sales Development",
      university: "Stanford University",
      time: "2h ago",
      content: "Just completed my 10th roleplay simulation with a 95% success rate! The enterprise software scenario was challenging but rewarding.",
      likes: 24,
      comments: 5,
      tag: "Achievement"
    },
    {
      id: 2,
      author: "Jessica Wong",
      avatar: "",
      role: "Marketing",
      university: "UCLA",
      time: "5h ago",
      content: "Has anyone tried the new financial services roleplay? Looking for tips on handling objections about pricing.",
      likes: 15,
      comments: 11,
      tag: "Question"
    },
    {
      id: 3,
      author: "Marcus Johnson",
      avatar: "",
      role: "Business Development",
      university: "NYU",
      time: "1d ago",
      content: "Secured an interview with Tesla after sharing my roleplay portfolio! The recruiter specifically mentioned my handling of technical objections.",
      likes: 87,
      comments: 32,
      tag: "Success Story"
    }
  ];

  const suggestedPeople = [
    {
      name: "Alicia Garcia",
      role: "Sales Management",
      university: "UC Berkeley",
      avatar: "",
      mutualConnections: 3
    },
    {
      name: "David Park",
      role: "Account Executive",
      university: "University of Michigan",
      avatar: "",
      mutualConnections: 5
    },
    {
      name: "Sarah Johnson",
      role: "Marketing",
      university: "Harvard University",
      avatar: "",
      mutualConnections: 2
    }
  ];

  const events = [
    {
      title: "Sales Pitch Competition",
      date: "Next Friday, 3pm EST",
      participants: 45,
      description: "Showcase your skills in a live competition with feedback from industry recruiters."
    },
    {
      title: "Tech Sales Workshop",
      date: "Tomorrow, 5pm EST",
      participants: 28,
      description: "Learn specific strategies for selling SaaS products with guest speaker from Salesforce."
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/5 p-4 rounded-lg animate-fade-in">
            <h1 className="text-3xl font-bold highlight-gradient">Community</h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-dopamine-purple/10 transition-colors"
              >
                <Bell size={20} className="text-dopamine-purple" />
                <span className="absolute -top-1 -right-1 bg-dopamine-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse-subtle">3</span>
              </Button>
              <Button className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:opacity-90 transition-opacity">
                <MessageCircle size={16} className="mr-2" />
                New Post
              </Button>
            </div>
          </div>

          <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md mb-6 bg-gradient-to-r from-background via-dopamine-purple/5 to-background p-1">
              <TabsTrigger 
                value="feed" 
                className="flex-1 data-[state=active]:bg-dopamine-purple/10 data-[state=active]:text-dopamine-purple transition-all"
              >
                <MessageCircle size={16} className="mr-2" />
                Feed
              </TabsTrigger>
              <TabsTrigger 
                value="connections" 
                className="flex-1 data-[state=active]:bg-dopamine-pink/10 data-[state=active]:text-dopamine-pink transition-all"
              >
                <Users size={16} className="mr-2" />
                Connections
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="flex-1 data-[state=active]:bg-dopamine-blue/10 data-[state=active]:text-dopamine-blue transition-all"
              >
                <Award size={16} className="mr-2" />
                Events
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TabsContent value="feed" className="space-y-6 mt-0">
                  <Card className="border-t-4 border-t-dopamine-purple transition-all hover:shadow-lg hover:shadow-dopamine-purple/5">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input 
                            placeholder="Share your sales achievements or ask questions..." 
                            className="mb-4"
                          />
                          <div className="flex justify-between">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Photo</Button>
                              <Button variant="outline" size="sm">Roleplay</Button>
                            </div>
                            <Button size="sm" className="glow-on-hover">Post</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {posts.map(post => (
                    <Card 
                      key={post.id} 
                      className="card-hover-effect border-t-4 border-t-dopamine-purple/80 hover:shadow-lg hover:shadow-dopamine-purple/10 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <Avatar>
                              <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base flex items-center">
                                {post.author}
                                {post.author === "Robert Choate" && (
                                  <Badge className="ml-2 bg-dopamine-purple">Top Performer</Badge>
                                )}
                              </CardTitle>
                              <CardDescription>{post.role} • {post.university}</CardDescription>
                              <CardDescription>{post.time}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={post.tag === "Achievement" ? "default" : post.tag === "Question" ? "outline" : "secondary"}>
                            {post.tag}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p>{post.content}</p>
                      </CardContent>
                      <CardFooter className="pt-3 flex justify-between border-t">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                            <Heart size={16} className="mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle size={16} className="mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 size={16} className="mr-1" />
                          Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="connections" className="space-y-6 mt-0">
                  <Card className="border-t-4 border-t-dopamine-pink transition-all hover:shadow-lg hover:shadow-dopamine-pink/5">
                    <CardHeader>
                      <CardTitle>Your Connections</CardTitle>
                      <CardDescription>
                        You have 28 connections from 15 different universities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        {suggestedPeople.map((person, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-sm text-muted-foreground">{person.role} • {person.university}</p>
                                <p className="text-xs text-muted-foreground">{person.mutualConnections} mutual connections</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleFollow(person.name)}
                              className="glow-on-hover"
                            >
                              <UserPlus size={16} className="mr-2" />
                              Connect
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-6 mt-0">
                  {events.map((event, index) => (
                    <Card 
                      key={index} 
                      className="card-hover-effect border-t-4 border-t-dopamine-blue transition-all hover:shadow-lg hover:shadow-dopamine-blue/5"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>{event.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{event.description}</p>
                        <Badge variant="outline">{event.participants} participants</Badge>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">Share</Button>
                        <Button className="glow-on-hover">Join Event</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
              </div>

              <div className="space-y-6">
                <Card className="border-t-4 border-t-dopamine-pink/80 hover:shadow-lg hover:shadow-dopamine-pink/5 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">People You May Know</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {suggestedPeople.map((person, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{person.name}</p>
                            <p className="text-xs text-muted-foreground">{person.university}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleFollow(person.name)}
                          className="h-8 w-8 p-0"
                        >
                          <UserPlus size={16} />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-dopamine-blue/80 hover:shadow-lg hover:shadow-dopamine-blue/5 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {events.map((event, index) => (
                      <div key={index}>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs w-full"
                          >
                            RSVP
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-dopamine-purple/80 hover:shadow-lg hover:shadow-dopamine-purple/5 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Engagement Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Profile Views</span>
                        <span className="font-medium">124</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Post Impressions</span>
                        <span className="font-medium">2,145</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Engagement Rate</span>
                        <span className="font-medium text-dopamine-purple">18%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
