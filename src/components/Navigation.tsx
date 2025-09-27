import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Users, 
  Target, 
  BookOpen, 
  BarChart3, 
  MessageSquare,
  Video,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const navigationItems = [
  { name: "AI Twin", icon: Brain, section: "twin" },
  { name: "Tutors", icon: Users, section: "tutors" },
  { name: "Confidence", icon: Target, section: "confidence" },
  { name: "Summarizer", icon: BookOpen, section: "summarizer" },
  { name: "Progress", icon: BarChart3, section: "progress" },
  { name: "Quizzes", icon: MessageSquare, section: "quizzes" },
  { name: "Peer Chat", icon: Video, section: "peer" },
];

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">LearnForge</span>
            </div>

            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;
                
                return (
                  <Button
                    key={item.section}
                    variant="ghost"
                    size="sm"
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => onSectionChange(item.section)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                        layoutId="activeSection"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0 hover-glow"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 glass-nav"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient">LearnForge</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 p-0"
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          className={`fixed top-16 left-0 right-0 z-40 glass-card mx-4 mt-2 rounded-xl overflow-hidden ${
            isOpen ? "block" : "hidden"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.section;
              
              return (
                <motion.button
                  key={item.section}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    onSectionChange(item.section);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}