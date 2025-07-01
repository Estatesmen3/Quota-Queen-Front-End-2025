import { useParticipants } from "@livekit/components-react";
import AvatarParticipantTile from "./AvatarParticipantTile"

const CustomAudioConference = () => {
  const participants = useParticipants();
  
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {participants.map((participant) => (
        <AvatarParticipantTile 
          key={participant.sid} 
          participant={participant} 
        />
      ))}
    </div>
  );
};



export default CustomAudioConference