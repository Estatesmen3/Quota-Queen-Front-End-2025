
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User, Briefcase } from "lucide-react";
import { useMessagesData } from "@/hooks/useMessagesData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  name: string;
  avatar?: string;
  user_type: "student" | "recruiter";
}

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMessageDialog({ open, onOpenChange }: NewMessageDialogProps) {
  const { sendMessage } = useMessagesData();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<"students" | "recruiters">(
    profile?.user_type === "student" ? "recruiters" : "students"
  );

  // Dummy data for testing - would be replaced with actual API calls
  const mockUsers: User[] = [
    { id: "1", name: "Alex Johnson", user_type: "student" },
    { id: "2", name: "Morgan Smith", user_type: "student" },
    { id: "3", name: "Taylor Wilson", user_type: "student" },
    { id: "4", name: "Jordan Brown", user_type: "recruiter" },
    { id: "5", name: "Casey Martinez", user_type: "recruiter" },
    { id: "6", name: "Riley Thompson", user_type: "recruiter" },
  ];

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) => 
          (user.user_type === "student" && selectedTab === "students") || 
          (user.user_type === "recruiter" && selectedTab === "recruiters")
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleStartConversation = async (user: User) => {
    try {
      setLoading(true);
      await sendMessage(
        user.id,
        "Hi, I'd like to connect with you.",
        undefined  // Add the undefined parameter for the optional file parameter
      );
      toast({
        title: "Conversation started",
        description: `You can now message with ${user.name}`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getUserTypeIcon = (userType: "student" | "recruiter") => {
    if (userType === "student") {
      return <User className="h-4 w-4 text-purple-500" />;
    }
    return <Briefcase className="h-4 w-4 text-blue-500" />;
  };

  const getUserTypeClass = (userType: "student" | "recruiter") => {
    return userType === "student" ? "bg-purple-100" : "bg-blue-100";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue={selectedTab} 
          className="w-full" 
          onValueChange={(value) => setSelectedTab(value as "students" | "recruiters")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="recruiters" className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              Recruiters
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder={`Search ${selectedTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {searchResults.length > 0 ? (
              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id}
                      className="p-2 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer"
                      onClick={() => handleStartConversation(user)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className={getUserTypeClass(user.user_type)}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <span>{user.name}</span>
                          <span className="ml-1.5">{getUserTypeIcon(user.user_type)}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary">Message</Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  {searchTerm && !loading
                    ? "No users found. Try a different search."
                    : "Search for users to message"}
                </p>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
