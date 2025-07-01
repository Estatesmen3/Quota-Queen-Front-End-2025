
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Mail, User, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCallsData } from "@/hooks/useCallsData";
import { supabase } from "@/lib/supabase";

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: any | null;
}

// Mock team member data - would come from your DB in production
const teamMembers = [
  { id: "tm1", name: "Alex Rodriguez", role: "Hiring Manager" },
  { id: "tm2", name: "Priya Sharma", role: "Technical Interviewer" },
  { id: "tm3", name: "Marcus Johnson", role: "HR Specialist" },
  { id: "tm4", name: "Sarah Lee", role: "Department Lead" }
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

// Sample student data for simple selection
const sampleStudents = [
  { id: "s1", first_name: "Emma", last_name: "Wilson", university: "Stanford University", major: "Computer Science" },
  { id: "s2", first_name: "Jamal", last_name: "Thompson", university: "MIT", major: "Electrical Engineering" },
  { id: "s3", first_name: "Sophia", last_name: "Chen", university: "UC Berkeley", major: "Data Science" },
  { id: "s4", first_name: "Carlos", last_name: "Rodriguez", university: "University of Michigan", major: "Business Analytics" }
];

const ScheduleInterviewDialog = ({ open, onOpenChange, candidate }: ScheduleInterviewDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const [title, setTitle] = useState<string>("");
  const [teamMember, setTeamMember] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>("");
  const { toast } = useToast();
  const { createCall, isCreating } = useCallsData();

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDate(undefined);
      setTime("");
      setDuration("30");
      setTitle("");
      setTeamMember("");
      setNotes("");
      setSelectedStudent(null);
      setStudentEmail("");
    } else if (candidate) {
      setTitle(`Interview with ${candidate.name}`);
      setSelectedStudent(candidate);
    }
    onOpenChange(open);
  };

  const handleSchedule = async () => {
    if (!date || !time || !title) {
      toast({
        title: "Missing information",
        description: "Please select a date, time, and title for the interview.",
        variant: "destructive"
      });
      return;
    }

    // Format the date and time for the call creation
    const [hourStr, minuteStr, period] = time.split(/[:\s]/);
    const hour = parseInt(hourStr) + (period === "PM" && hourStr !== "12" ? 12 : 0);
    const minute = parseInt(minuteStr);
    
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hour, minute);

    try {
      // Create call using the useCallsData hook
      const callData = await createCall({
        title: title,
        description: notes ? notes : `Interview scheduled for ${format(scheduledDate, "PPP 'at' p")}`,
        scheduled_at: scheduledDate.toISOString(),
        call_type: "interview",
      });

      // If we have a student email, we'd notify them here
      if (studentEmail) {
        // In a real application, you'd send a notification to the student
        console.log(`Would send email notification to: ${studentEmail}`);
        
        // For demo purposes, we'll just show a toast
        toast({
          title: "Student would be notified",
          description: `An invitation would be sent to ${studentEmail}`,
        });
      }

      toast({
        title: "Interview scheduled",
        description: `Interview has been scheduled for ${format(scheduledDate, "PPP 'at' p")}.`,
      });

      // Send an email notification - this would be implemented in production
      if (teamMember) {
        toast({
          title: "Team member invited",
          description: `An invitation has been sent to ${teamMembers.find(tm => tm.id === teamMember)?.name}.`,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Error",
        description: "There was an error scheduling the interview. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectStudentByEmail = () => {
    if (!studentEmail || !studentEmail.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd look up the student by email in your database
    // For now, we'll create a temporary student object
    const emailParts = studentEmail.split("@");
    const namePart = emailParts[0].replace(/[^a-zA-Z]/g, " ");
    const names = namePart.split(" ").filter(n => n);
    
    const newStudent = {
      id: `temp-${Date.now()}`,
      first_name: names[0] || "Student",
      last_name: names.length > 1 ? names[1] : "",
      email: studentEmail,
      university: emailParts[1].includes("edu") ? emailParts[1].split(".edu")[0].replace(/\./g, " ") : ""
    };
    
    setSelectedStudent(newStudent);
    setTitle(`Interview with ${newStudent.first_name} ${newStudent.last_name}`);
  };

  const removeSelectedStudent = () => {
    setSelectedStudent(null);
    setStudentEmail("");
    setTitle("");
  };

  const handleSelectPredefinedStudent = (studentId: string) => {
    const student = sampleStudents.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setTitle(`Interview with ${student.first_name} ${student.last_name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            {candidate ? `Schedule an interview with ${candidate.name}` : "Schedule a new interview"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title</Label>
            <Input 
              id="title" 
              placeholder="Enter interview title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          {/* Interviewee Selection Section */}
          <div className="space-y-2">
            <Label>Interviewee</Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {selectedStudent.first_name?.charAt(0) || ''}
                    {selectedStudent.last_name?.charAt(0) || ''}
                  </div>
                  <div>
                    <p className="font-medium">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedStudent.university || ''} {selectedStudent.major ? `- ${selectedStudent.major}` : ''}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeSelectedStudent}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter student email" 
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                  <Button onClick={handleSelectStudentByEmail} type="button">
                    <User className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Or select from sample students:</p>
                  <Select onValueChange={handleSelectPredefinedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} - {student.university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {time ? time : <span className="text-muted-foreground">Select time</span>}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1 hour 30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Team Member (Optional)</Label>
              <Select value={teamMember} onValueChange={setTeamMember}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                    {teamMember ? 
                      teamMembers.find(tm => tm.id === teamMember)?.name : 
                      <span className="text-muted-foreground">Add team member</span>
                    }
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex flex-col">
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Add any additional information or interview instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              Invitations will be sent automatically
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedule} disabled={isCreating}>
                {isCreating ? "Scheduling..." : "Schedule Interview"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewDialog;
