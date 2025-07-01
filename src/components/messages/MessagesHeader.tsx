
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NewMessageDialog } from "./NewMessageDialog";

const MessagesHeader = () => {
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Connect with fellow sales students and recruiters</p>
        </div>
        <Button size="sm" onClick={() => setShowNewMessageDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
      
      <NewMessageDialog 
        open={showNewMessageDialog} 
        onOpenChange={setShowNewMessageDialog} 
      />
    </div>
  );
};

export default MessagesHeader;
