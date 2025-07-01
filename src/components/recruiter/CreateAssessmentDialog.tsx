
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { PersonalityAssessment } from "@/types/messages";

type CreateAssessmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAssessment: (assessment: Partial<PersonalityAssessment>) => void;
};

const CreateAssessmentDialog = ({ open, onOpenChange, onCreateAssessment }: CreateAssessmentDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modelType, setModelType] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [completionTime, setCompletionTime] = useState("medium");
  const [traits, setTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [modelTypeError, setModelTypeError] = useState(false);

  const handleAddTrait = () => {
    if (newTrait.trim() && !traits.includes(newTrait.trim())) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait("");
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError(true);
      isValid = false;
    } else {
      setTitleError(false);
    }
    
    if (!modelType) {
      setModelTypeError(true);
      isValid = false;
    } else {
      setModelTypeError(false);
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const completionTimeMap: Record<string, string> = {
      short: "5-10 min",
      medium: "15-20 min",
      comprehensive: "25-30 min"
    };
    
    onCreateAssessment({
      title,
      description,
      model_type: modelType,
      target_role: targetRole,
      completion_time: completionTimeMap[completionTime] || completionTimeMap.medium,
      traits
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setModelType("");
    setTargetRole("");
    setCompletionTime("medium");
    setTraits([]);
    setTitleError(false);
    setModelTypeError(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            Design a new personality assessment to evaluate candidates
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className={titleError ? "text-red-500" : ""}>
              Assessment Title {titleError && <span className="text-sm">*Required</span>}
            </Label>
            <Input 
              id="title" 
              placeholder="e.g., Sales Team Culture Fit" 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
              className={titleError ? "border-red-500" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe what this assessment evaluates" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="modelType" className={modelTypeError ? "text-red-500" : ""}>
              Assessment Model {modelTypeError && <span className="text-sm">*Required</span>}
            </Label>
            <Select 
              value={modelType} 
              onValueChange={(value) => {
                setModelType(value);
                if (value) setModelTypeError(false);
              }}
            >
              <SelectTrigger id="modelType" className={modelTypeError ? "border-red-500" : ""}>
                <SelectValue placeholder="Select assessment model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disc">DISC</SelectItem>
                <SelectItem value="mbti">Myers-Briggs Type Indicator</SelectItem>
                <SelectItem value="big5">Big Five</SelectItem>
                <SelectItem value="pi">Predictive Index</SelectItem>
                <SelectItem value="strengthsfinder">CliftonStrengths</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="targetRole">Target Job Role</Label>
            <Select value={targetRole} onValueChange={setTargetRole}>
              <SelectTrigger id="targetRole">
                <SelectValue placeholder="Select job role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Representative</SelectItem>
                <SelectItem value="marketing">Marketing Specialist</SelectItem>
                <SelectItem value="engineering">Software Engineer</SelectItem>
                <SelectItem value="design">Product Designer</SelectItem>
                <SelectItem value="customer_success">Customer Success Manager</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Key Traits to Assess</Label>
            <div className="flex flex-wrap gap-2 border rounded-md p-2">
              {traits.map(trait => (
                <Badge key={trait} variant="secondary" className="flex items-center gap-1">
                  {trait}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTrait(trait)}
                  />
                </Badge>
              ))}
              <div className="flex">
                <Input 
                  placeholder="Add trait" 
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  className="h-7 text-xs min-w-[120px]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddTrait} 
                  className="h-7 px-2"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="completionTime">Assessment Length</Label>
            <Select value={completionTime} onValueChange={setCompletionTime}>
              <SelectTrigger id="completionTime">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (5-10 minutes)</SelectItem>
                <SelectItem value="medium">Medium (15-20 minutes)</SelectItem>
                <SelectItem value="comprehensive">Comprehensive (25-30 minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssessmentDialog;
