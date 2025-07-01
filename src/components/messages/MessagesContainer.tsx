
import { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useVideoCall } from "@/context/VideoCallContext";
import { useMessageUtils } from "@/context/MessageUtilsContext";
import { Message } from "@/types/messages";
import { useLocation } from "react-router-dom";
import ConversationList from "./ConversationList";
import MessageDisplay from "./MessageDisplay";
import MessageInput from "./MessageInput";
import EmptyConversation from "./EmptyConversation";
import ActiveVideoCall from "./ActiveVideoCall";

interface MessagesContainerProps {
  currentTab: "all" | "students" | "internal";
  setCurrentTab: (tab: "all" | "students" | "internal") => void;
}

// Memoize components that don't need to re-render often
const MemoizedMessageDisplay = memo(MessageDisplay);
const MemoizedEmptyConversation = memo(EmptyConversation);

const MessagesContainer = ({ currentTab, setCurrentTab }: MessagesContainerProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { callState } = useVideoCall();
  const location = useLocation();
  const { 
    formatTime, 
    handleEditMessage, 
    messages, 
    setMessages,
    conversations,
    setConversations,
    activeConversation, 
    setActiveConversation
  } = useMessageUtils();

  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine user role
  const userRole = profile?.user_type || (user?.email?.endsWith('.edu') ? 'student' : 'recruiter');

  // Filter conversations based on user role
  const roleFilteredConversations = conversations?.filter(conversation => {
    // Students should only see messages from recruiters
    if (userRole === 'student') {
      return conversation.with_user_type === 'recruiter';
    }
    // Recruiters should only see messages from students
    else if (userRole === 'recruiter') {
      return conversation.with_user_type === 'student';
    }
    return true;
  });

  // Extract userId from URL parameter if present (for direct message)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const directMessageUserId = searchParams.get('userId');
    
    if (directMessageUserId && roleFilteredConversations && roleFilteredConversations.length > 0) {
      const targetConversation = roleFilteredConversations.find(c => c.with_user_id === directMessageUserId);
      if (targetConversation) {
        setActiveConversation(targetConversation);
        
        // Set appropriate tab based on user type
        if (targetConversation.with_user_type === "student") {
          setCurrentTab("students");
        } else if (targetConversation.with_user_type === "recruiter") {
          setCurrentTab("internal");
        }
      }
    }
  }, [location.search, roleFilteredConversations, setActiveConversation, setCurrentTab]);

  // Use useCallback to memoize this function
  const handleSendMessage = useCallback((content: string, file?: File) => {
    if (!activeConversation || !user) {
      toast({
        title: "Cannot send message",
        description: "No active conversation or user found",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim() && !file) {
      toast({
        title: "Cannot send message",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setSendingMessage(true);
    
    try {
      // If a file is attached, just create a placeholder message for now
      // The actual message with file URL will be updated when the upload completes
      const hasAttachment = !!file;
      const contentToShow = content.trim() || (file ? `Sending file: ${file.name}...` : "");
      
      const newMsg: Message = {
        id: `m${Date.now()}`,
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: contentToShow,
        created_at: new Date().toISOString(),
        is_read: false,
        file_name: file?.name,
        has_attachment: hasAttachment
      };
      
      // Add the new message to the messages array
      setMessages(prev => [...prev, newMsg]);
      
      if (conversations) {
        const currentConvIndex = conversations.findIndex(c => c.id === activeConversation.id);
        
        if (currentConvIndex !== -1) {
          const updatedConversations = [...conversations];
          const updatedConv = {
            ...conversations[currentConvIndex],
            last_message: contentToShow,
            last_message_time: new Date().toISOString(),
            has_attachment: hasAttachment
          };
          updatedConversations.splice(currentConvIndex, 1);
          updatedConversations.unshift(updatedConv);
          setConversations(updatedConversations);
          setActiveConversation(updatedConv);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  }, [activeConversation, user, toast, setMessages, conversations, setConversations, setActiveConversation]);

  return (
    <div className="flex-1 flex">
      <ConversationList
        conversations={roleFilteredConversations || []}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
      />
      
      <div className="hidden md:flex flex-1 flex-col">
        {callState.isInCall ? (
          <ActiveVideoCall />
        ) : activeConversation ? (
          <>
            <MemoizedMessageDisplay 
              activeConversation={activeConversation}
              messages={messages || []}
              formatTime={formatTime}
              onEditMessage={handleEditMessage}
              userRole={userRole}
            />
            
            <MessageInput 
              handleSendMessage={handleSendMessage}
              sendingMessage={sendingMessage}
            />
          </>
        ) : (
          <MemoizedEmptyConversation />
        )}
      </div>
    </div>
  );
};

export default MessagesContainer;
