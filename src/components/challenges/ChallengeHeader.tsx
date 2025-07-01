
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ChallengeHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button variant="outline" onClick={() => navigate("/explore")} className="mb-6">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Competitions
    </Button>
  );
};
