
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Briefcase, Plus, X, PlusCircle } from "lucide-react";

interface RequirementInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const RequirementInput = ({ value, onChange, onRemove }: RequirementInputProps) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Enter job requirement"
        className="flex-1"
      />
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
        className="h-10 w-10 shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const NewJobForm = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [applicationLink, setApplicationLink] = useState("");
  
  const handleAddRequirement = () => {
    setRequirements([...requirements, '']);
  };
  
  const handleUpdateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };
  
  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = [...requirements];
      newRequirements.splice(index, 1);
      setRequirements(newRequirements);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Filter out any empty requirements
      const filteredRequirements = requirements.filter(req => req.trim() !== '');
      
      const { data, error } = await supabase
        .from('job_postings')
        .insert({
          title,
          description,
          company_name: profile?.company_name || 'Your Company',
          job_type: jobType,
          location,
          salary_range: salaryRange,
          requirements: filteredRequirements,
          application_link: applicationLink,
          recruiter_id: user?.id,
          is_active: true
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Job posted successfully",
        description: "Your job posting is now live",
      });
      
      navigate('/recruiter/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Failed to post job",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="border shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>Create a new job posting to attract talent</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales Development Representative"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and ideal candidate"
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, New York, NY"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $50,000 - $70,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link (Optional)</Label>
              <Input
                id="applicationLink"
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Requirements</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddRequirement}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Requirement
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              {requirements.map((req, index) => (
                <RequirementInput
                  key={index}
                  value={req}
                  onChange={(value) => handleUpdateRequirement(index, value)}
                  onRemove={() => handleRemoveRequirement(index)}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/recruiter/jobs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting Job..." : "Post Job"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default NewJobForm;
