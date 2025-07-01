
import { useState } from "react";
import { Message } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Pencil, Download, FileText } from "lucide-react";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  userTypeColor: string;
  formatTime: (timestamp: string) => string;
  onEditMessage: (messageId: string, newContent: string) => void;
}

const MessageItem = ({
  message,
  isCurrentUser,
  userTypeColor,
  formatTime,
  onEditMessage
}: MessageItemProps) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const handleStartEdit = () => {
    setEditingMessageId(message.id);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editedContent.trim()) {
      onEditMessage(editingMessageId, editedContent.trim());
      setEditingMessageId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleDownload = () => {
    if (message.file_url) {
      window.open(message.file_url, '_blank');
    }
  };

  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : userTypeColor === "student"
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
        }`}
      >
        {editingMessageId === message.id ? (
          <div className="space-y-2">
            <Input 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="bg-white/80"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-2"
                onClick={handleCancelEdit}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="h-7 px-2"
                onClick={handleSaveEdit}
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{message.content}</p>
            
            {message.file_url && (
              <div className={`mt-2 flex items-center justify-between p-2 rounded ${
                isCurrentUser ? 'bg-primary-foreground/20' : 'bg-white/60'
              }`}>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-medium truncate max-w-[150px]">
                    {message.file_name}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs ${
                isCurrentUser 
                  ? 'text-primary-foreground/70'
                  : userTypeColor === "student"
                    ? 'text-purple-600/70'
                    : 'text-blue-600/70'
              }`}>
                {formatTime(message.created_at)}
                {message.is_edited && <span className="ml-1">(edited)</span>}
              </span>
              
              {isCurrentUser && !message.file_url && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-2 opacity-50 hover:opacity-100"
                  onClick={handleStartEdit}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
