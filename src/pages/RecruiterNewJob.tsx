
import React, { useState } from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Briefcase, Building, CreditCard, MapPin, CheckCircle2, Sparkles } from "lucide-react";
import RecruitmentConfetti from "@/components/recruiter/RecruitmentConfetti";

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

const RecruiterNewJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const defaultValues: Partial<JobFormValues> = {
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
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to post a job.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('job_postings')
        .insert({
          ...data,
          recruiter_id: user.id,
        });

      if (error) throw error;

      // Show success confetti
      setShowConfetti(true);
      
      toast({
        title: "Job posted successfully! 🎉",
        description: "Your job has been posted and is now visible to candidates.",
      });

      // Navigate after a delay to allow seeing the confetti
      setTimeout(() => {
        navigate('/recruiter/jobs');
      }, 2000);
      
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error posting job",
        description: "There was a problem posting your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecruiterLayout>
      {showConfetti && <RecruitmentConfetti />}
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="highlight-gradient">Post New Job</span>
            </h1>
            <p className="text-muted-foreground">
              Create a new job posting for your company
            </p>
          </div>
          <Button variant="outline" className="glow-on-hover" onClick={() => navigate("/recruiter/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="flex items-center gap-2">
              Job Details
              <Briefcase className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>
              Enter the details of the job you want to post
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in" style={{ animationDelay: "50ms" }}>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Sales Development Representative" className="pl-10 transition-all focus:border-primary" {...field} />
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
                      <FormItem className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Acme Corporation" className="pl-10 transition-all focus:border-primary" {...field} />
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
                      <FormItem className="animate-fade-in" style={{ animationDelay: "150ms" }}>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Remote, San Francisco, CA" className="pl-10 transition-all focus:border-primary" {...field} />
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
                      <FormItem className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                        <FormLabel>Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="transition-all focus:border-primary">
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
                      <FormItem className="animate-fade-in" style={{ animationDelay: "250ms" }}>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. $60,000 - $80,000" className="pl-10 transition-all focus:border-primary" {...field} />
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
                      <FormItem className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                        <FormLabel>External Application URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-company.com/careers/job-id" className="transition-all focus:border-primary" {...field} />
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
                    <FormItem className="animate-fade-in" style={{ animationDelay: "350ms" }}>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the role" 
                          className="min-h-32 transition-all focus:border-primary" 
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
                    <FormItem className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the skills, qualifications, and experience required" 
                          className="min-h-32 transition-all focus:border-primary" 
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
                    <FormItem className="animate-fade-in" style={{ animationDelay: "450ms" }}>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the key responsibilities and duties" 
                          className="min-h-32 transition-all focus:border-primary" 
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
                    <FormItem className="animate-fade-in" style={{ animationDelay: "500ms" }}>
                      <FormLabel>Benefits (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any benefits, perks, or compensation packages" 
                          className="min-h-24 transition-all focus:border-primary" 
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 animate-fade-in" style={{ animationDelay: "550ms" }}>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Activate Job Posting
                        </FormLabel>
                        <FormDescription>
                          Make the job visible to candidates immediately after posting
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

                <div className="flex justify-end space-x-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="glow-on-hover"
                    onClick={() => navigate("/recruiter/jobs")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="glow-on-hover dopamine-gradient-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Publish Job
                        <Sparkles className="ml-2 h-4 w-4 text-amber-400" />
                      </>
                    )}
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

export default RecruiterNewJob;
