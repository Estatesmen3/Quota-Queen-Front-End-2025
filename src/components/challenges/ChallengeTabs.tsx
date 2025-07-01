
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChallengeOverview } from "./ChallengeOverview";
import { ProspectDetails } from "./ProspectDetails";
import { ChallengeNotes } from "./ChallengeNotes";
import { SponsoredChallenge } from "@/types/challenges";

interface ChallengeTabsProps {
  challenge: SponsoredChallenge;
  notes: string;
  setNotes: (notes: string) => void;
}

export const ChallengeTabs = ({ challenge, notes, setNotes }: ChallengeTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
        <TabsTrigger value="background" className="flex-1">Prospect Background</TabsTrigger>
        <TabsTrigger value="your-notes" className="flex-1">Your Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <ChallengeOverview challenge={challenge} />
      </TabsContent>
      
      <TabsContent value="background">
        <ProspectDetails challenge={challenge} />
      </TabsContent>
      
      <TabsContent value="your-notes">
        <ChallengeNotes notes={notes} setNotes={setNotes} />
      </TabsContent>
    </Tabs>
  );
};
