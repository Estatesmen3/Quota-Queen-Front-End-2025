
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video, User, Briefcase } from "lucide-react";
import { Conversation } from "@/types/messages";
import { useVideoCall } from "@/context/VideoCallContext";
import { Link } from "react-router-dom";

interface ConversationHeaderProps {
  activeConversation: Conversation;
  userRole: "student" | "recruiter";
}

const ConversationHeader = ({ activeConversation, userRole }: ConversationHeaderProps) => {
  const { callState, initiateCall } = useVideoCall();

  const getUserTypeColor = (userType: "student" | "recruiter") => {
    return userType === "student" ? "text-purple-600" : "text-blue-600";
  };

  // Determine the profile view link based on user role and conversation participant
  const getProfileViewLink = () => {
    if (userRole === "recruiter" && activeConversation.with_user_type === "student") {
      return `/recruiter/student/${activeConversation.with_user_id}`;
    } else if (userRole === "student" && activeConversation.with_user_type === "recruiter") {
      // Students viewing recruiters may need a different path
      return `/student/recruiter/${activeConversation.with_user_id}`;
    } else {
      // Default case - use role-based URL structure
      return `/${userRole}/profile/${activeConversation.with_user_id}`;
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="mr-3">
          <AvatarImage src={activeConversation.with_user_avatar} />
          <AvatarFallback className={activeConversation.with_user_type === "student" ? "bg-purple-100" : "bg-blue-100"}>
            {activeConversation.with_user_name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <h3 className={`font-medium ${getUserTypeColor(activeConversation.with_user_type)}`}>
              {activeConversation.with_user_name}
            </h3>
            {activeConversation.with_user_type === "student" && (
              <User className="h-4 w-4 ml-1.5 text-purple-500" />
            )}
            {activeConversation.with_user_type === "recruiter" && (
              <Briefcase className="h-4 w-4 ml-1.5 text-blue-500" />
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => initiateCall(activeConversation)}
          disabled={callState.initiatingCall || callState.isInCall}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          {callState.initiatingCall ? (
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={getProfileViewLink()}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
