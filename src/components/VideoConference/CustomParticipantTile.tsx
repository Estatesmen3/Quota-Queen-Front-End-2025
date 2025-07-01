import { VideoConference, useParticipants, useRoomContext } from "@livekit/components-react";

const ParticipantInfo = ({ participant }) => {
  // Parse metadata from participant
  const metadata = JSON.parse(participant.metadata || "{}");

  console.log("meta data -< ", metadata)
  
  return (
    <div className="participant-info">
      <div className="avatar">
        {metadata.avatarUrl ? (
          <img src={metadata.avatarUrl} alt="Avatar" />
        ) : (
          <div className="default-avatar" />
        )}
      </div>
      <div className="details">
        <div className="name">{participant.name}</div>
        {metadata.isAI && (
          <div className="ai-badge">AI Assistant</div>
        )}
        <div className="title">{metadata.title}</div>
        <div className="designation">{metadata.designation}</div>
      </div>
    </div>
  );
};

const CustomVideoConference = () => {
  const participants = useParticipants();
  
  return (
    <div className="video-conference">
      {participants.map((participant) => (
        <div key={participant.sid} className="participant-tile">
         <VideoConference />
          <ParticipantInfo participant={participant} />
        </div>
      ))}
    </div>
  );
};


export default CustomVideoConference