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
  Settings
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeerConnection {
  id: string;
  name: string;
  skillLevel: number;
  status: "online" | "busy" | "offline";
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export function PeerToPeerSection() {
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [peers, setPeers] = useState<PeerConnection[]>([
    { id: "1", name: "Alex Chen", skillLevel: 75, status: "online" },
    { id: "2", name: "Sarah Kim", skillLevel: 68, status: "online" },
    { id: "3", name: "Mike Rodriguez", skillLevel: 82, status: "busy" },
    { id: "4", name: "Emma Wilson", skillLevel: 71, status: "online" },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedPeer, setConnectedPeer] = useState<PeerConnection | null>(null);
  const [userSkillLevel] = useState(72); // Simulated user skill level
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

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

  const connectToPeer = async (peer: PeerConnection) => {
    setConnectedPeer(peer);
    setIsConnected(true);
    
    // Initialize camera when connecting
    await initializeCamera();
    
    // Simulate receiving initial message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      senderId: peer.id,
      content: `Hi! I'm ${peer.name}. Ready to learn together?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const disconnectFromPeer = () => {
    setConnectedPeer(null);
    setIsConnected(false);
    setMessages([]);
    
    // Stop video stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setVideoEnabled(false);
    setAudioEnabled(false);
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
    if (!newMessage.trim() || !connectedPeer) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
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
        "I agree! Let's explore this more."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: connectedPeer.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const getSkillLevelColor = (level: number) => {
    if (level < 50) return "text-orange-500";
    if (level < 75) return "text-blue-500";
    return "text-green-500";
  };

  const getMatchScore = (peerLevel: number) => {
    const diff = Math.abs(userSkillLevel - peerLevel);
    if (diff <= 5) return "Perfect";
    if (diff <= 15) return "Good";
    return "Fair";
  };

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
          <h2 className="text-3xl font-bold mb-2">Peer-to-Peer Learning</h2>
          <p className="text-muted-foreground text-lg">
            Connect with learners at your skill level for collaborative study sessions
          </p>
        </div>

        {!isConnected ? (
          // Peer Selection View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Your Profile */}
            <Card className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Your Profile
              </h3>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary-foreground">You</span>
                </div>
                <h4 className="font-semibold">Your Learning Level</h4>
                <div className={`text-2xl font-bold ${getSkillLevelColor(userSkillLevel)}`}>
                  {userSkillLevel}%
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Quiz Performance</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Study Sessions</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Topics Mastered</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </Card>

            {/* Available Peers */}
            <div className="lg:col-span-2">
              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Available Study Partners
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {peers.map((peer) => (
                    <motion.div
                      key={peer.id}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-secondary-foreground">
                              {peer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{peer.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={peer.status === "online" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {peer.status}
                              </Badge>
                              <span className={`text-sm font-medium ${getSkillLevelColor(peer.skillLevel)}`}>
                                {peer.skillLevel}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Match Score</span>
                          <span>{getMatchScore(peer.skillLevel)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-primary rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${Math.max(20, 100 - Math.abs(userSkillLevel - peer.skillLevel))}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => connectToPeer(peer)}
                        disabled={peer.status !== "online"}
                        size="sm"
                        className="w-full gradient-primary hover-glow"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Connect & Study
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          // Connected View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Call Area */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Video className="w-5 h-5 mr-2 text-primary" />
                    Study Session with {connectedPeer?.name}
                  </h3>
                  <Badge variant="default" className="bg-green-500">
                    Connected
                  </Badge>
                </div>
                
                {/* Video Streams */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Local Video */}
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      You
                    </div>
                    {!videoEnabled && (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <VideoOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Camera Off</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Remote Video */}
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                      <div className="text-center text-secondary-foreground">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <span className="font-medium">{connectedPeer?.name}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {connectedPeer?.name}
                    </div>
                  </div>
                </div>
                
                {/* Call Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={videoEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleVideo}
                    className="w-12 h-12 rounded-full p-0"
                  >
                    {videoEnabled ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <VideoOff className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <Button
                    variant={audioEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleAudio}
                    className="w-12 h-12 rounded-full p-0"
                  >
                    {audioEnabled ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={disconnectFromPeer}
                    className="w-12 h-12 rounded-full p-0"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <Card className="glass-card p-6 h-full">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-primary" />
                Study Chat
              </h3>
              
              {/* Messages */}
              <div className="flex-1 mb-4 h-80 overflow-y-auto space-y-3">
                {messages.map((message) => (
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
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
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
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}