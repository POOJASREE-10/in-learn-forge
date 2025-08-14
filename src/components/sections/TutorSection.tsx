import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, Zap, Lightbulb, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TutorPersonality = "coach" | "philosopher" | "comedian" | "drill";

interface Tutor {
  id: TutorPersonality;
  name: string;
  icon: typeof Users;
  description: string;
  style: string;
  color: string;
}

const tutors: Tutor[] = [
  {
    id: "coach",
    name: "Coach",
    icon: Zap,
    description: "Motivational and encouraging, focuses on building confidence",
    style: "tutor-coach",
    color: "success"
  },
  {
    id: "philosopher", 
    name: "Philosopher",
    icon: Lightbulb,
    description: "Deep thinker who connects concepts to bigger ideas",
    style: "tutor-philosopher", 
    color: "primary"
  },
  {
    id: "comedian",
    name: "Comedian",
    icon: MessageCircle,
    description: "Uses humor and fun examples to make learning memorable",
    style: "tutor-comedian",
    color: "secondary"
  },
  {
    id: "drill",
    name: "Drill Sergeant",
    icon: Shield,
    description: "Direct and disciplined approach for rapid skill building",
    style: "tutor-drill",
    color: "destructive"
  }
];

export function TutorSection() {
  const [activeTutor, setActiveTutor] = useState<TutorPersonality>("coach");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{role: "user" | "tutor", message: string}>>([]);

  const generateResponse = (tutorType: TutorPersonality, userQuestion: string) => {
    const responses: Record<TutorPersonality, string[]> = {
      coach: [
        "Great question! You're showing real curiosity, and that's the foundation of all learning. Let me break this down in a way that builds your confidence...",
        "I love your enthusiasm! You're on the right track. Here's how we can tackle this step by step...",
        "Fantastic! You're asking exactly the right questions. Let's work through this together and celebrate each victory along the way!"
      ],
      philosopher: [
        "Ah, this touches on something profound about the nature of knowledge itself. Consider this: when we truly understand something, we see its connections to the greater tapestry of understanding...",
        "Your question reveals a deeper inquiry into the very essence of this subject. Socrates once said 'I know that I know nothing' - let us explore this unknown together...",
        "This is not merely a question about facts, but about the fundamental patterns that govern our reality. Let me illuminate the deeper principles at work here..."
      ],
      comedian: [
        "Ha! That's like asking why pizza is round but comes in a square box and we eat it in triangles - life's full of mysteries! But seriously, let me explain this in a way that'll stick...",
        "You know what? This reminds me of that joke about the mathematician, the physicist, and the engineer... But in all seriousness, here's what's really going on...",
        "If this concept were a sitcom character, it would definitely be the quirky neighbor everyone loves! Let me show you why it's actually pretty amusing..."
      ],
      drill: [
        "Listen up! No time for dawdling - we're going to master this concept and we're going to do it RIGHT NOW. Here's exactly what you need to know...",
        "Drop and give me your full attention! This is mission-critical information. I'm going to drill this into your head until it's second nature...",
        "Soldier! You came here to learn, so let's get to work. No excuses, no confusion - just pure, focused knowledge acquisition. Ready? Here we go..."
      ]
    };

    const tutorResponses = responses[tutorType];
    return tutorResponses[Math.floor(Math.random() * tutorResponses.length)];
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    const userMessage = { role: "user" as const, message: question };
    const tutorResponse = { 
      role: "tutor" as const, 
      message: generateResponse(activeTutor, question)
    };

    setConversation(prev => [...prev, userMessage, tutorResponse]);
    setQuestion("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  };

  const currentTutor = tutors.find(t => t.id === activeTutor)!;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Multi-Persona AI Tutors</h2>
          <p className="text-muted-foreground text-lg">
            Choose your learning style with AI tutors that adapt their personality to your needs
          </p>
        </div>

        {/* Tutor Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tutors.map((tutor, index) => {
            const Icon = tutor.icon;
            const isActive = activeTutor === tutor.id;
            
            return (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all duration-300 hover-lift ${
                    isActive 
                      ? `border-2 border-${tutor.color} ${tutor.style}` 
                      : "glass-card hover:bg-accent"
                  }`}
                  onClick={() => setActiveTutor(tutor.id)}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                      isActive ? "bg-background/20" : "bg-primary/10"
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{tutor.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tutor.description}
                    </p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3"
                      >
                        <Badge variant="secondary" className="text-xs">
                          Active Tutor
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Tutor Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className={`p-6 ${currentTutor.style}`}>
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <currentTutor.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{currentTutor.name}</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {currentTutor.description}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Conversation */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-96 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {conversation.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : `bg-${currentTutor.color}/10 border border-${currentTutor.color}/20`
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {msg.role === "tutor" && (
                            <currentTutor.icon className={`w-4 h-4 text-${currentTutor.color}`} />
                          )}
                          <span className="text-xs font-medium">
                            {msg.role === "user" ? "You" : currentTutor.name}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {conversation.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask your {currentTutor.name.toLowerCase()} a question to start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask your ${currentTutor.name.toLowerCase()} a question...`}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!question.trim()}
                    className={`gradient-${currentTutor.color === "destructive" ? "primary" : currentTutor.color}`}
                  >
                    Ask
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}