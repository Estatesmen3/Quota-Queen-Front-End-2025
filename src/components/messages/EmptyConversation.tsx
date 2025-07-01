
import { MessageSquare } from "lucide-react";

const EmptyConversation = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Select a conversation</h3>
        <p className="text-muted-foreground mt-2">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    </div>
  );
};

export default EmptyConversation;
