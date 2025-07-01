// // src/components/CallControl.tsx
// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useCallsData } from "@/hooks/useCallsData";
// import CallsList from "./CallsList";
// import CreateCallDialog from "./CreateCallDialog";
// import { CallInterface } from "../../components/call-interface";

// const CallControl: React.FC = () => {
//   const {
//     upcomingCalls,
//     isLoading,
//     isCreating,
//     createCall,
//     callConfig,
//     showCallInterface,
//     endCall,
//   } = useCallsData();

//   // this will be passed into CreateCallDialog
//   const handleCreateCall = async (callData: any) => {
//     await createCall({
//       ...callData,
//       scheduled_at: callData.scheduled_at || null,
//     });
//   };

//   return (
//     <Card>
//       {showCallInterface && callConfig && (
//         <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
//           <div className="w-full max-w-4xl h-[80vh] bg-card rounded-lg overflow-hidden">
//             <CallInterface
//               roomName={callConfig.roomName}
//               token={callConfig.token}
//               onDisconnect={endCall}
//             />
//           </div>
//         </div>
//       )}

//       <CardHeader className="flex items-center justify-between pb-2">
//         <div>
//           <CardTitle>Calls</CardTitle>
//           <CardDescription>
//             {showCallInterface ? "Active Call" : "Scheduled and active calls"}
//           </CardDescription>
//         </div>

//         {!showCallInterface && (
//           <CreateCallDialog
//             isCreating={isCreating}
//             onCreateCall={handleCreateCall}
//           />
//         )}
//       </CardHeader>

//       <CardContent>
//         {showCallInterface ? (
//           <div className="text-center py-8">
//             <p className="text-muted-foreground">
//               Currently in an active call...
//             </p>
//           </div>
//         ) : (
//           <CallsList calls={upcomingCalls} isLoading={isLoading} />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CallControl;

// src/components/CallControl.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useCallsData } from "@/hooks/useCallsData";
import CallsList from "./CallsList";
import CreateCallDialog from "./CreateCallDialog";
import { CallInterface } from "../../components/call-interface";
import AiAgentUI from "./AiAgentUI";
import { Room } from "livekit-client";

const CallControl: React.FC = () => {
  const {
    upcomingCalls,
    isLoading,
    isCreating,
    createCall,
    callConfig,
    showCallInterface,
    endCall,
  } = useCallsData();

  const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);

  const handleCreateCall = async (callData: any) => {
    await createCall({
      ...callData,
      scheduled_at: callData.scheduled_at || null,
    });
  };

  return (
    <Card>
      {showCallInterface && callConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 flex">
          <CallInterface
            roomName={callConfig.roomName}
            token={callConfig.token}
            onDisconnect={() => {
              endCall();
              setLivekitRoom(null);
            }}
            onRoomConnected={setLivekitRoom}
          />
          {livekitRoom && <AiAgentUI room={livekitRoom} />}
        </div>
      )}

<CardHeader className="pb-2">
  <div className="flex items-center justify-between w-full">
    <div>
      <CardTitle>Calls</CardTitle>
      <CardDescription>
        {showCallInterface ? "Active Call" : "Scheduled and active calls"}
      </CardDescription>
    </div>
    {!showCallInterface && (
      <CreateCallDialog
        isCreating={isCreating}
        onCreateCall={handleCreateCall}
      />
    )}
  </div>
</CardHeader>


      <CardContent>
        {showCallInterface ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Currently in an active call…
            </p>
          </div>
        ) : (
          <CallsList calls={upcomingCalls} isLoading={isLoading} />
        )}
      </CardContent>
    </Card>
  );
};

export default CallControl;
