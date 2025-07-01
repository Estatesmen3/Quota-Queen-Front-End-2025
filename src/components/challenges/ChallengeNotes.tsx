
import { Textarea } from "@/components/ui/textarea";

interface ChallengeNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const ChallengeNotes = ({ notes, setNotes }: ChallengeNotesProps) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-3">Preparation Notes</h3>
      <Textarea 
        placeholder="Add your preparation notes here before starting the challenge..."
        className="mb-3 min-h-[200px]"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <p className="text-sm text-muted-foreground italic">
        These notes are just for your reference and won't be shared or saved.
      </p>
    </div>
  );
};
