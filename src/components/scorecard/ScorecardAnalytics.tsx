
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ScorecardAnalyticsProps {
  talkListenRatio: number;
  fillerWords: number;
  talkSpeed: number;
  longestMonologue: string;
}

export const ScorecardAnalytics = ({
  talkListenRatio,
  fillerWords,
  talkSpeed,
  longestMonologue,
}: ScorecardAnalyticsProps) => {
  const getMetricStatus = (value: number, type: 'ratio' | 'filler' | 'speed') => {
    switch (type) {
      case 'ratio':
        return value < 40 ? "Good" : value < 60 ? "Average" : "Below average";
      case 'filler':
        return value < 2 ? "Good" : value < 3 ? "Average" : "Below average";
      case 'speed':
        return value > 130 && value < 150 ? "Good" : value < 130 ? "Below average" : "Average";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "text-green-600";
      case "Average":
        return "text-yellow-600";
      case "Below average":
        return "text-red-600";
      default:
        return "";
    }
  };

  const gradientClasses = [
    "dopamine-gradient-1",
    "dopamine-gradient-2", 
    "dopamine-gradient-3"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { 
          title: "Talk/Listen Ratio", 
          value: `${talkListenRatio}%`, 
          status: getMetricStatus(talkListenRatio, 'ratio'),
          gradientClass: gradientClasses[0]
        },
        { 
          title: "Filler Words", 
          value: `${fillerWords} wpm`, 
          status: getMetricStatus(fillerWords, 'filler'),
          gradientClass: gradientClasses[1]
        },
        { 
          title: "Talk Speed", 
          value: `${talkSpeed} wpm`, 
          status: getMetricStatus(talkSpeed, 'speed'),
          gradientClass: gradientClasses[2]
        },
        { 
          title: "Longest Monologue", 
          value: longestMonologue, 
          status: "Below average",
          gradientClass: "dopamine-gradient-1"
        }
      ].map(({ title, value, status, gradientClass }, index) => (
        <div 
          key={title} 
          className={cn(
            "relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out"
          )}
        >
          <div className={cn(
            "absolute top-0 left-0 w-full h-2", 
            gradientClass
          )} />
          <div className="bg-white rounded-lg p-4 pt-6 h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explanation for {title.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className={cn("text-sm mt-1", getStatusColor(status))}>
              {status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
