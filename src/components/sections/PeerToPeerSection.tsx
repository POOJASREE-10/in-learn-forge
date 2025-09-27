import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Send,
  Camera,
  Settings,
  Copy,
  Check,
  Wifi,
  MessageCircle,
  User
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export function PeerToPeerSection() {
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userSkillLevel] = useState(5); // User skill level (1-10)
  const [userName] = useState("User");
  const [connectionId] = useState("VUDQEC"); // Generate random connection ID
  const [peerConnectionId, setPeerConnectionId] = useState("");
  const [connectedPeerName, setConnectedPeerName] = useState("");
  const [connectedPeerSkill, setConnectedPeerSkill] = useState(2);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const generateConnectionId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setVideoEnabled(true);
      setAudioEnabled(true);
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
    }
  };

  const connectToPeer = async () => {
    if (!peerConnectionId.trim()) return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Initialize camera when connecting
    await initializeCamera();
    
    setIsConnected(true);
    setConnectedPeerName(`User ${peerConnectionId}`);
    setConnectedPeerSkill(Math.floor(Math.random() * 10) + 1);
    setIsConnecting(false);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      senderId: "system",
      senderName: "System",
      content: "Connected successfully! Start your learning conversation.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const disconnectFromPeer = () => {
    setIsConnected(false);
    setConnectedPeerName("");
    setConnectedPeerSkill(0);
    setPeerConnectionId("");
    setMessages([]);
    
    // Stop video stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setVideoEnabled(false);
    setAudioEnabled(false);
  };

  const copyConnectionId = async () => {
    await navigator.clipboard.writeText(connectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      senderName: userName,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate peer response
    setTimeout(() => {
      const responses = [
        "That's a great point!",
        "I hadn't thought of it that way.",
        "Could you explain that further?",
        "That makes sense. What about...",
        "I agree! Let's explore this more.",
        "Thanks for sharing that insight!",
        "Let's work on this problem together.",
        "Can you help me understand this concept?"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "peer",
        senderName: connectedPeerName,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Peer Chat</h2>
          <p className="text-muted-foreground text-lg">
            Connect with fellow learners for collaborative study sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Panel */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-primary" />
              Connection
            </h3>
            
            {!isConnected ? (
              <div className="space-y-6">
                {/* User Info */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Your Name
                  </label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="font-medium">{userName}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Skill Level (1-10)
                  </label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="font-medium text-2xl">{userSkillLevel}</span>
                  </div>
                </div>

                {/* Connection ID */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Your Connection ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-primary/10 border-2 border-primary rounded-lg">
                      <span className="font-mono font-bold text-primary">{connectionId}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyConnectionId}
                      className="px-3"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Connect to Peer */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">
                    Connect to Peer ID
                  </label>
                  <Input
                    value={peerConnectionId}
                    onChange={(e) => setPeerConnectionId(e.target.value.toUpperCase())}
                    placeholder="Enter peer's connection ID"
                    className="font-mono"
                  />
                </div>

                {/* Media Controls */}
                <div className="flex items-center justify-center space-x-4 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-12 h-12 rounded-full p-0"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-12 h-12 rounded-full p-0"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>

                {/* Connect Button */}
                <Button
                  onClick={connectToPeer}
                  disabled={!peerConnectionId.trim() || isConnecting}
                  className="w-full gradient-primary hover-glow"
                  size="lg"
                >
                  {isConnecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Phone className="w-5 h-5 mr-2" />
                    </motion.div>
                  ) : (
                    <Phone className="w-5 h-5 mr-2" />
                  )}
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connected Status */}
                <div className="text-center">
                  <Badge variant="default" className="mb-4 bg-green-500">
                    Connected
                  </Badge>
                  <h4 className="text-lg font-semibold mb-2">{connectedPeerName}</h4>
                  <p className="text-muted-foreground">Skill Level: {connectedPeerSkill}/10</p>
                </div>

                {/* Video Areas */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">You</h5>
                    <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {!videoEnabled && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <div className="text-center">
                            <User className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Camera Off</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Peer</h5>
                    <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                        <div className="text-center text-secondary-foreground">
                          <User className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">{connectedPeerName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disconnect Button */}
                <Button
                  variant="destructive"
                  onClick={disconnectFromPeer}
                  className="w-full"
                  size="lg"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  Disconnect
                </Button>
              </div>
            )}
          </Card>

          {/* Study Chat */}
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-primary" />
              Study Chat
              {isConnected && (
                <Badge variant="outline" className="ml-auto">
                  Connected to {connectedPeerName}
                </Badge>
              )}
            </h3>
            
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Connect to a peer to start chatting
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-center">
                        Start your learning conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg text-sm ${
                            message.senderId === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.senderId === "system"
                              ? "bg-muted text-foreground text-center mx-auto"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.senderId !== "system" && message.senderId !== "user" && (
                            <p className="text-xs opacity-70 mb-1">{message.senderName}</p>
                          )}
                          <p>{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}