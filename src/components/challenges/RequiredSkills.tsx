
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredSkills } from "./utils";

interface RequiredSkillsProps {
  difficulty: string;
}

export const RequiredSkills = ({ difficulty }: RequiredSkillsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Required Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {getRequiredSkills(difficulty).map((skill, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
