
import { Info } from "lucide-react";
import { SponsoredChallenge } from "@/types/challenges";

interface ChallengeOverviewProps {
  challenge: SponsoredChallenge;
}

export const ChallengeOverview = ({ challenge }: ChallengeOverviewProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Call Context</h3>
        <p className="text-sm text-muted-foreground">
          {challenge.call_info}
        </p>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Your Objective</h3>
        <p className="text-sm text-muted-foreground">
          As a salesperson for {challenge.company_name}, your goal is to effectively communicate the value of {challenge.product_name} to the prospect and navigate the conversation strategically.
        </p>
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        <h4 className="font-medium flex items-center mb-2">
          <Info className="h-4 w-4 mr-2 text-muted-foreground" />
          Challenge Tips
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
          <li>Research the company and product before starting</li>
          <li>Identify key pain points for the target customer</li>
          <li>Prepare concise value propositions</li>
          <li>Practice objection handling techniques</li>
        </ul>
      </div>
    </div>
  );
};
