
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Briefcase, Plus, Users, Calendar, MoreHorizontal, Search, Filter, ArrowDownAZ, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location: string;
  type: string;
  status: string;
  applicants?: number;
  postedDate: string;
  closingDate?: string;
  company_name: string;
  job_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const RecruiterJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  useEffect(() => {
    fetchJobs();
  }, [user]);
  
  const fetchJobs = async () => {
    try {
      if (!user) return;
      
      setIsLoading(true);
      
      let query = supabase
        .from('job_postings')
        .select('*')
        .eq('recruiter_id', user.id);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our component's expected format
      const transformedJobs = data.map(job => ({
        id: job.id,
        title: job.title,
        location: job.location || "Remote",
        type: job.job_type || "Full-time",
        status: job.is_active ? "Active" : "Inactive",
        applicants: Math.floor(Math.random() * 50), // Mock data - would come from a real count in production
        postedDate: new Date(job.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        company_name: job.company_name,
        job_type: job.job_type,
        is_active: job.is_active,
        created_at: job.created_at,
        updated_at: job.updated_at,
        closingDate: new Date(new Date(job.created_at).setMonth(new Date(job.created_at).getMonth() + 1)).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error loading jobs",
        description: "There was a problem loading your job postings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);
      
      if (error) throw error;
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              is_active: !currentStatus,
              status: !currentStatus ? "Active" : "Inactive"
            } 
          : job
      ));
      
      toast({
        title: currentStatus ? "Job Deactivated" : "Job Activated",
        description: currentStatus 
          ? "The job posting is now hidden from candidates" 
          : "The job posting is now visible to candidates",
      });
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error updating job",
        description: "There was a problem updating the job status",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
      
      // Update local state
      setJobs(jobs.filter(job => job.id !== jobId));
      
      toast({
        title: "Job Deleted",
        description: "The job posting has been permanently removed",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error deleting job",
        description: "There was a problem deleting the job posting",
        variant: "destructive",
      });
    }
  };
  
  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && job.is_active) ||
                         (statusFilter === "inactive" && !job.is_active);
                         
    return matchesSearch && matchesStatus;
  });
  
  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
            <p className="text-muted-foreground">
              Manage your open positions and applications
            </p>
          </div>
          <Button onClick={() => navigate("/recruiter/jobs/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Jobs</SelectItem>
              <SelectItem value="inactive">Inactive Jobs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Job Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                {jobs.length === 0 
                  ? "You haven't posted any jobs yet." 
                  : "No jobs match your filters."}
              </p>
              {jobs.length === 0 && (
                <Button onClick={() => navigate("/recruiter/jobs/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Button>
              )}
            </div>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/recruiter/jobs/${job.id}`} className="group">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={job.is_active ? "default" : "outline"}>
                              {job.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {job.job_type} • {job.location}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/recruiter/jobs/${job.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}>
                              Edit Job
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(job.id, job.is_active)}>
                              {job.is_active ? "Deactivate Job" : "Activate Job"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{job.applicants}</p>
                            <p className="text-xs text-muted-foreground">Applicants</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{job.postedDate}</p>
                            <p className="text-xs text-muted-foreground">Posted</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{job.closingDate}</p>
                            <p className="text-xs text-muted-foreground">Closing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 md:justify-center">
                      <Button 
                        className="flex-1 md:w-full" 
                        size="sm"
                        onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 md:w-full" 
                        size="sm"
                        onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
                      >
                        Edit Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterJobs;
