import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import apiClient from "../../../apiClient";
import { useToast } from "@/hooks/use-toast";
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import DownloadReportPDF from "./DownloadReport";
import { Button } from "../ui/button";

export const ScorecardRubric = () => {
  const { toast } = useToast();
  const [activeResult, setActiveResult] = useState<{ 
    result_score: Record<string, any>, 
    payload: any, 
    timestamp?: string 
  } | null>(null);
  
  const [historyResults, setHistoryResults] = useState<Array<{ 
    result_score: Record<string, any>, 
    payload: any, 
    timestamp: string 
  }>>([]);
  
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
      setActiveResult({
        result_score: data?.result?.result_score || {},
        payload: data?.result?.payload?.report || {}
      });
    } catch (e: any) {
      toast({
        title: "Failed to get result",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const fetchResultHistory = async () => {
    try {
      setLoadingHistory(true);
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
      const userId = tokenObject?.user?.id;

      const res = await apiClient.get(`api/scorecard/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      const results = data.results || [];
      
      // Format and sort results (newest first)
      const formattedResults = results.map((r: any) => ({
        result_score: r.result_score,
        payload: r.payload?.report || {},
        timestamp: r.timestamp
      })).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setHistoryResults(formattedResults);
    } catch (e: any) {
      toast({
        title: "Failed to get history",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
      throw e;
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  const toggleHistory = async () => {
    if (!showHistory) {
      try {
        await fetchResultHistory();
        setShowHistory(true);
      } catch (e) {
        // Error already handled in fetchResultHistory
      }
    } else {
      setShowHistory(false);
    }
  };

  const handleSelectHistory = (result: { 
    result_score: Record<string, any>, 
    payload: any, 
    timestamp: string 
  }) => {
    setActiveResult(result);

    console.log("result? 1 ", result)

    console.log("result?.result_score 1 ", result?.result_score)
    console.log("result?.payload?.report 1 ", result?.payload)

    setActiveResult({
      result_score: result?.result_score || {},
      payload: result?.payload || {}
    });
  
    setShowHistory(false);
  };

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

  const resultScoreRaw = activeResult?.result_score || {};
  const isEmpty = Object.keys(resultScoreRaw).length === 0;

  const parsedCategories = Object.entries(resultScoreRaw).map(([name, data]: any) => {
    const percentage = parseFloat(data.Percentage ?? "0");
    const weight = parseFloat(data.weight?.replace("%", "") || "0");
    return { name, ...data, percentage, weight };
  });

  const totalScore = parsedCategories.reduce((sum, cat) => sum + cat.percentage, 0);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative rounded-lg border-2 border-transparent">
      <div className={cn(
        "absolute top-0 left-0 w-full h-2 rounded-t-lg",
        "dopamine-gradient-1"
      )} />

      <div className="space-y-6 relative pb-16 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button
              className={"glow-on-hover w-full"} 
              onClick={toggleHistory}
            >
              Previous Results
            </Button>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-semibold">Scoring Rubric</h2>
          </div>
          <div>
            {!isEmpty && <DownloadReportPDF report={activeResult?.payload} />}
          </div>
        </div>

        {showHistory ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Select a Result</h3>
            
            {loadingHistory ? (
              <div className="text-center py-8">
                <p>Loading history...</p>
              </div>
            ) : historyResults.length === 0 ? (
              <div className="text-center py-8">
                <p>No historical results found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                {historyResults.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                      activeResult?.timestamp === result.timestamp
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    )}
                    onClick={() => handleSelectHistory(result)}
                  >
                    <div className="font-medium">
                      Result #{historyResults.length - index}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(result.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : isEmpty ? (
          <div className="text-center text-gray-500 text-lg">
            Your result is awaited.
          </div>
        ) : (
          <>
            {activeResult?.timestamp && (
              <div className="text-center text-sm text-gray-500 mb-4">
                {formatDate(activeResult.timestamp)}
              </div>
            )}
            
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
                      Score: {cat.score} | Weight: {cat.weight} | Percentage: {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {cat.score}
                  </Badge>
                </div>
              ))}
            </div>

            {totalScore !== null && (
              <div className="absolute bottom-0 right-0 m-4">
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
          </>
        )}
      </div>
    </div>
  );
};