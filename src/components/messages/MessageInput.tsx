
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  handleSendMessage: (content: string, file?: File) => void;
  sendingMessage: boolean;
}

const MessageInput = ({ handleSendMessage, sendingMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSendMessage = () => {
    if ((!newMessage.trim() && !selectedFile) || sendingMessage) return;
    
    handleSendMessage(newMessage, selectedFile || undefined);
    setNewMessage("");
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t">
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded mb-2">
          <span className="text-sm font-medium truncate flex-1">
            {selectedFile.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {(selectedFile.size / 1024).toFixed(0)}KB
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleRemoveFile}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        
        <Input 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          className="flex-1"
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={(newMessage.trim() === "" && !selectedFile) || sendingMessage}
          size="icon"
        >
          {sendingMessage ? (
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
