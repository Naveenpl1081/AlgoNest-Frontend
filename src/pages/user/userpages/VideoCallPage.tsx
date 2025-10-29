import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, MessageSquare, Send, X } from "lucide-react";

let socket: any = null;

const CandidateVideoCallPage: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{sender: string; text: string; time: string}>>([]);
  const [messageInput, setMessageInput] = useState("");
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.on("connect", () => {
      console.log(" Socket connected:", socket.id);
    });

    socket.on("connect_error", (error: any) => {
      console.error(" Socket connection error:", error);
      alert("Failed to connect to server. Please check if backend is running on port 3000.");
    });

    socket.on("chat-message", (data: {sender: string; text: string; time: string}) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on("screen-share-started", () => {
      console.log(" Remote user started screen sharing");
    });

    socket.on("screen-share-stopped", () => {
      console.log("Remote user stopped screen sharing");
      setRemoteScreenStream(null);
    });

    const initCall = async () => {
      try {
        console.log(" Initializing candidate call...");
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
          console.log("Received remote track:", event.track.kind);
          const remote = event.streams[0];
          
          if (event.track.kind === 'video' && event.track.label.includes('screen')) {
            setRemoteScreenStream(remote);
            if (screenShareRef.current) {
              screenShareRef.current.srcObject = remote;
            }
          } else {
            setRemoteStream(remote);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remote;
            }
            setIsConnected(true);
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { 
              roomId, 
              candidate: event.candidate 
            });
          }
        };

        peerConnectionRef.current = pc;

        console.log("Joining room:", roomId);
        socket.emit("join-room", roomId);

        socket.on("offer", async (offer: any) => {
          console.log("Received offer from recruiter");
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });
          console.log(" Answer sent");
        });

        socket.on("ice-candidate", async (candidate: any) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });

      } catch (error) {
        console.error("Error initializing call:", error);
        alert("Failed to access camera/microphone");
      }
    };

    initCall();

    return () => {
      socket?.off("offer");
      socket?.off("ice-candidate");
      socket?.off("chat-message");
      socket?.off("screen-share-started");
      socket?.off("screen-share-stopped");
      socket?.disconnect();
      myStream?.getTracks().forEach((track) => track.stop());
      screenStream?.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current?.close();
    };
  }, [roomId]);

  const toggleMic = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setMicEnabled(!micEnabled);
  };

  const toggleCamera = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setCameraEnabled(!cameraEnabled);
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" } as any,
        audio: false,
      });

      setScreenStream(stream);
      setIsSharing(true);

      const pc = peerConnectionRef.current;
      if (pc) {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      socket.emit("screen-share-started", { roomId });

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsSharing(false);

      const pc = peerConnectionRef.current;
      if (pc && myStream) {
        const videoTrack = myStream.getVideoTracks()[0];
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      socket.emit("screen-share-stopped", { roomId });
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socket) {
      const messageData = {
        sender: "Candidate",
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit("chat-message", { roomId, ...messageData });
      setMessages(prev => [...prev, messageData]);
      setMessageInput("");
    }
  };

  const endCall = () => {
    myStream?.getTracks().forEach((track) => track.stop());
    screenStream?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    socket?.disconnect();
    navigate("/user/interview");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
 
      <div className="flex-1 flex flex-col">
    
        <div className="flex justify-between items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-semibold">Interview Room: {roomId}</h2>
            <div className="mt-0.5">
              {isConnected ? (
                <span className="text-green-400 text-xs">● Connected</span>
              ) : (
                <span className="text-yellow-400 text-xs">● Waiting for recruiter...</span>
              )}
            </div>
          </div>
        </div>

       
        <div className="flex-1 relative bg-black">
          
          {remoteScreenStream ? (
            <video
              ref={screenShareRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
        
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1.5 rounded text-sm">
            {remoteScreenStream ? "Recruiter's Screen" : "Recruiter"}
          </div>

       
          <div className="absolute bottom-4 right-4 w-64 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
              You (Candidate)
            </div>
          </div>

         
          {isSharing && (
            <div className="absolute bottom-4 left-4 w-64 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-blue-500">
              <video
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
                ref={(el) => {
                  if (el && screenStream) {
                    el.srcObject = screenStream;
                  }
                }}
              />
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                Your Screen
              </div>
            </div>
          )}
        </div>

     
        <div className="flex justify-center gap-3 py-4 bg-gray-800 border-t border-gray-700">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full transition-all ${
              micEnabled 
                ? "bg-gray-700 hover:bg-gray-600" 
                : "bg-red-600 hover:bg-red-500"
            }`}
            title={micEnabled ? "Mute" : "Unmute"}
          >
            {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full transition-all ${
              cameraEnabled 
                ? "bg-gray-700 hover:bg-gray-600" 
                : "bg-red-600 hover:bg-red-500"
            }`}
            title={cameraEnabled ? "Stop Video" : "Start Video"}
          >
            {cameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={isSharing ? stopScreenShare : startScreenShare}
            className={`p-4 rounded-full transition-all ${
              isSharing 
                ? "bg-blue-600 hover:bg-blue-500" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isSharing ? "Stop Sharing" : "Share Screen"}
          >
            <MonitorUp size={24} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all relative"
            title="Toggle Chat"
          >
            <MessageSquare size={24} />
            {messages.length > 0 && !showChat && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-500 transition-all"
            title="End Call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {showChat && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${msg.sender === 'Candidate' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] rounded-lg p-2 ${
                  msg.sender === 'Candidate' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-300 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateVideoCallPage;