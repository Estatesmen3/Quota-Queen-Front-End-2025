
import { createContext, useContext, ReactNode } from "react";
import { Conversation, Message } from "@/types/messages";

interface MessageUtilsContextType {
  formatTime: (timestamp: string) => string;
  handleEditMessage: (messageId: string, newContent: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  activeConversation: Conversation | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

const MessageUtilsContext = createContext<MessageUtilsContextType | undefined>(undefined);

export const useMessageUtils = () => {
  const context = useContext(MessageUtilsContext);
  if (context === undefined) {
    throw new Error("useMessageUtils must be used within a MessageUtilsProvider");
  }
  return context;
};

export const MessageUtilsProvider = ({ 
  children,
  value
}: { 
  children: ReactNode;
  value: MessageUtilsContextType;
}) => {
  return (
    <MessageUtilsContext.Provider value={value}>
      {children}
    </MessageUtilsContext.Provider>
  );
};
