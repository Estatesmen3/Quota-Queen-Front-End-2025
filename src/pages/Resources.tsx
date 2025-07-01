
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  BookMarked, 
  Youtube,
  Play,
  Star,
  Search,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  FileUp,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResources, useFeaturedResource, Resource } from "@/hooks/useResources";
import { ResourceDialog } from "@/components/ResourceDialog";

const Resources = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: allResources = [], isLoading: isLoadingAll, error: allError } = useResources({ searchTerm });
  const { data: articles = [], isLoading: isLoadingArticles, error: articlesError } = useResources({ 
    format: 'Article', 
    searchTerm 
  });
  const { data: videos = [], isLoading: isLoadingVideos, error: videosError } = useResources({ 
    format: 'Video', 
    searchTerm 
  });
  const { data: templates = [], isLoading: isLoadingTemplates, error: templatesError } = useResources({ 
    format: 'PDF', 
    searchTerm 
  });
  const { data: featuredResource, isLoading: isLoadingFeatured, error: featuredError } = useFeaturedResource();

  useEffect(() => {
    if (allError) console.error("Error loading all resources:", allError);
    if (articlesError) console.error("Error loading articles:", articlesError);
    if (videosError) console.error("Error loading videos:", videosError);
    if (templatesError) console.error("Error loading templates:", templatesError);
    if (featuredError) console.error("Error loading featured resource:", featuredError);
    
    console.log("Resource counts:", {
      all: allResources?.length || 0,
      articles: articles?.length || 0,
      videos: videos?.length || 0,
      templates: templates?.length || 0,
      featured: featuredResource ? 1 : 0
    });
  }, [allResources, articles, videos, templates, featuredResource, allError, articlesError, videosError, templatesError, featuredError]);

  const handleSaveResource = (title: string) => {
    if (savedResources.includes(title)) {
      setSavedResources(savedResources.filter(t => t !== title));
      toast({
        title: "Resource removed from saved items",
        duration: 2000,
      });
    } else {
      setSavedResources([...savedResources, title]);
      toast({
        title: "Resource saved! ✨",
        description: "Find it in your saved resources tab",
        duration: 2000,
        className: "dopamine-gradient-1 text-white border-none",
      });
    }
  };

  const handleMarkComplete = (title: string) => {
    if (!completedResources.includes(title)) {
      setCompletedResources([...completedResources, title]);
      toast({
        title: "Achievement Unlocked! 🎉",
        description: "You've completed a learning resource",
        duration: 3000,
        className: "dopamine-gradient-2 text-white border-none",
      });
    }
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Article':
      case 'Guide':
        return <FileText size={16} className="mr-2" />;
      case 'Video':
        return <Play size={16} className="mr-2" />;
      case 'PDF':
        return <Download size={16} className="mr-2" />;
      default:
        return <FileUp size={16} className="mr-2" />;
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return "outline";
      case 'Intermediate':
        return "secondary";
      case 'Advanced':
        return "default";
      default:
        return "outline";
    }
  };

  const renderResourceCard = (resource: Resource) => (
    <Card key={resource.id} className="card-hover-effect overflow-hidden">
      <div className={`h-1 w-full ${completedResources.includes(resource.title) ? 'bg-dopamine-green' : 'bg-dopamine-purple/50'}`}></div>
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription className="mt-1">
              {resource.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleSaveResource(resource.title)}
              className={savedResources.includes(resource.title) ? "text-dopamine-purple" : ""}
            >
              <Bookmark size={18} />
            </Button>
            {completedResources.includes(resource.title) ? (
              <div className="h-9 w-9 rounded-md bg-dopamine-green/10 flex items-center justify-center text-dopamine-green">
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleMarkComplete(resource.title)}
              >
                <CheckCircle2 size={18} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{resource.format}</Badge>
          {resource.estimated_duration && (
            <Badge variant="outline">
              <Clock size={12} className="mr-1" />
              {resource.estimated_duration}
            </Badge>
          )}
          <Badge variant={getDifficultyBadgeVariant(resource.difficulty_level)}>
            {resource.difficulty_level}
          </Badge>
          {resource.tags && resource.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-dopamine-purple/5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="ghost"
          className="text-sm text-dopamine-purple hover:text-dopamine-purple hover:bg-dopamine-purple/10"
          onClick={() => handleViewResource(resource)}
        >
          {getFormatIcon(resource.format)}
          View Resource
        </Button>
      </CardFooter>
    </Card>
  );

  const renderLoader = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-dopamine-purple" />
    </div>
  );

  const renderError = (message: string) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-red-500 mb-2">Unable to load resources</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-background to-muted/30">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight highlight-gradient">Learning Resources</h1>
              <p className="text-muted-foreground mt-2">Enhance your sales skills with curated content</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-dopamine-purple/30 focus:border-dopamine-purple transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {isLoadingFeatured ? (
              <Card className="md:col-span-4 bg-gradient-to-r from-dopamine-purple/10 to-dopamine-blue/5 border-dopamine-purple/20 animate-fade-in overflow-hidden">
                {renderLoader()}
              </Card>
            ) : featuredError ? (
              <Card className="md:col-span-4 bg-gradient-to-r from-dopamine-purple/10 to-dopamine-blue/5 border-dopamine-purple/20 animate-fade-in overflow-hidden">
                {renderError("Unable to load featured resources")}
              </Card>
            ) : featuredResource ? (
              <Card className="md:col-span-4 bg-gradient-to-r from-dopamine-purple/10 to-dopamine-blue/5 border-dopamine-purple/20 animate-fade-in overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-dopamine-blue/5 rounded-full -mt-32 -mr-32 blur-3xl"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-dopamine-purple/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-dopamine-purple animate-pulse-subtle" />
                    </div>
                    <CardTitle className="text-xl">Featured Resource</CardTitle>
                  </div>
                  <CardDescription>Hand-picked by our sales experts</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-dopamine-purple/30 to-dopamine-pink/20 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-[1.02] transition-all cursor-pointer">
                    {featuredResource.format === 'Video' ? (
                      <Play size={48} className="text-white" />
                    ) : featuredResource.format === 'PDF' ? (
                      <FileText size={48} className="text-white" />
                    ) : (
                      <BookOpen size={48} className="text-white" />
                    )}
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">{featuredResource.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {featuredResource.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink text-white border-none">Premium</Badge>
                      {featuredResource.estimated_duration && (
                        <Badge variant="outline" className="text-dopamine-purple border-dopamine-purple/50">
                          {featuredResource.estimated_duration}
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-dopamine-orange/50 text-dopamine-orange">
                        {featuredResource.difficulty_level}
                      </Badge>
                      {featuredResource.tags && featuredResource.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-dopamine-purple/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink text-white border-none hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                      onClick={() => handleViewResource(featuredResource)}
                    >
                      {featuredResource.format === 'Video' ? (
                        <><Play size={16} className="mr-2" />Watch Now</>
                      ) : featuredResource.format === 'PDF' ? (
                        <><Download size={16} className="mr-2" />Download PDF</>
                      ) : (
                        <><BookOpen size={16} className="mr-2" />Read Article</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <div className="md:col-span-3">
              <Tabs defaultValue="all" className="animate-fade-in">
                <TabsList className="w-full max-w-md mb-6 bg-background/80 backdrop-blur p-1 rounded-xl">
                  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-purple/20 data-[state=active]:to-dopamine-pink/10 rounded-lg transition-all">
                    <BookOpen size={16} className="mr-2" />
                    All Resources
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-blue/20 data-[state=active]:to-dopamine-purple/10 rounded-lg transition-all">
                    <FileText size={16} className="mr-2" />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-green/20 data-[state=active]:to-dopamine-blue/10 rounded-lg transition-all">
                    <Video size={16} className="mr-2" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-orange/20 data-[state=active]:to-dopamine-pink/10 rounded-lg transition-all">
                    <Download size={16} className="mr-2" />
                    Templates
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6 mt-0">
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Found {allResources.length} resources matching "{searchTerm}"
                    </p>
                  )}
                  
                  {isLoadingAll ? (
                    renderLoader()
                  ) : allError ? (
                    renderError("Unable to load resources")
                  ) : allResources.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No resources found{searchTerm ? ` matching "${searchTerm}"` : ""}.</p>
                    </div>
                  ) : (
                    allResources.map(resource => renderResourceCard(resource))
                  )}
                </TabsContent>

                <TabsContent value="articles" className="space-y-6 mt-0">
                  {isLoadingArticles ? (
                    renderLoader()
                  ) : articlesError ? (
                    renderError("Unable to load articles")
                  ) : articles.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No articles found{searchTerm ? ` matching "${searchTerm}"` : ""}.</p>
                    </div>
                  ) : (
                    articles.map(article => renderResourceCard(article))
                  )}
                </TabsContent>

                <TabsContent value="videos" className="space-y-6 mt-0">
                  {isLoadingVideos ? (
                    renderLoader()
                  ) : videosError ? (
                    renderError("Unable to load videos")
                  ) : videos.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No videos found{searchTerm ? ` matching "${searchTerm}"` : ""}.</p>
                    </div>
                  ) : (
                    videos.map(video => renderResourceCard(video))
                  )}
                </TabsContent>

                <TabsContent value="templates" className="space-y-6 mt-0">
                  {isLoadingTemplates ? (
                    renderLoader()
                  ) : templatesError ? (
                    renderError("Unable to load templates")
                  ) : templates.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No templates found{searchTerm ? ` matching "${searchTerm}"` : ""}.</p>
                    </div>
                  ) : (
                    templates.map(template => renderResourceCard(template))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6 animate-fade-in">
              <Card className="border-dopamine-purple/20 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-dopamine-purple/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-dopamine-purple/20 flex items-center justify-center">
                      <Star className="h-3 w-3 text-dopamine-purple" />
                    </div>
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resources completed</span>
                    <span className="font-medium">{completedResources.length}/{allResources.length}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-dopamine-purple to-dopamine-pink transition-all duration-1000 ease-in-out"
                      style={{ width: `${allResources.length ? (completedResources.length / allResources.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Learning streak</span>
                    <span className="font-medium">5 days 🔥</span>
                  </div>
                </CardContent>
                {completedResources.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full border-dopamine-purple/30 text-dopamine-purple hover:bg-dopamine-purple/10 hover:text-dopamine-purple transition-colors">
                      <Star size={16} className="mr-2" />
                      View Learning Badges
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card className="border-dopamine-blue/20 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-dopamine-blue/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-dopamine-blue/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-dopamine-blue" />
                    </div>
                    Recommended For You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dopamine-blue/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-dopamine-blue/10 flex items-center justify-center text-dopamine-blue">
                        <BookMarked size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Cold Calling Masterclass</p>
                        <p className="text-xs text-muted-foreground">30 min video</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dopamine-pink/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-dopamine-pink/10 flex items-center justify-center text-dopamine-pink">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sales Email Templates</p>
                        <p className="text-xs text-muted-foreground">PDF Guide</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dopamine-green/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-md bg-dopamine-green/10 flex items-center justify-center text-dopamine-green">
                        <Video size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Closing Deals Workshop</p>
                        <p className="text-xs text-muted-foreground">45 min workshop</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dopamine-orange/20 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-dopamine-orange/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-dopamine-orange/20 flex items-center justify-center">
                      <Star className="h-3 w-3 text-dopamine-orange" />
                    </div>
                    Weekly Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-dopamine-orange to-dopamine-pink transition-all duration-1000 ease-in-out" style={{ width: "35%" }}></div>
                    </div>
                    <p className="text-sm font-medium">Complete 5 Resources This Week</p>
                    <p className="text-xs text-muted-foreground">35% complete (2/5)</p>
                    <p className="text-xs text-muted-foreground">Earn the "Learning Champion" badge!</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-dopamine-orange to-dopamine-pink text-white border-none hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                    Continue Challenge
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Dialog */}
      <ResourceDialog
        resource={selectedResource}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onComplete={(id) => {
          if (selectedResource) {
            handleMarkComplete(selectedResource.title);
          }
        }}
        isSaved={selectedResource ? savedResources.includes(selectedResource.title) : false}
        onSave={(id) => {
          if (selectedResource) {
            handleSaveResource(selectedResource.title);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default Resources;
