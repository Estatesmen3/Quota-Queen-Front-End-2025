
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Briefcase, BarChart, Calendar, Search, Building, Clock, FileText, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { matchResumeToJobs, downloadResume } from "@/services/aiService";

export function JobMatcher() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [resumeVersions, setResumeVersions] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const { data: versions, error: versionsError } = await supabase
          .from('resume_versions' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('is_current', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (versionsError) throw versionsError;
        
        // Safely handle the versions data
        const typedVersions = versions as any[] || [];
        setResumeVersions(typedVersions);
        
        if (typedVersions.length > 0) {
          const currentVersion = typedVersions.find((v) => v.is_current) || typedVersions[0];
          setSelectedResumeId(currentVersion.id);
          
          const { data: matches, error: matchesError } = await (supabase
            .from('job_matches') as any)
            .select(`
              *, 
              job_postings:job_id (
                id, 
                title, 
                company_name, 
                location, 
                salary_range, 
                required_skills
              )
            `)
            .eq('resume_id', currentVersion.id);
            
          if (matchesError) throw matchesError;
          
          if (matches && matches.length > 0) {
            const formattedJobs = matches.map((match: any) => ({
              id: match.job_postings.id,
              title: match.job_postings.title,
              company: match.job_postings.company_name,
              location: match.job_postings.location || 'Remote',
              matchScore: match.match_score,
              salary: match.job_postings.salary_range || 'Not specified',
              skills: match.match_reasons?.matching_skills || [],
              missingSkills: match.match_reasons?.missing_skills || [],
              postedDate: 'Recently'
            }));
            
            setJobs(formattedJobs);
          } else {
            const { data: jobData, error: jobError } = await (supabase
              .from('job_postings') as any)
              .select('*')
              .limit(5);
              
            if (jobError) throw jobError;
            
            const formattedJobs = (jobData || []).map((job: any) => ({
              id: job.id,
              title: job.title,
              company: job.company_name,
              location: job.location || 'Remote',
              matchScore: 0,
              salary: job.salary_range || 'Not specified',
              skills: [],
              missingSkills: [],
              postedDate: 'Recently'
            }));
            
            setJobs(formattedJobs);
          }
        } else {
          const { data: jobData, error: jobError } = await (supabase
            .from('job_postings') as any)
            .select('*')
            .limit(5);
            
          if (jobError) throw jobError;
          
          const formattedJobs = (jobData || []).map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company_name,
            location: job.location || 'Remote',
            matchScore: 0,
            salary: job.salary_range || 'Not specified',
            skills: [],
            missingSkills: [],
            postedDate: 'Recently'
          }));
          
          setJobs(formattedJobs);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  const handleResumeChange = async (resumeId: string) => {
    if (!user || isMatching) return;
    
    setSelectedResumeId(resumeId);
    setIsMatching(true);
    
    try {
      const { data: matches, error: matchesError } = await (supabase
        .from('job_matches') as any)
        .select(`
          *, 
          job_postings:job_id (
            id, 
            title, 
            company_name, 
            location, 
            salary_range, 
            required_skills
          )
        `)
        .eq('resume_id', resumeId);
        
      if (matchesError) throw matchesError;
      
      if (matches && matches.length > 0) {
        const formattedJobs = matches.map((match: any) => ({
          id: match.job_postings.id,
          title: match.job_postings.title,
          company: match.job_postings.company_name,
          location: match.job_postings.location || 'Remote',
          matchScore: match.match_score,
          salary: match.job_postings.salary_range || 'Not specified',
          skills: match.match_reasons?.matching_skills || [],
          missingSkills: match.match_reasons?.missing_skills || [],
          postedDate: 'Recently'
        }));
        
        setJobs(formattedJobs);
      } else {
        await generateJobMatches(resumeId);
      }
    } catch (error: any) {
      console.error('Error fetching job matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job matches',
        variant: 'destructive'
      });
    } finally {
      setIsMatching(false);
    }
  };
  
  const generateJobMatches = async (resumeId: string) => {
    if (!user || !resumeId) return;
    
    setIsMatching(true);
    
    try {
      const selectedResume = resumeVersions.find((v: any) => v.id === resumeId);
      if (!selectedResume) {
        throw new Error('Resume not found');
      }
      
      const result = await downloadResume(selectedResume.file_path);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to download resume');
      }
      
      const response = await fetch(result.url);
      const blob = await response.blob();
      const text = await blob.text();
      
      URL.revokeObjectURL(result.url);
      
      const matchResult = await matchResumeToJobs(resumeId, text);
      
      if (!matchResult.success || !matchResult.data) {
        throw new Error(matchResult.error || 'Failed to match jobs');
      }
      
      const { data: matches, error: matchesError } = await (supabase
        .from('job_matches') as any)
        .select(`
          *, 
          job_postings:job_id (
            id, 
            title, 
            company_name, 
            location, 
            salary_range, 
            required_skills
          )
        `)
        .eq('resume_id', resumeId);
        
      if (matchesError) throw matchesError;
      
      if (matches && matches.length > 0) {
        const formattedJobs = matches.map((match: any) => ({
          id: match.job_postings.id,
          title: match.job_postings.title,
          company: match.job_postings.company_name,
          location: match.job_postings.location || 'Remote',
          matchScore: match.match_score,
          salary: match.job_postings.salary_range || 'Not specified',
          skills: match.match_reasons?.matching_skills || [],
          missingSkills: match.match_reasons?.missing_skills || [],
          postedDate: 'Recently'
        }));
        
        setJobs(formattedJobs);
        
        toast({
          title: 'Job Matching Complete',
          description: `Found ${formattedJobs.length} matching jobs for your resume`
        });
      } else {
        toast({
          title: 'No matches found',
          description: 'No matching jobs were found for your resume'
        });
      }
    } catch (error: any) {
      console.error('Error generating job matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate job matches',
        variant: 'destructive'
      });
    } finally {
      setIsMatching(false);
    }
  };
  
  const filteredJobs = jobs.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTab === "all" || 
     (selectedTab === "high" && job.matchScore >= 85) ||
     (selectedTab === "medium" && job.matchScore >= 70 && job.matchScore < 85) ||
     (selectedTab === "low" && job.matchScore < 70))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">AI Job Matching</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, locations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {resumeVersions.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Select Resume for Job Matching</h3>
                <p className="text-sm text-muted-foreground">Choose which resume to use for finding matching jobs</p>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="p-2 rounded border bg-background"
                  value={selectedResumeId || ''}
                  onChange={(e) => handleResumeChange(e.target.value)}
                  disabled={isMatching}
                >
                  {resumeVersions.map((version: any) => (
                    <option key={version.id} value={version.id}>
                      {version.title} {version.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateJobMatches(selectedResumeId!)}
                  disabled={!selectedResumeId || isMatching}
                >
                  {isMatching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Matching...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Run Match
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="high">High Match</TabsTrigger>
          <TabsTrigger value="medium">Medium Match</TabsTrigger>
          <TabsTrigger value="low">Low Match</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading job matches...</span>
          </Card>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <span className="text-sm mr-2">Match:</span>
                    <Badge className={job.matchScore >= 85 ? "bg-green-500" : "bg-amber-500"}>
                      {job.matchScore}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{job.salary}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Skills Match:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {job.skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length === 0 && (
                        <span className="text-xs text-muted-foreground">No matching skills found</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Skills to Develop:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {job.missingSkills.map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
                          {skill}
                        </Badge>
                      ))}
                      {job.missingSkills.length === 0 && (
                        <span className="text-xs text-muted-foreground">No skill gaps identified</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posted {job.postedDate}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Save</Button>
                  <Button size="sm">Apply Now</Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground">No jobs found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
