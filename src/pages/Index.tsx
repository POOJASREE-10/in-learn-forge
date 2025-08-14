import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { FloatingAssistant } from "@/components/FloatingAssistant";
import { HeroSection } from "@/components/sections/HeroSection";
import { AITwinSection } from "@/components/sections/AITwinSection";
import { TutorSection } from "@/components/sections/TutorSection";
import { ConfidenceSection } from "@/components/sections/ConfidenceSection";
import { SummarizerSection } from "@/components/sections/SummarizerSection";
import { ProgressSection } from "@/components/sections/ProgressSection";
import { QuizSection } from "@/components/sections/QuizSection";
import { PeerToPeerSection } from "@/components/sections/PeerToPeerSection";

type Section = "hero" | "twin" | "tutors" | "confidence" | "summarizer" | "progress" | "quizzes" | "peer";

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>("hero");

  const handleGetStarted = () => {
    setActiveSection("twin");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return <HeroSection onGetStarted={handleGetStarted} />;
      case "twin":
        return <AITwinSection />;
      case "tutors":
        return <TutorSection />;
      case "confidence":
        return <ConfidenceSection />;
      case "summarizer":
        return <SummarizerSection />;
      case "progress":
        return <ProgressSection />;
      case "quizzes":
        return <QuizSection />;
      case "peer":
        return <PeerToPeerSection />;
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={(section) => setActiveSection(section as Section)} 
        />
        
        <main className="relative">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {renderSection()}
          </motion.div>
        </main>

        <FloatingAssistant />
        
        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;