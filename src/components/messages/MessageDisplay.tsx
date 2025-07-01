
import { useAuth } from "@/context/AuthContext";
import { Conversation, Message } from "@/types/messages";
import ConversationHeader from "./ConversationHeader";
import MessageItem from "./MessageItem";

interface MessageDisplayProps {
  activeConversation: Conversation;
  messages: Message[];
  formatTime: (timestamp: string) => string;
  onEditMessage: (messageId: string, newContent: string) => void;
  userRole: "student" | "recruiter";
}

const MessageDisplay = ({
  activeConversation,
  messages,
  formatTime,
  onEditMessage,
  userRole
}: MessageDisplayProps) => {
  const { user } = useAuth();

  const getUserTypeColor = (userType: string) => {
    return userType === "student" ? "student" : "recruiter";
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No conversation selected</p>
      </div>
    );
  }

  return (
    <>
      <ConversationHeader 
        activeConversation={activeConversation} 
        userRole={userRole}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = user && message.sender_id === user.id;
            
            return (
              <MessageItem 
                key={message.id}
                message={message}
                isCurrentUser={!!isCurrentUser}
                userTypeColor={getUserTypeColor(isCurrentUser ? userRole : activeConversation.with_user_type)}
                formatTime={formatTime}
                onEditMessage={onEditMessage}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageDisplay;
