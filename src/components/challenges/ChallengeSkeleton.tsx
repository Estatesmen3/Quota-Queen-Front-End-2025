
import { Card, CardContent } from "@/components/ui/card";

export const ChallengeSkeleton = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <p className="text-muted-foreground">Loading challenge details...</p>
    </div>
  );
};
