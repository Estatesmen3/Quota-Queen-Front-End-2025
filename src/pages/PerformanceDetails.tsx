
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import AIAnalysis from "@/components/calls/AIAnalysis";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const PerformanceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("recording");
  const [callData, setCallData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch call data from Supabase
  useEffect(() => {
    const fetchCallData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("performance_library")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        setCallData(data);
      } catch (error) {
        console.error("Error fetching call data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCallData();
  }, [id]);

  // This would be fetched from the API in a real implementation
  const performanceData = {
    id: id || "1",
    title: callData?.title || "Cold Call Practice - Technology Industry",
    date: callData?.created_at ? new Date(callData.created_at).toLocaleDateString() : "October 15, 2023",
    duration: "12:34",
    videoUrl: callData?.video_url || "https://example.com/video.mp4", // Would point to Supabase Storage
    transcript: [
      { speaker: "You", text: "Hi, this is Alex from Quota Queen. Do you have a moment to talk about optimizing your sales process?" },
      { speaker: "Prospect", text: "I'm actually a bit busy at the moment. What's this regarding?" },
      { speaker: "You", text: "I understand you're busy. We help companies increase their sales pipeline by 30% through AI-powered coaching. When would be a better time to discuss how we could help your team?" },
      { speaker: "Prospect", text: "We're actually pretty happy with our current sales metrics, but you can send me some information by email." },
      { speaker: "You", text: "I appreciate that. Many of our current clients were satisfied with their metrics too, until they saw what was possible with our platform. I'd love to show you a quick 3-minute demo that specifically addresses challenges in the technology industry. Would tomorrow at 2pm work?" },
      { speaker: "Prospect", text: "Alright, I can spare 15 minutes tomorrow at 2pm." },
      { speaker: "You", text: "Perfect! I'll send you a calendar invite. I'm really looking forward to showing you how we've helped companies like yours improve their sales performance." }
    ]
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/performance-library">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{performanceData.title}</h1>
              <p className="text-muted-foreground">
                {performanceData.date} • {performanceData.duration}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recording" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recording">Recording</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recording" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <video 
                    controls 
                    className="w-full h-full" 
                    poster="/placeholder.svg"
                  >
                    <source src={performanceData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-4">
            <AIAnalysis callData={callData} />
          </TabsContent>
          
          <TabsContent value="transcript" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {performanceData.transcript.map((entry, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 shrink-0 font-medium text-sm">
                        {entry.speaker}:
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PerformanceDetails;
