
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, Mail, MapPin, GraduationCap, Calendar, Briefcase, 
  Linkedin, Award, BookOpen, Code
} from "lucide-react";

interface StudentOverviewProps {
  studentProfile: any;
}

const StudentOverview: React.FC<StudentOverviewProps> = ({ studentProfile }) => {
  if (!studentProfile) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Student Overview</CardTitle>
          <CardDescription>Loading student information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Full Name:</span>
                <span className="ml-2">{studentProfile.first_name} {studentProfile.last_name}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">
                  {studentProfile.email || "Not available"}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">University:</span>
                <span className="ml-2">{studentProfile.university || "Not specified"}</span>
              </div>
              
              {studentProfile.graduation_year && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Graduation Year:</span>
                  <span className="ml-2">{studentProfile.graduation_year}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Major:</span>
                <span className="ml-2">{studentProfile.major || "Not specified"}</span>
              </div>
              
              {studentProfile.linkedin_url && (
                <div className="flex items-center text-sm">
                  <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">LinkedIn:</span>
                  <a 
                    href={studentProfile.linkedin_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {studentProfile.bio && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">{studentProfile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Skills Card */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {studentProfile.skills && studentProfile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {studentProfile.skills.map((skill: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No skills listed</div>
          )}
        </CardContent>
      </Card>
      
      {/* Assessment Scores Card */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm">
                  {studentProfile.confidence_score || 0}%
                </span>
              </div>
              <Progress 
                value={studentProfile.confidence_score || 0} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Persuasion</span>
                <span className="text-sm">
                  {studentProfile.persuasion_score || 0}%
                </span>
              </div>
              <Progress 
                value={studentProfile.persuasion_score || 0} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Objection Handling</span>
                <span className="text-sm">
                  {studentProfile.objection_score || 0}%
                </span>
              </div>
              <Progress 
                value={studentProfile.objection_score || 0} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOverview;
