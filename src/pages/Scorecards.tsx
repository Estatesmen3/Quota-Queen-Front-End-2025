
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScorecardRubric } from "@/components/scorecard/ScorecardRubric";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScorecardAnalytics } from "@/components/scorecard/ScorecardAnalytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockScorecards } from "@/components/scorecard/mock-scorecards";

const Scorecards = () => {
  const [selectedScorecard, setSelectedScorecard] = useState(mockScorecards[0].id);

  const currentScorecard = mockScorecards.find(s => s.id === selectedScorecard) || mockScorecards[0];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Scorecards</h1>
          <Select
            value={selectedScorecard}
            onValueChange={setSelectedScorecard}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a scorecard" />
            </SelectTrigger>
            <SelectContent>
              {mockScorecards.map(scorecard => (
                <SelectItem key={scorecard.id} value={scorecard.id}>
                  {scorecard.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScorecardAnalytics
          talkListenRatio={51}
          fillerWords={1.07}
          talkSpeed={147}
          longestMonologue="00:19"
        />

        <Card className="p-6">
          <ScorecardRubric scorecard={currentScorecard} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Scorecards;
