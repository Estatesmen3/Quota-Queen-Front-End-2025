
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, PlayCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import UploadVideoDialog from "./UploadVideoDialog";

const PerformanceLibrary: React.FC = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock data for the library entries
  const libraryEntries = [
    {
      id: "1",
      title: "Cold Call Practice",
      time: "2 days ago",
      aiScore: 87,
      hasAIAnalysis: true
    },
    {
      id: "2",
      title: "Discovery Call Demo",
      time: "1 week ago",
      aiScore: 92,
      hasAIAnalysis: true
    }
  ];

  const handleVideoUploaded = () => {
    // We would refresh the library entries here
    console.log("Video uploaded successfully");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Performance Library</CardTitle>
          <CardDescription>
            Your recorded calls and practice sessions
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {libraryEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Video className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-sm font-medium">No recordings yet</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Upload a call recording or complete a roleplay session
            </p>
            <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(true)}>
              Upload Video
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {libraryEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <PlayCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{entry.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {entry.time}
                  </div>
                </div>
                <div className="shrink-0 flex items-center space-x-2">
                  {entry.hasAIAnalysis && (
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      AI: {entry.aiScore}%
                    </div>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/performance/${entry.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/performance-library">View All</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <UploadVideoDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onVideoUploaded={handleVideoUploaded}
      />
    </Card>
  );
};

export default PerformanceLibrary;
