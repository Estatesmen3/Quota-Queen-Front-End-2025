
import React, { useState, useEffect } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Briefcase, Building, CreditCard, Loader2, MapPin } from "lucide-react";

const jobFormSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  company_name: z.string().min(2, "Company name is required."),
  location: z.string().min(2, "Location is required."),
  job_type: z.string(),
  salary_range: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters."),
  requirements: z.string().min(20, "Requirements must be at least 20 characters."),
  responsibilities: z.string().min(20, "Responsibilities must be at least 20 characters."),
  benefits: z.string().optional(),
  application_url: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const RecruiterEditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company_name: "",
      location: "",
      job_type: "Full-time",
      salary_range: "",
      description: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      application_url: "",
      is_active: true,
    },
  });

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
        
        // Map the data to our form
        form.reset({
          title: data.title || "",
          company_name: data.company_name || "",
          location: data.location || "",
          job_type: data.job_type || "Full-time",
          salary_range: data.salary_range || "",
          description: data.description || "",
          requirements: data.requirements || "",
          responsibilities: data.responsibilities || "",
          benefits: data.benefits || "",
          application_url: data.application_url || "",
          is_active: data.is_active,
        });
        
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
  }, [id, user, navigate, toast, form]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      if (!user || !id) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to edit a job.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('job_postings')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('recruiter_id', user.id);

      if (error) throw error;

      toast({
        title: "Job updated successfully",
        description: "Your job posting has been updated.",
      });

      navigate('/recruiter/jobs');
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error updating job",
        description: "There was a problem updating your job. Please try again.",
        variant: "destructive",
      });
    }
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

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
            <p className="text-muted-foreground">
              Update your job posting
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/recruiter/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Edit the details of your job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Sales Development Representative" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Acme Corporation" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Remote, San Francisco, CA" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="job_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Temporary">Temporary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salary_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. $60,000 - $80,000" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Adding a salary range can increase application rates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="application_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Application URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-company.com/careers/job-id" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank if applications should be managed within this platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the role" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the skills, qualifications, and experience required" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the key responsibilities and duties" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any benefits, perks, or compensation packages" 
                          className="min-h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Job Status
                        </FormLabel>
                        <FormDescription>
                          {field.value 
                            ? "The job is currently active and visible to candidates" 
                            : "The job is currently inactive and hidden from candidates"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => navigate("/recruiter/jobs")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Job
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterEditJob;
