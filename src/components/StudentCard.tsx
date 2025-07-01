
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { University, GraduationCap, Briefcase, MessageCircle, Mail } from "lucide-react";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    university: string;
    major: string;
    graduationYear: number;
    score: number;
    skills: string[];
    topIndustry: string;
  };
  view: "grid" | "list";
}

const StudentCard = ({ student, view }: StudentCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // This would be replaced with actual message sending logic
    // using Supabase
    
    toast({
      title: "Message sent! 🚀",
      description: `Your message has been sent to ${student.name}.`,
      variant: "default",
    });
    
    setMessage("");
    setIsDialogOpen(false);
  };

  if (view === "grid") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <Avatar className="h-12 w-12 mb-2">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Badge className="bg-primary hover:bg-primary/90 transition-all">
              {student.score}%
            </Badge>
          </div>
          <CardTitle className="text-lg">{student.name}</CardTitle>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <University className="h-3.5 w-3.5 mr-1" />
              {student.university}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 mr-1" />
              Class of {student.graduationYear}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              {student.topIndustry}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm font-medium">Major</div>
            <p className="text-sm text-muted-foreground">{student.major}</p>
            
            <div className="text-sm font-medium mt-2">Skills</div>
            <div className="flex flex-wrap gap-1">
              {student.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/10">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/student-profile/${student.id}`)}>
            View Profile
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Message {student.name}</DialogTitle>
                <DialogDescription>
                  Send a direct message to connect about opportunities or ask questions.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="Write your message here..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSendMessage} className="w-full sm:w-auto">
                  Send Message
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    );
  }

  // List view
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {student.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium truncate">{student.name}</h3>
              <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center">
                  <University className="h-3.5 w-3.5 mr-1" />
                  {student.university}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  Class of {student.graduationYear}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {student.topIndustry}
                </div>
              </div>
            </div>
            <Badge className="bg-primary hover:bg-primary/90 sm:ml-2 mt-2 sm:mt-0 transition-all sm:self-start">
              {student.score}%
            </Badge>
          </div>
          
          <div className="mt-3">
            <p className="text-sm mb-2">{student.major}</p>
            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/10">
                  {skill}
                </Badge>
              ))}
              {student.skills.length > 3 && (
                <Badge variant="outline" className="bg-secondary/10">
                  +{student.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate(`/student-profile/${student.id}`)}>
            View Profile
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Message {student.name}</DialogTitle>
                <DialogDescription>
                  Send a direct message to connect about opportunities or ask questions.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="Write your message here..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSendMessage} className="w-full sm:w-auto">
                  Send Message
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;
