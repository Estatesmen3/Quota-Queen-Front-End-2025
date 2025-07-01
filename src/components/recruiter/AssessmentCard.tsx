
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileSpreadsheet, Users, BarChart3 } from "lucide-react";

type AssessmentCardProps = {
  assessment: {
    id: string;
    title: string;
    description: string;
    created: string;
    completions?: number;
    avgScore?: number;
    skillsEvaluated: string[];
  };
  type: "active" | "draft";
};

const AssessmentCard = ({ assessment, type }: AssessmentCardProps) => {
  const getModelIcon = () => {
    // Simple placeholder function - in a real app, you'd determine this based on the model type
    return <Brain className="h-5 w-5 text-primary" />;
  };

  return (
    <Card key={assessment.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{assessment.title}</CardTitle>
            <CardDescription className="mt-1">{assessment.description}</CardDescription>
          </div>
          {getModelIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {assessment.skillsEvaluated.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
          {assessment.skillsEvaluated.length > 3 && (
            <Badge variant="outline">+{assessment.skillsEvaluated.length - 3} more</Badge>
          )}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Created: {assessment.created}</span>
          {type === "active" ? (
            <>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {assessment.completions || 0}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" /> {assessment.avgScore || 0}%
              </span>
            </>
          ) : (
            <span>Draft</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {type === "active" ? (
          <>
            <Button variant="outline" size="sm">View Results</Button>
            <Button size="sm">Assign to Candidates</Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm">Edit</Button>
            <Button size="sm">Publish</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
