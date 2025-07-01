import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import apiClient from "../../../apiClient";
import { useToast } from "@/hooks/use-toast";
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import DownloadReportPDF from "./DownloadReport";

export const ScorecardRubric = () => {
  const [scores, setScores] = useState<Record<string, any>>({});
  const [payload, setPayload] = useState<Record<string, any>>({});
  const { toast } = useToast();



  const fetchResult = async () => {
    try {
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
      const userId = tokenObject?.user?.id;

      const res = await apiClient.get(`api/scorecard/result/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      setScores(data);
      setPayload(data?.result?.payload?.report)
    } catch (e: any) {
      toast({
        title: "Failed to get result",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSectionColor = (categoryName: string) => {
    const normalized = categoryName.trim().toLowerCase();
    if (normalized.includes("rapport")) return "bg-dopamine-purple/10";
    if (normalized.includes("discovery")) return "bg-dopamine-pink/10";
    if (normalized.includes("presentation")) return "bg-dopamine-orange/10";
    if (normalized.includes("closing")) return "bg-dopamine-blue/10";
    if (normalized.includes("objection")) return "bg-dopamine-green/10";
    if (normalized.includes("communication")) return "bg-purple-100";
    if (normalized.includes("professionalism")) return "bg-blue-100";
    return "";
  };

  const resultScoreRaw = scores?.result?.result_score || {};
  const isEmpty = Object.keys(resultScoreRaw).length === 0;

  const parsedCategories = Object.entries(resultScoreRaw).map(([name, data]: any) => {
    const percentage = parseFloat(data.percentage?.replace("%", "") || "0");
    const weight = parseFloat(data.weight?.replace("%", "") || "0");
    return { name, ...data, percentage, weight };
  });

  const totalScore = parsedCategories.reduce((sum, cat) => {
    return sum + (cat.percentage * (cat.weight / 100));
  }, 0);

  return (
    <div className="relative rounded-lg border-2 border-transparent">
      <div className={cn(
        "absolute top-0 left-0 w-full h-2 rounded-t-lg",
        "dopamine-gradient-1"
      )} />
      <div className="space-y-6 relative pb-16 p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-semibold">Scoring Rubric</h2>
          </div>
          <div>
           { !isEmpty ? <DownloadReportPDF report={payload} /> : <></>}
          </div>
        </div>


        {isEmpty ? (
          <div className="text-center text-gray-500 text-lg">
            Your result is awaited.
          </div>
        ) : (
          <div className="w-full space-y-2">
            {parsedCategories.map((cat) => (
              <div
                key={cat.name}
                className={cn(
                  "mb-2 font-medium px-4 py-4 flex items-center justify-between",
                  getSectionColor(cat.name)
                )}
              >
                <div className="flex flex-col gap-1">
                  <span>{cat.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Score: {cat.score} | Weight: {cat.weight} | Percentage: {cat.percentage}%
                  </span>
                </div>
                <Badge variant="secondary">
                  {cat.percentage.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        )}

        {!isEmpty && (
          <div className="absolute bottom-0 right-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">Total Score:</span>
              <Badge
                className={cn(
                  getScoreColor(totalScore || 0),
                  "text-white text-xl px-4 py-2"
                )}
              >
                {totalScore.toFixed(1)}/100
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
