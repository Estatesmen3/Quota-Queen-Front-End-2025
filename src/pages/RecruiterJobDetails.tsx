
import React, { useState, useEffect } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Clock, 
  Edit, 
  Eye, 
  EyeOff, 
  Loader2, 
  MapPin, 
  MoreHorizontal, 
  Share2, 
  Trash, 
  Users 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JobDetails {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_range?: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits?: string;
  application_url?: string;
  is_active: boolean;
  recruiter_id: string;
  created_at: string;
  updated_at: string;
}

// Mock candidate data - in a real app, this would come from your database
const mockCandidates = [
  {
    id: '1',
    name: 'Alice Johnson',
    education: 'Stanford University',
    experience: '2 years',
    applied: '3 days ago',
    status: 'Review',
    match: 95
  },
  {
    id: '2',
    name: 'Bob Smith',
    education: 'UC Berkeley',
    experience: '1 year',
    applied: '1 week ago',
    status: 'Interview',
    match: 85
  },
  {
    id: '3',
    name: 'Charlie Brown',
    education: 'MIT',
    experience: 'New graduate',
    applied: '2 days ago',
    status: 'Review',
    match: 80
  },
  {
    id: '4',
    name: 'Diana Prince',
    education: 'Harvard University',
    experience: '3 years',
    applied: '5 days ago',
    status: 'Shortlisted',
    match: 90
  }
];

const RecruiterJobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!id || !user) return;
        
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('id', id)
          .eq('recruiter_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Job not found",
            description: "The requested job posting could not be found.",
            variant: "destructive",
          });
          navigate('/recruiter/jobs');
          return;
        }
        
        setJob(data as JobDetails);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error loading job",
          description: "There was a problem loading the job details.",
          variant: "destructive",
        });
        navigate('/recruiter/jobs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, user, navigate, toast]);

  const handleToggleStatus = async () => {
    try {
      if (!job || !user) return;
      
      const newStatus = !job.is_active;
      
      const { error } = await supabase
        .from('job_postings')
        .update({ 
          is_active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id)
        .eq('recruiter_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setJob({
        ...job,
        is_active: newStatus
      });
      
      toast({
        title: newStatus ? "Job Activated" : "Job Deactivated",
        description: newStatus 
          ? "The job posting is now visible to candidates" 
          : "The job posting is now hidden from candidates",
      });
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error updating job",
        description: "There was a problem updating the job status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async () => {
    try {
      if (!job || !user) return;
      
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', job.id)
        .eq('recruiter_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Job Deleted",
        description: "The job posting has been permanently removed.",
      });
      
      navigate('/recruiter/jobs');
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error deleting job",
        description: "There was a problem deleting the job posting.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    // In a real app, this would implement actual sharing functionality
    toast({
      title: `Shared on ${platform}`,
      description: "Job posting link copied to clipboard.",
    });
    setShowShareOptions(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <RecruiterLayout>
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </RecruiterLayout>
    );
  }

  if (!job) {
    return (
      <RecruiterLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-6">
              The job posting you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate("/recruiter/jobs")}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/recruiter/jobs")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{job.company_name}</span>
                <span className="text-muted-foreground">•</span>
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={job.is_active ? "default" : "outline"}>
              {job.is_active ? "Active" : "Inactive"}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Job Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {job.is_active ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Deactivate Job
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Activate Job
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowShareOptions(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Job
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Job Details</TabsTrigger>
                <TabsTrigger value="applicants" className="flex-1">Applicants (4)</TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 pt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="whitespace-pre-line">{job.description}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                        <p className="whitespace-pre-line">{job.requirements}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
                        <p className="whitespace-pre-line">{job.responsibilities}</p>
                      </div>
                      
                      {job.benefits && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                            <p className="whitespace-pre-line">{job.benefits}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Job
                  </Button>
                  <Button onClick={handleToggleStatus}>
                    {job.is_active ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Deactivate Job
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Activate Job
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="applicants" className="pt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {mockCandidates.map((candidate) => (
                        <div 
                          key={candidate.id}
                          className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <h3 className="font-semibold">{candidate.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              {candidate.education} • {candidate.experience} experience
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Applied {candidate.applied}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <Badge 
                              variant={
                                candidate.status === "Interview" ? "default" : 
                                candidate.status === "Shortlisted" ? "secondary" : "outline"
                              }
                            >
                              {candidate.status}
                            </Badge>
                            <div className="text-xs">
                              <span className="font-semibold text-primary">{candidate.match}%</span> match
                            </div>
                            <Button size="sm" variant="outline">View Profile</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="pt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Views</h3>
                        <p className="text-2xl font-bold">247</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="text-green-500">+12%</span> past week
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Applications</h3>
                        <p className="text-2xl font-bold">32</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="text-green-500">+5</span> new applications
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
                        <p className="text-2xl font-bold">12.9%</p>
                        <div className="text-xs text-muted-foreground">
                          Industry avg: 8.3%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Detailed analytics available in the full Analytics dashboard
                      </p>
                      <Button variant="outline" className="mt-2" asChild>
                        <a href="/recruiter/analytics">View Full Analytics</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Job Type</p>
                      <p className="text-sm text-muted-foreground">{job.job_type}</p>
                    </div>
                  </div>
                  
                  {job.salary_range && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-5 w-5 text-primary">$</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Salary Range</p>
                        <p className="text-sm text-muted-foreground">{job.salary_range}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Posted On</p>
                      <p className="text-sm text-muted-foreground">{formatDate(job.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Applications</p>
                      <p className="text-sm text-muted-foreground">4 candidates applied</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <a href="#promote">
                      <span className="mr-2">🚀</span> Promote Job
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowShareOptions(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Job
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#download">
                      <span className="mr-2">📊</span> Download Report
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Options Dialog */}
      <AlertDialog open={showShareOptions} onOpenChange={setShowShareOptions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Choose where you'd like to share this job posting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" onClick={() => handleShare('LinkedIn')}>
              LinkedIn
            </Button>
            <Button variant="outline" onClick={() => handleShare('Twitter')}>
              Twitter
            </Button>
            <Button variant="outline" onClick={() => handleShare('Facebook')}>
              Facebook
            </Button>
            <Button variant="outline" onClick={() => handleShare('Email')}>
              Email
            </Button>
            <Button className="col-span-2" onClick={() => handleShare('Copy Link')}>
              Copy Link
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RecruiterLayout>
  );
};

export default RecruiterJobDetails;
