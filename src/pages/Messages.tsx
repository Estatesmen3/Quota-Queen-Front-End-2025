
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useToast } from "@/hooks/use-toast";
import { Conversation, Message } from "@/types/messages";
import { VideoCallProvider } from "@/context/VideoCallContext";
import { MessageUtilsProvider } from "@/context/MessageUtilsContext";
import MessagesHeader from "@/components/messages/MessagesHeader";
import MessagesContainer from "@/components/messages/MessagesContainer";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const isRecruiter = profile?.user_type === "recruiter";
  const Layout = isRecruiter ? RecruiterLayout : DashboardLayout;
  
  // Extract userId from URL param if present (for direct message)
  const searchParams = new URLSearchParams(location.search);
  const directMessageUserId = searchParams.get('userId');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [currentTab, setCurrentTab] = useState<"all" | "students" | "internal">("all");

  useEffect(() => {
    // For recruiters, show both student and internal messages
    if (isRecruiter) {
      const mockStudentConversations: Conversation[] = [
        {
          id: "1",
          with_user_id: "user123",
          with_user_name: "Sarah Johnson",
          with_user_avatar: "https://i.pravatar.cc/150?img=1",
          with_user_type: "student",
          last_message: "Thanks for your help with the sales pitch!",
          last_message_time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          unread_count: 2
        },
        {
          id: "2",
          with_user_id: "user456",
          with_user_name: "James Wilson",
          with_user_avatar: "https://i.pravatar.cc/150?img=2",
          with_user_type: "student",
          last_message: "I'd like to schedule a meeting to discuss the opportunity",
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          unread_count: 0
        },
        {
          id: "3",
          with_user_id: "user789",
          with_user_name: "Emily Rodriguez",
          with_user_type: "student",
          last_message: "Do you have time to review my presentation tomorrow?",
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          unread_count: 0
        }
      ];
      
      const mockInternalConversations: Conversation[] = [
        {
          id: "internal1",
          with_user_id: "rec123",
          with_user_name: "Alex Thompson",
          with_user_avatar: "https://i.pravatar.cc/150?img=11",
          with_user_type: "recruiter",
          last_message: "Have you reviewed Sarah's latest performance? She'd be great for the TechCorp role.",
          last_message_time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          unread_count: 1
        },
        {
          id: "internal2",
          with_user_id: "rec456",
          with_user_name: "Taylor Chen",
          with_user_avatar: "https://i.pravatar.cc/150?img=12",
          with_user_type: "recruiter",
          last_message: "Let's sync up on the new assessment structure tomorrow morning.",
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          unread_count: 0
        }
      ];
      
      setConversations([...mockStudentConversations, ...mockInternalConversations]);
      
      // Set initial current tab
      if (directMessageUserId) {
        // If there's a direct message link with a student ID, set tab to students
        const studentIds = mockStudentConversations.map(c => c.with_user_id);
        if (studentIds.includes(directMessageUserId)) {
          setCurrentTab("students");
        }
      }
    } else {
      // For students, only show recruiters
      const mockRecruiterConversations: Conversation[] = [
        {
          id: "4",
          with_user_id: "comp101",
          with_user_name: "TechCorp Recruiting",
          with_user_avatar: "https://i.pravatar.cc/150?img=4",
          with_user_type: "recruiter",
          last_message: "We'd like to schedule an interview for the Sales Development position",
          last_message_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          unread_count: 1
        },
        {
          id: "5",
          with_user_id: "comp202",
          with_user_name: "Innovate Inc.",
          with_user_avatar: "https://i.pravatar.cc/150?img=5",
          with_user_type: "recruiter",
          last_message: "Your application for the Marketing Specialist role has been received",
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          unread_count: 0
        }
      ];
      
      setConversations(mockRecruiterConversations);
    }
  }, [isRecruiter, directMessageUserId]);

  // Handle direct message linking
  useEffect(() => {
    if (directMessageUserId && conversations.length > 0) {
      const targetConversation = conversations.find(c => c.with_user_id === directMessageUserId);
      if (targetConversation) {
        setActiveConversation(targetConversation);
      }
    }
  }, [directMessageUserId, conversations]);

  useEffect(() => {
    if (activeConversation) {
      // For internal conversations
      if (activeConversation.with_user_type === "recruiter") {
        const mockInternalMessages: Message[] = [
          {
            id: "im1",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: "Hey there, do you have a moment to discuss some candidates?",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            is_read: true
          },
          {
            id: "im2",
            conversation_id: activeConversation.id,
            sender_id: user?.id || "",
            content: "Sure, I'm free now. What's up?",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.9).toISOString(),
            is_read: true
          },
          {
            id: "im3",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: "I've been reviewing the latest batch of student performances and there are a few standouts we should consider for the enterprise sales position.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.8).toISOString(),
            is_read: true
          },
          {
            id: "im4",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: activeConversation.last_message,
            created_at: activeConversation.last_message_time,
            is_read: activeConversation.unread_count === 0
          }
        ];
        setMessages(mockInternalMessages);
      } else {
        // For student conversations
        const mockMessages: Message[] = [
          {
            id: "m1",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: "Hi there! I saw your profile and I'm impressed with your sales experience.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            is_read: true
          },
          {
            id: "m2",
            conversation_id: activeConversation.id,
            sender_id: user?.id || "",
            content: "Thank you! I've been working hard on improving my skills through the challenges.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
            is_read: true
          },
          {
            id: "m3",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: "Your performance on the HubSpot challenge was particularly impressive.",
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            is_read: true
          },
          {
            id: "m4",
            conversation_id: activeConversation.id,
            sender_id: activeConversation.with_user_id,
            content: activeConversation.last_message,
            created_at: activeConversation.last_message_time,
            is_read: activeConversation.unread_count === 0
          }
        ];
        setMessages(mockMessages);
      }
    }
  }, [activeConversation, user?.id]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    // Find and update the message
    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, is_edited: true } 
        : msg
    );
    
    setMessages(updatedMessages);
    
    // If it's the last message in the conversation, update the conversation preview too
    const lastMessage = updatedMessages[updatedMessages.length - 1];
    if (lastMessage.id === messageId && activeConversation) {
      const updatedConversations = conversations.map(conv => 
        conv.id === activeConversation.id
          ? { ...conv, last_message: newContent }
          : conv
      );
      
      setConversations(updatedConversations);
      setActiveConversation(prev => prev ? { ...prev, last_message: newContent } : null);
    }
    
    toast({
      title: "Message updated",
      description: "Your message has been edited successfully"
    });
  };

  const messageUtilsValue = {
    formatTime,
    handleEditMessage,
    messages,
    setMessages,
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation
  };

  return (
    <VideoCallProvider>
      <MessageUtilsProvider value={messageUtilsValue}>
        <Layout>
          <div className="flex-1 flex flex-col">
            <MessagesHeader />
            <MessagesContainer 
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          </div>
        </Layout>
      </MessageUtilsProvider>
    </VideoCallProvider>
  );
};

export default Messages;
