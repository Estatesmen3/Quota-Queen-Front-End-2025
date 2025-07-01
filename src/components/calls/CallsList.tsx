
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Mic, Phone, Calendar, VideoIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCallsData } from "@/hooks/useCallsData";
import { FixedSizeList as List } from "react-window";
import { Call } from "@/types/calls";

interface CallsListProps {
  calls: Call[];
  isLoading: boolean;
}

const CallsList: React.FC<CallsListProps> = ({ 
  calls, 
  isLoading
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinCall, loadCalls } = useCallsData();
  const listRef = useRef<HTMLDivElement>(null);
  
  // Determine the available height for the virtualized list
  const [listHeight, setListHeight] = useState(400);
  
  useEffect(() => {
    const updateHeight = () => {
      if (listRef.current) {
        const newHeight = Math.min(
          // Set a maximum height
          500,
          // Calculate based on number of items (80px per item)
          Math.max(200, Math.min(calls.length * 80, window.innerHeight * 0.6))
        );
        setListHeight(newHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [calls.length]);

  const handleJoinCall = async (callId: string) => {
    try {
      const success = await joinCall(callId);
      if (success) {
        navigate(`/call/${callId}`);
        toast({
          title: "Joining call",
          description: "Connecting to call session...",
        });
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast({
        title: "Unable to join call",
        description: "There was a problem connecting to the call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    loadCalls();
    toast({
      title: "Refreshing calls",
      description: "Getting your latest calls...",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "Not scheduled";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getCallStatus = (call: Call) => {
    if (call.status === "in_progress") return "In progress";
    if (call.scheduled_at) {
      const scheduledTime = new Date(call.scheduled_at);
      const now = new Date();
      if (scheduledTime > now) {
        return `Scheduled for ${formatDateTime(call.scheduled_at)}`;
      } else {
        return "Ready to join";
      }
    }
    return "Ready to join";
  };
  
  const getCallIcon = (callType: string) => {
    switch(callType) {
      case 'roleplay':
        return <Mic className="h-3.5 w-3.5 mr-1" />;
      case 'video':
        return <VideoIcon className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Phone className="h-3.5 w-3.5 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading your calls...</p>
      </div>
    );
  }

  const CallItem = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const call = calls[index];
    return (
      <div
        style={style}
        className="flex items-center justify-between p-3 mx-1 my-1 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{call.title}</h4>
            {call.call_type === "roleplay" && (
              <Badge className="text-xs" variant="secondary">Roleplay</Badge>
            )}
            {call.call_type === "video" && (
              <Badge className="text-xs" variant="outline">Video</Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{getCallStatus(call)}</span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => handleJoinCall(call.id)}
          variant={call.status === "in_progress" ? "default" : "outline"}
        >
          {getCallIcon(call.call_type)}
          {call.status === "in_progress" ? "Join Now" : "Join Call"}
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          className="text-xs flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/50">
          <Phone className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium">No upcoming calls</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Schedule a new call to get started
          </p>
        </div>
      ) : (
        <div ref={listRef} className="border rounded-lg">
          <List
            height={listHeight}
            width="100%"
            itemCount={calls.length}
            itemSize={80}
          >
            {CallItem}
          </List>
        </div>
      )}
    </div>
  );
};

export default CallsList;
