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
  User,
  Monitor,
  Download,
  Loader2,
  CheckCircle,
  XCircle
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
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName] = useState("You");
  const [connectionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [peerConnectionId, setPeerConnectionId] = useState("");
  const [connectedPeerName, setConnectedPeerName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setVideoEnabled(true);
      setAudioEnabled(true);
      return stream;
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
      throw error;
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      
      setIsScreenSharing(true);
      
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        initializeCamera(); // Return to camera when screen share ends
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenShare = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScreenSharing(false);
    initializeCamera();
  };

  const captureSnapshot = () => {
    if (localVideoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = localVideoRef.current.videoWidth;
      canvas.height = localVideoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(localVideoRef.current, 0, 0);
        
        // Download the image
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `snapshot-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const connectToPeer = async () => {
    if (!peerConnectionId.trim()) return;
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    try {
      // Initialize camera first
      await initializeCamera();
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setConnectedPeerName(`User_${peerConnectionId}`);
      setIsConnecting(false);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        senderId: "system",
        senderName: "System",
        content: "🎉 Connected successfully! You can now chat and share video.",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Connection failed:", error);
      setIsConnecting(false);
      setConnectionStatus('disconnected');
    }
  };

  const disconnectFromPeer = () => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setConnectedPeerName("");
    setPeerConnectionId("");
    setMessages([]);
    setIsScreenSharing(false);
    
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
          "That's a great point! 👍",
          "I hadn't thought of it that way 🤔",
          "Could you explain that further?",
          "That makes sense. What about... 🧐",
          "I agree! Let's explore this more 🚀",
          "Thanks for sharing that insight! 💡",
          "Let's work on this problem together 🤝",
          "Can you help me understand this concept? 📚",
          "Interesting perspective! 🎯",
          "That's really helpful, thanks! 🙏"
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
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Video className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Video Chat
          </h2>
          <p className="text-muted-foreground text-xl">
            Connect face-to-face with peers for real-time collaboration
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center mt-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-500/20 text-green-400' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4" />}
              {connectionStatus === 'connecting' && <Loader2 className="w-4 h-4 animate-spin" />}
              {connectionStatus === 'disconnected' && <XCircle className="w-4 h-4" />}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video Area */}
            <Card className="glass-card p-6">
              <div className="relative bg-muted/50 rounded-2xl overflow-hidden aspect-video shadow-inner">
                {isConnected ? (
                  <>
                    {/* Remote Video (Main) */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">{connectedPeerName}</p>
                        <p className="text-sm opacity-70">Peer's video stream</p>
                      </div>
                    </div>
                    
                    {/* Local Video (Picture-in-Picture) */}
                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-background border-2 border-primary/20 rounded-xl overflow-hidden shadow-lg">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      {!videoEnabled && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        You
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-20 h-20 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-xl font-medium text-muted-foreground mb-2">
                        No active call
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        Connect with a peer to start video chat
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Controls */}
              {isConnected && (
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <Button
                    variant={audioEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleAudio}
                    className="w-14 h-14 rounded-full p-0"
                  >
                    {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    variant={videoEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                    className="w-14 h-14 rounded-full p-0"
                  >
                    {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    className="w-14 h-14 rounded-full p-0"
                  >
                    <Monitor className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={captureSnapshot}
                    className="w-14 h-14 rounded-full p-0"
                  >
                    <Download className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={disconnectFromPeer}
                    className="w-14 h-14 rounded-full p-0"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Connection & Chat Panel */}
          <div className="space-y-6">
            {/* Connection Panel */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-primary" />
                Connection
              </h3>
            
              {!isConnected ? (
                <div className="space-y-4">
                  {/* Connection ID */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Your ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 bg-primary/10 border border-primary/30 rounded-xl">
                        <span className="font-mono font-bold text-primary text-lg">{connectionId}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyConnectionId}
                        className="px-3 rounded-xl"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Share this ID with your peer</p>
                  </div>

                  {/* Connect to Peer */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Connect to Peer
                    </label>
                    <Input
                      value={peerConnectionId}
                      onChange={(e) => setPeerConnectionId(e.target.value.toUpperCase())}
                      placeholder="Enter peer's ID"
                      className="font-mono rounded-xl"
                    />
                  </div>

                  {/* Connect Button */}
                  <Button
                    onClick={connectToPeer}
                    disabled={!peerConnectionId.trim() || isConnecting}
                    className="w-full gradient-primary hover-glow rounded-xl"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5 mr-2" />
                        Start Video Call
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Connected Status */}
                  <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-400">Connected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{connectedPeerName}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                      className="rounded-xl"
                    >
                      <Monitor className="w-4 h-4 mr-1" />
                      {isScreenSharing ? "Stop" : "Share"}
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={captureSnapshot}
                      className="rounded-xl"
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Capture
                    </Button>
                  </div>
                </div>
              )}
          </Card>

            {/* Chat Section */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                Chat
                {isConnected && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Live
                  </Badge>
                )}
              </h3>
            
              {!isConnected ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground">
                    Connect to start chatting
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-80">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            message.senderId === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.senderId === "system"
                              ? "bg-accent/20 text-accent-foreground text-center mx-auto border border-accent/30"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.senderId !== "system" && message.senderId !== "user" && (
                            <p className="text-xs opacity-70 mb-1 font-medium">{message.senderName}</p>
                          )}
                          <p className="leading-relaxed">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
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
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="px-4 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}