import { 
  AudioConference, 
  LiveKitRoom, 
  useIsSpeaking,
  useParticipants 
} from "@livekit/components-react";
import { Participant, Track } from "livekit-client";

// Custom participant tile with avatar
interface AvatarParticipantTileProps {
  participant: Participant;
}

const AvatarParticipantTile = ({ participant }: AvatarParticipantTileProps) => {
  const isSpeaking = useIsSpeaking(participant);
  
  // Parse metadata for avatar URL
  let avatarUrl = "";


  if (!avatarUrl) {
    const nameInitial = participant.identity.charAt(0).toUpperCase();
    const nameForUrl = encodeURIComponent(participant.identity);
    avatarUrl = `https://ui-avatars.com/api/?name=${nameForUrl}&background=random&color=fff&size=128`;
    
    // Alternative service if you prefer:
    // avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${nameForUrl}&backgroundColor=random`;
  }


  try {
    if (participant.metadata) {
      const metadata = JSON.parse(participant.metadata);
      avatarUrl = metadata.avatarUrl;
    }
  } catch (e) {
    console.error("Error parsing metadata", e);
  }

  return (
    <div className="flex flex-col items-center p-2">
      <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={participant.identity} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23374151"/><text x="50%" y="50%" font-size="64" fill="white" text-anchor="middle" dominant-baseline="middle">${participant.identity.charAt(0)}</text></svg>`;
            }}
          />
        ) : (
          <div className="bg-gray-400 w-full h-full flex items-center justify-center text-white">
            {participant.identity.charAt(0)}
          </div>
        )}
      </div>
      
      <span className="mt-2 text-sm font-medium truncate max-w-[100px]">
        {participant.identity}
      </span>
      
      <div className="h-1 w-16 mt-1 bg-gray-300 rounded-full overflow-hidden">
        {isSpeaking && (
          <div className="h-full w-full bg-green-500 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};
export default AvatarParticipantTile