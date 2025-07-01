// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { PlusCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { CallInterface } from "../call-interface";

// interface CreateCallProps {
//   isCreating: boolean;
//   onCreateCall: (callData: any) => void;
// }

// const CreateCallDialog: React.FC<CreateCallProps> = ({
//   isCreating,
//   onCreateCall,
// }) => {
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [showCallInterface, setShowCallInterface] = useState(false);
//   const [callConfig, setCallConfig] = useState<{
//     roomName: string;
//     token: string;
//   } | null>(null);
//   const [newCallData, setNewCallData] = useState({
//     title: "",
//     description: "",
//     scheduled_at: "",
//     call_type: "regular",
//   });
//   const [formErrors, setFormErrors] = useState({ title: false });

//   const validateForm = () => {
//     const errors = { title: !newCallData.title.trim() };
//     setFormErrors(errors);
//     return !Object.values(errors).some(Boolean);
//   };

//   const handleCreate = async () => {
//     if (!validateForm()) {
//       toast({
//         title: "Please check your inputs",
//         description: "Call title is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:3003/api/calls", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjVRRFliaEhiVlRpYWhMd0UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2VhZmRneGx6dGRtdXZ3bWJoY2ZkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5NDkzOWE0Ni1jNzE3LTQyZDMtYTFhYS0yZjA0NzY2OWYxYjgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3NDM2NzY0LCJpYXQiOjE3NDc0MzMxNjQsImVtYWlsIjoiaS5vYmFpZHU1QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJpLm9iYWlkdTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcnN0X25hbWUiOiJPYmFpZCIsImxhc3RfbmFtZSI6IlVsbGFoIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI5NDkzOWE0Ni1jNzE3LTQyZDMtYTFhYS0yZjA0NzY2OWYxYjgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDc0MzMxNjR9XSwic2Vzc2lvbl9pZCI6IjI3MTRjNDk3LWU4ZTMtNGE0Zi04ZmNlLTBhNmY3NDk3OTcxYSIsImlzX2Fub255bW91cyI6ZmFsc2V9.dWB8wreZHwERcPOpmMaC1QaCB_NhiF3LSiO6F7dnN-U`,
//         },
//         body: JSON.stringify({
//           userId: "94939a46-c717-42d3-a1aa-2f047669f1b8",
//           title: newCallData.title,
//           description: newCallData.description,
//           scheduledAt: newCallData.scheduled_at || null,
//           callType: newCallData.call_type,
//         }),
//       });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Failed to create call");
//       }
//       const data = await res.json();

//       setCallConfig({
//         roomName: data.room_name,
//         token: data.livekit.token,
//       });
//       setShowCallInterface(true);
//       setOpen(false);

//       // notify parent:
//       onCreateCall(data);

//       toast({
//         title: "Call created",
//         description: "Connecting to AI agent...",
//       });
//     } catch (e: any) {
//       toast({
//         title: "Failed to create call",
//         description: e.message || "There was an error creating your call",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button size="sm">
//             <PlusCircle className="h-4 w-4 mr-1" />
//             New Call
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Create New Call</DialogTitle>
//             <DialogDescription>
//               Schedule a call for meetings or conversations
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="title" className="flex items-center">
//                 Call Title <span className="text-destructive ml-1">*</span>
//               </Label>
//               <Input
//                 id="title"
//                 placeholder="Team meeting"
//                 value={newCallData.title}
//                 onChange={(e) =>
//                   setNewCallData({ ...newCallData, title: e.target.value })
//                 }
//                 className={formErrors.title ? "border-destructive" : ""}
//               />
//               {formErrors.title && (
//                 <p className="text-xs text-destructive">Title is required</p>
//               )}
//             </div>
//             {/* add other fields here (description, scheduled_at, etc.) */}
//           </div>
//           <DialogFooter>
//             <Button onClick={handleCreate} disabled={isCreating}>
//               {isCreating ? "Creating…" : "Create Call"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {showCallInterface && callConfig && (
//         <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
//           <div className="w-full max-w-4xl h-[80vh] bg-card rounded-lg overflow-hidden">
//             <CallInterface
//               roomName={callConfig.roomName}
//               token={callConfig.token}
//               onDisconnect={() => setShowCallInterface(false)}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// src/components/CreateCallDialog.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from '../../../apiClient';

interface CreateCallProps {
  isCreating: boolean;
  onCreateCall: (callData: any) => Promise<void> | void;
}

const CreateCallDialog: React.FC<CreateCallProps> = ({ isCreating, onCreateCall }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newCallData, setNewCallData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
    call_type: "regular",
  });
  const [formErrors, setFormErrors] = useState({ title: false });

  const validateForm = () => {
    const errors = { title: !newCallData.title.trim() };
    setFormErrors(errors);
    return !errors.title;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast({
        title: "Please check your inputs",
        description: "Call title is required",
        variant: "destructive",
      });
      return;
    }
    

    try {
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
      const userId = tokenObject?.user?.id;
      const user = tokenObject?.user;

      console.log("user ID LS ", userId)
    
      const res = await apiClient.post(
        'api/calls',
        {
          userId: userId,
          userMetadata: user,
          title: newCallData.title,
          description: newCallData.description,
          scheduledAt: newCallData.scheduled_at || null,
          callType: newCallData.call_type,
          LIVEKIT_URL: 'wss://quota-queen-j0nxcrwr.livekit.cloud',
          LIVEKIT_API_KEY: 'APIWZu8Q6rooXXZ',
          LIVEKIT_API_SECRET: 'AbatQJ9Nq1MwN2Io5Y5zn83pfcX9FNfjmm7kW1LufqIA'
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      const data = res.data;
      await onCreateCall(data);
      setOpen(false);
    
      toast({
        title: "Call created",
        description: "Opening call interface…",
      });
    } catch (e: any) {
      toast({
        title: "Failed to create call",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
    }
    
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          New Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Call</DialogTitle>
          <DialogDescription>Schedule a call for meetings or conversations</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="flex items-center">
              Call Title <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Team meeting"
              value={newCallData.title}
              onChange={(e) => setNewCallData({ ...newCallData, title: e.target.value })}
              className={formErrors.title ? "border-destructive" : ""}
            />
            {formErrors.title && <p className="text-xs text-destructive">Title is required</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about the call"
              value={newCallData.description}
              onChange={(e) => setNewCallData({ ...newCallData, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scheduled_at">Scheduled Time</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={newCallData.scheduled_at}
              onChange={(e) => setNewCallData({ ...newCallData, scheduled_at: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="call_type">Call Type</Label>
            <select
              id="call_type"
              value={newCallData.call_type}
              onChange={(e) => setNewCallData({ ...newCallData, call_type: e.target.value })}
              className="border rounded p-2"
            >
              <option value="regular">Regular</option>
              <option value="group">Group</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating…" : "Create Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateCallDialog;
