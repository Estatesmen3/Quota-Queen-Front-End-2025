
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ChallengeStatsProps {
  onStartChallenge: () => void;
}

export const ChallengeStats = ({ onStartChallenge }: ChallengeStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Challenge Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Success Rate</span>
          <span className="font-medium">62%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Average Score</span>
          <span className="font-medium">78/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Top Performers</span>
          <span className="font-medium">23 students</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Your Previous Score</span>
          <span className="font-medium">-</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="text-center">
          <Button onClick={onStartChallenge} className="w-full mt-3" size="sm">
            <ClipboardList className="mr-2 h-3 w-3" />
            View Scorecard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
