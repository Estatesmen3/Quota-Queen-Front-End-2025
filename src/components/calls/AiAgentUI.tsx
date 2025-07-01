import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Room, DataPacket_Kind } from "livekit-client";

const AiAgentUI = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  // Voice recognition setup (simple example)
  const recognitionRef = useRef(null);
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      // Optionally, auto send message
      // sendMessage(speechText);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const sendMessage = () => {
    if (room.state !== "connected" || !input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: "user", text }]);
    setInput("");
    const data = new TextEncoder().encode(text);
    room.localParticipant.publishData(data, { kind: DataPacket_Kind.RELIABLE });
  };

  return (
    <>
     <button onClick={startListening}>🎤 Speak</button>
     <Card className="ml-4 flex flex-col w-full max-w-md overflow-hidden">
      <CardHeader><CardTitle>AI Agent Chat</CardTitle></CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-xl max-w-xs whitespace-pre-wrap text-sm ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex border-t p-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 mr-2" rows={1} />
          <Button onClick={sendMessage} disabled={!input.trim()}><Send className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
     </>
  );
};

export default AiAgentUI;