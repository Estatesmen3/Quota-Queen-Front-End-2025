
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, User, Building, MessageSquare } from "lucide-react";
import { Conversation } from "@/types/messages";
import { FixedSizeList as List } from "react-window";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTab: "all" | "students" | "internal";
  setCurrentTab: (tab: "all" | "students" | "internal") => void;
  userRole: "student" | "recruiter";
}

const ConversationList = ({
  conversations,
  activeConversation,
  setActiveConversation,
  isLoading,
  searchQuery,
  setSearchQuery,
  currentTab,
  setCurrentTab,
  userRole
}: ConversationListProps) => {
  const { user, profile } = useAuth();
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      if (listRef.current) {
        // Calculate height based on window size and other UI elements
        const newHeight = Math.min(
          600, // Maximum height
          window.innerHeight - 200 // Adjust for headers, tabs, etc.
        );
        setListHeight(newHeight);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const getFilteredConversations = () => {
    const filtered = conversations.filter(conversation => {
      const matchesSearch = conversation.with_user_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply tab-based filtering
      let matchesUserType = true;
      if (currentTab === "students") {
        matchesUserType = conversation.with_user_type === "student";
      } else if (currentTab === "internal") {
        matchesUserType = conversation.with_user_type === "recruiter";
      }
      
      return matchesSearch && matchesUserType;
    });
    
    // Sort by most recent message
    return [...filtered].sort((a, b) => {
      return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
    });
  };

  const sortedConversations = getFilteredConversations();

  const getUserTypeColor = (userType: "student" | "recruiter") => {
    return userType === "student" ? "text-purple-600" : "text-blue-600";
  };

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

  const ConversationItem = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const conversation = sortedConversations[index];
    return (
      <div
        style={style}
        className={`p-4 hover:bg-muted/50 cursor-pointer ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
        onClick={() => setActiveConversation(conversation)}
      >
        <div className="flex items-start gap-3">
          <Avatar className="flex-shrink-0">
            <AvatarImage src={conversation.with_user_avatar} />
            <AvatarFallback className={conversation.with_user_type === "student" ? "bg-purple-100" : "bg-blue-100"}>
              {conversation.with_user_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 max-w-[70%]">
                <p className={`font-medium truncate ${getUserTypeColor(conversation.with_user_type)}`}>
                  {conversation.with_user_name}
                </p>
                {conversation.with_user_type === "student" && (
                  <User className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                )}
                {conversation.with_user_type === "recruiter" && (
                  <Building className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTime(conversation.last_message_time)}
              </span>
            </div>
            
            <div className="flex items-start justify-between mt-1">
              <p className="text-sm text-muted-foreground truncate pr-2 max-w-[85%]">
                {conversation.last_message}
              </p>
              {conversation.unread_count > 0 && (
                <Badge className="ml-auto flex-shrink-0" variant="default">
                  {conversation.unread_count}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (type: "all" | "students" | "internal") => {
    let icon = <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />;
    let title = "No conversations match your filter";
    let description = "Try a different filter or start a new conversation";
    
    if (type === "students") {
      icon = <User className="h-12 w-12 mx-auto text-purple-300" />;
      title = "No student conversations";
      description = "Start a conversation with a student";
    } else if (type === "internal") {
      icon = <Building className="h-12 w-12 mx-auto text-blue-300" />;
      title = "No internal conversations";
      description = "Start a conversation with a team member";
    }
    
    return (
      <div className="text-center py-12">
        {icon}
        <h3 className="mt-4 text-lg font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    );
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "all" | "students" | "internal");
  };

  // Determine which tabs to show based on user role
  const getTabContent = () => {
    if (userRole === 'student') {
      // Students should only see the "All" and "Internal" (recruiters) tabs
      return (
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="internal" className="flex-1 text-blue-600">
            <Building className="h-4 w-4 mr-1 text-blue-600" /> 
            Recruiters
          </TabsTrigger>
        </TabsList>
      );
    } else {
      // Recruiters should only see the "All" and "Students" tabs
      return (
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="students" className="flex-1 text-purple-600">
            <User className="h-4 w-4 mr-1 text-purple-600" /> 
            Students
          </TabsTrigger>
        </TabsList>
      );
    }
  };

  return (
    <div className="w-full md:w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full flex-1 flex flex-col"
      >
        <div className="px-4 pt-2">
          {getTabContent()}
        </div>
        
        <div className="flex-1 overflow-hidden" ref={listRef}>
          <TabsContent value="all" className="mt-0 h-full">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : sortedConversations.length > 0 ? (
              <List
                height={listHeight}
                width="100%"
                itemCount={sortedConversations.length}
                itemSize={90} // Adjust based on your item height
              >
                {ConversationItem}
              </List>
            ) : (
              renderEmptyState("all")
            )}
          </TabsContent>
          
          <TabsContent value="students" className="mt-0 h-full">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : sortedConversations.length > 0 ? (
              <List
                height={listHeight}
                width="100%"
                itemCount={sortedConversations.length}
                itemSize={90} // Adjust based on your item height
              >
                {ConversationItem}
              </List>
            ) : (
              renderEmptyState("students")
            )}
          </TabsContent>
          
          <TabsContent value="internal" className="mt-0 h-full">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : sortedConversations.length > 0 ? (
              <List
                height={listHeight}
                width="100%"
                itemCount={sortedConversations.length}
                itemSize={90} // Adjust based on your item height
              >
                {ConversationItem}
              </List>
            ) : (
              renderEmptyState("internal")
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ConversationList;
