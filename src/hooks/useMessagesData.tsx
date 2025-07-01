import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCallsData } from '@/hooks/useCallsData';
import { Conversation, Message } from '@/types/messages';

export const useMessagesData = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createCall } = useCallsData();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Set up realtime subscription for message updates
      const channel = supabase
        .channel('messages-updates')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, (payload) => {
          console.log('New message received:', payload);
          // If the new message belongs to the current conversation, add it
          const newMessage = payload.new as any;
          if (currentConversation && 
              (newMessage.sender_id === user.id || newMessage.recipient_id === user.id)) {
            setCurrentMessages(prev => [...prev, {
              id: newMessage.id,
              conversation_id: currentConversation,
              sender_id: newMessage.sender_id,
              content: newMessage.content,
              created_at: newMessage.created_at,
              is_read: newMessage.read,
              file_url: newMessage.file_url,
              file_name: newMessage.file_name
            }]);
          }
          // Refresh conversations list to update unread counts and last messages
          loadConversations();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, currentConversation]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      if (!user) return;

      // Fetch sent messages
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      // Fetch received messages
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      // Combine all unique conversations
      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
      const conversationMap = new Map();

      // Process messages to build conversation list
      for (const message of allMessages) {
        const isIncoming = message.recipient_id === user.id;
        const otherUserId = isIncoming ? message.sender_id : message.recipient_id;
        
        // Skip if we've already processed this conversation
        if (conversationMap.has(otherUserId)) continue;
        
        // For a real app, we would fetch user profiles here
        // This is a simplified version using mock data for user info
        const userType = Math.random() > 0.5 ? "student" : "recruiter";
        const mockUserName = `User ${otherUserId.substring(0, 5)}`;
        
        conversationMap.set(otherUserId, {
          id: otherUserId, // Using user ID as conversation ID for simplicity
          with_user_id: otherUserId,
          with_user_name: mockUserName,
          with_user_avatar: `https://i.pravatar.cc/150?u=${otherUserId}`,
          with_user_type: userType,
          last_message: message.content,
          last_message_time: message.created_at,
          unread_count: isIncoming && !message.read ? 1 : 0,
          has_attachment: !!message.file_url
        });
      }

      // If no real conversations, provide mock data
      if (conversationMap.size === 0) {
        // Use the same mock data as before for development
        const mockConversations: Conversation[] = [
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
            id: "4",
            with_user_id: "comp101",
            with_user_name: "TechCorp Recruiting",
            with_user_avatar: "https://i.pravatar.cc/150?img=4",
            with_user_type: "recruiter",
            last_message: "We'd like to schedule an interview for the Sales Development position",
            last_message_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            unread_count: 1
          }
        ];
        
        setConversations(mockConversations);
      } else {
        setConversations(Array.from(conversationMap.values()));
      }
      
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load your conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      if (!user) return;
      
      // Get the conversation to load messages for
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      
      // In a real implementation, fetch messages from the database
      // For now we'll check if we have real messages or need to use mock data
      const { data: realMessages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${conversation.with_user_id},recipient_id.eq.${conversation.with_user_id}`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (realMessages && realMessages.length > 0) {
        // Transform to our message format
        const formattedMessages: Message[] = realMessages.map(msg => ({
          id: msg.id,
          conversation_id: conversationId,
          sender_id: msg.sender_id,
          content: msg.content,
          created_at: msg.created_at,
          is_read: msg.read,
          file_url: msg.file_url,
          file_name: msg.file_name
        }));
        
        setCurrentMessages(formattedMessages);
        
        // Mark messages as read
        const unreadMessages = realMessages.filter(
          msg => msg.recipient_id === user.id && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(msg => 
              supabase
                .from('messages')
                .update({ read: true })
                .eq('id', msg.id)
            )
          );
          
          // Update unread count in conversations
          setConversations(conversations.map(c => 
            c.id === conversationId ? { ...c, unread_count: 0 } : c
          ));
        }
      } else {
        // Fall back to mock data
        const mockMessages: Message[] = [
          {
            id: "m1",
            conversation_id: conversationId,
            sender_id: conversation.with_user_id,
            content: "Hi there! I saw your profile and I'm impressed with your sales experience.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            is_read: true
          },
          {
            id: "m2",
            conversation_id: conversationId,
            sender_id: user?.id || "",
            content: "Thank you! I've been working hard on improving my skills through the challenges.",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
            is_read: true
          },
          {
            id: "m3",
            conversation_id: conversationId,
            sender_id: conversation.with_user_id,
            content: "Your performance on the HubSpot challenge was particularly impressive.",
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            is_read: true
          },
          {
            id: "m4",
            conversation_id: conversationId,
            sender_id: conversation.with_user_id,
            content: conversation.last_message,
            created_at: conversation.last_message_time,
            is_read: conversation.unread_count === 0
          }
        ];
        
        setCurrentMessages(mockMessages);
        
        // Mark conversation as read
        if (conversation.unread_count > 0) {
          setConversations(conversations.map(c => 
            c.id === conversationId ? { ...c, unread_count: 0 } : c
          ));
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `message_attachments/${user?.id}/${fileName}`;
      
      // Check if the storage bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'message_attachments');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('message_attachments', {
          public: false
        });
      }
      
      // Upload file
      const { data, error } = await supabase.storage
        .from('message_attachments')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('message_attachments')
        .getPublicUrl(filePath);
      
      return {
        url: urlData.publicUrl,
        name: file.name
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const sendMessage = async (recipientId: string, content: string, file?: File) => {
    if (!user) return null;
    if (!content.trim() && !file) return null;
    
    setIsSending(true);
    try {
      let fileUrl = null;
      let fileName = null;
      
      // Upload file if provided
      if (file) {
        const fileData = await uploadFile(file);
        fileUrl = fileData.url;
        fileName = fileData.name;
      }
      
      // Insert the message into Supabase
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim() || (fileName ? `Sent a file: ${fileName}` : ""),
          read: false,
          file_url: fileUrl,
          file_name: fileName
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the message for the UI
      const formattedMessage: Message = {
        id: newMessage.id,
        conversation_id: recipientId, // Using recipientId as conversation ID
        sender_id: user.id,
        content: newMessage.content,
        created_at: newMessage.created_at,
        is_read: false,
        file_url: newMessage.file_url,
        file_name: newMessage.file_name
      };
      
      // Update the current messages
      setCurrentMessages(prev => [...prev, formattedMessage]);
      
      // Update or create conversation
      const existingConversation = conversations.find(c => c.with_user_id === recipientId);
      
      if (existingConversation) {
        setConversations(conversations.map(c => 
          c.with_user_id === recipientId 
            ? {
                ...c,
                last_message: newMessage.content,
                last_message_time: new Date().toISOString(),
                has_attachment: !!fileUrl
              }
            : c
        ));
      } else {
        // In a real app, we'd fetch the recipient details
        // For demo, we'll use placeholder data
        const newConversation: Conversation = {
          id: recipientId,
          with_user_id: recipientId,
          with_user_name: "New Contact",
          with_user_type: "student", // Default, would be fetched in real app
          last_message: newMessage.content,
          last_message_time: new Date().toISOString(),
          unread_count: 0,
          has_attachment: !!fileUrl
        };
        
        setConversations([...conversations, newConversation]);
      }
      
      return formattedMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSending(false);
    }
  };

  const initiateVideoCall = async (recipientId: string, recipientName: string) => {
    if (!user) return null;
    
    try {
      // Create a new call using the useCallsData hook
      const callData = await createCall({
        title: `Call with ${recipientName}`,
        description: `Video call initiated from messaging with ${recipientName}`,
        scheduled_at: new Date().toISOString(),
        call_type: "regular"
      });
      
      if (callData) {
        // Send a message about the call
        await sendMessage(
          recipientId, 
          `I've started a video call. Join me at: /call/${callData.id}`
        );
        
        return callData.id;
      }
      return null;
    } catch (error) {
      console.error("Error initiating video call:", error);
      toast({
        title: "Error",
        description: "Failed to start video call. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const filterConversations = (searchQuery: string = "", userType: "all" | "students" | "recruiters" = "all") => {
    return conversations.filter(conversation => {
      // Apply search filter
      const matchesSearch = conversation.with_user_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply user type filter
      let matchesUserType = true;
      if (userType === "students") {
        matchesUserType = conversation.with_user_type === "student";
      } else if (userType === "recruiters") {
        matchesUserType = conversation.with_user_type === "recruiter";
      }
      
      return matchesSearch && matchesUserType;
    });
  };

  return {
    conversations,
    currentMessages,
    currentConversation,
    isLoading,
    isSending,
    loadConversations,
    setCurrentConversation,
    sendMessage,
    initiateVideoCall,
    filterConversations
  };
};
