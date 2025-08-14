import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Send,
  Copy,
  Check,
  Wifi,
  WifiOff
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'local' | 'remote';
  senderName: string;
}

interface PeerConnection {
  id: string;
  name: string;
  skillLevel: number;
  status: 'connecting' | 'connected' | 'disconnected';
}

export function PeerToPeerSection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionId, setConnectionId] = useState('');
  const [myConnectionId, setMyConnectionId] = useState('');
  const [peer, setPeer] = useState<PeerConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [skillLevel, setSkillLevel] = useState(5);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random connection ID
    setMyConnectionId(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const initializePeerConnection = () => {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(config);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // In a real implementation, you'd send this to the remote peer
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setPeer(prev => prev ? { ...prev, status: 'connected' } : null);
        toast({
          title: "Connected!",
          description: "You are now connected to your peer",
        });
      } else if (pc.connectionState === 'disconnected') {
        setPeer(prev => prev ? { ...prev, status: 'disconnected' } : null);
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onopen = () => console.log('Data channel opened');
      channel.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        handleReceiveMessage(messageData);
      };
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startConnection = async (isInitiator: boolean) => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before connecting",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    const pc = initializePeerConnection();
    peerConnectionRef.current = pc;

    // Create data channel for messages
    if (isInitiator) {
      const dataChannel = pc.createDataChannel('messages');
      dataChannelRef.current = dataChannel;
      
      dataChannel.onopen = () => console.log('Data channel opened');
      dataChannel.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        handleReceiveMessage(messageData);
      };
    }

    // Get user media if video/audio is enabled
    if (isVideoEnabled || isAudioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: isAudioEnabled
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Media Access Error",
          description: "Could not access camera/microphone",
          variant: "destructive",
        });
      }
    }

    // Simulate connection process (in real implementation, you'd use signaling server)
    setTimeout(() => {
      setPeer({
        id: connectionId || 'DEMO_PEER',
        name: connectionId ? `User ${connectionId}` : 'Demo Partner',
        skillLevel: Math.floor(Math.random() * 10) + 1,
        status: 'connected'
      });
      setIsConnecting(false);
      
      // Simulate receiving a welcome message
      setTimeout(() => {
        handleReceiveMessage({
          text: "Hello! I'm ready to learn together. What would you like to study?",
          senderName: connectionId ? `User ${connectionId}` : 'Demo Partner'
        });
      }, 1000);
    }, 2000);
  };

  const handleReceiveMessage = (messageData: { text: string; senderName: string }) => {
    const message: Message = {
      id: Date.now().toString(),
      text: messageData.text,
      timestamp: new Date(),
      sender: 'remote',
      senderName: messageData.senderName
    };
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !peer) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      sender: 'local',
      senderName: userName
    };

    setMessages(prev => [...prev, message]);

    // Send via WebRTC data channel (in real implementation)
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({
        text: newMessage,
        senderName: userName
      }));
    }

    setNewMessage('');
  };

  const disconnect = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    setPeer(null);
    setMessages([]);
    setIsConnecting(false);
    
    toast({
      title: "Disconnected",
      description: "You have been disconnected from your peer",
    });
  };

  const copyConnectionId = async () => {
    await navigator.clipboard.writeText(myConnectionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Connection ID copied to clipboard",
    });
  };

  const toggleVideo = async () => {
    if (!isVideoEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsVideoEnabled(true);
      } catch (error) {
        console.error('Error enabling video:', error);
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => track.stop());
      }
      setIsVideoEnabled(false);
    }
  };

  const toggleAudio = async () => {
    if (!isAudioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsAudioEnabled(true);
      } catch (error) {
        console.error('Error enabling audio:', error);
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.stop());
      }
      setIsAudioEnabled(false);
    }
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
            Connect with fellow learners for collaborative study sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <div className="lg:col-span-1">
            <Card className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-primary" />
                Connection
              </h3>

              {!peer ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name</label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Skill Level (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Connection ID</label>
                    <div className="flex space-x-2">
                      <Input
                        value={myConnectionId}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyConnectionId}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Connect to Peer ID</label>
                    <Input
                      value={connectionId}
                      onChange={(e) => setConnectionId(e.target.value)}
                      placeholder="Enter peer's connection ID"
                    />
                  </div>

                  {/* Media Controls */}
                  <div className="flex space-x-2">
                    <Button
                      variant={isVideoEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={toggleVideo}
                    >
                      {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={isAudioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAudio}
                    >
                      {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => startConnection(true)}
                      disabled={isConnecting}
                      className="flex-1 gradient-primary hover-glow"
                    >
                      {isConnecting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Wifi className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge
                      variant={peer.status === 'connected' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {peer.status === 'connected' ? 'Connected' : 'Connecting...'}
                    </Badge>
                    <div className="text-lg font-semibold">{peer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Skill Level: {peer.skillLevel}/10
                    </div>
                  </div>

                  {/* Video Feeds */}
                  {(isVideoEnabled || peer.status === 'connected') && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">You</label>
                        <video
                          ref={localVideoRef}
                          autoPlay
                          muted
                          className="w-full h-24 bg-muted rounded-lg object-cover"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Peer</label>
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          className="w-full h-24 bg-muted rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={disconnect}
                    variant="destructive"
                    className="w-full"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-full">
              <div className="flex flex-col h-[600px]">
                <div className="p-4 border-b border-border">
                  <h3 className="text-xl font-semibold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                    Study Chat
                    {peer && (
                      <Badge className="ml-auto">
                        Connected to {peer.name}
                      </Badge>
                    )}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {peer ? (
                        <>
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Start your learning conversation!</p>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Connect to a peer to start chatting</p>
                        </>
                      )}
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.sender === 'local' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'local'
                              ? 'gradient-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <div className="text-xs opacity-75 mb-1">
                            {message.senderName} • {message.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="text-sm">{message.text}</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={peer ? "Type your message..." : "Connect to start chatting"}
                      disabled={!peer}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!peer || !newMessage.trim()}
                      size="sm"
                      className="gradient-primary hover-glow px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: "Skill-Based Matching",
              description: "Connect with peers at similar learning levels"
            },
            {
              icon: Video,
              title: "Audio & Video",
              description: "Optional video and audio for enhanced communication"
            },
            {
              icon: MessageSquare,
              title: "Real-time Chat",
              description: "Instant messaging for collaborative learning"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card className="glass-card p-4 text-center">
                  <Icon className="w-8 h-8 gradient-primary rounded-lg p-1 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}