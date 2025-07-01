
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ChallengeNotFound = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center gap-4">
          <Info className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Challenge Not Found</h2>
          <p className="text-muted-foreground">
            The challenge you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/explore")} className="mt-4">
            Browse Challenges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
