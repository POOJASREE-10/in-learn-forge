import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  type: "mistake" | "hint" | "success";
  confidence: number;
  message: string;
}

export function AITwinSection() {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMistakes = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate realistic predictions based on input
    const newPredictions: Prediction[] = [];
    
    if (input.toLowerCase().includes("photosynthesis")) {
      newPredictions.push({
        type: "mistake",
        confidence: 85,
        message: "You might confuse the reactants and products. Remember: CO₂ + H₂O + light energy → glucose + O₂"
      });
      newPredictions.push({
        type: "hint",
        confidence: 92,
        message: "Focus on the role of chlorophyll - it's the key molecule that captures light energy!"
      });
    } else if (input.toLowerCase().includes("calculus") || input.toLowerCase().includes("derivative")) {
      newPredictions.push({
        type: "mistake",
        confidence: 78,
        message: "Common error: forgetting the chain rule when dealing with composite functions"
      });
      newPredictions.push({
        type: "hint",
        confidence: 88,
        message: "Remember: d/dx[f(g(x))] = f'(g(x)) × g'(x). Practice with simple examples first!"
      });
    } else if (input.toLowerCase().includes("history") || input.toLowerCase().includes("war")) {
      newPredictions.push({
        type: "mistake",
        confidence: 73,
        message: "Students often mix up dates and chronological order of events"
      });
      newPredictions.push({
        type: "hint",
        confidence: 90,
        message: "Create a timeline visual aid to better understand the sequence of historical events"
      });
    } else if (input.length > 0) {
      newPredictions.push({
        type: "success",
        confidence: 95,
        message: "Great topic choice! Your learning approach shows strong analytical thinking."
      });
      newPredictions.push({
        type: "hint",
        confidence: 87,
        message: "Break this topic into smaller chunks and use the Feynman technique - explain it as if teaching a 5-year-old!"
      });
    }
    
    setPredictions(newPredictions);
    setIsAnalyzing(false);
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case "mistake": return AlertTriangle;
      case "hint": return Lightbulb;
      case "success": return CheckCircle;
      default: return Brain;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case "mistake": return "destructive";
      case "hint": return "warning";
      case "success": return "success";
      default: return "primary";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">AI Learning Twin</h2>
          <p className="text-muted-foreground text-lg">
            Your digital twin predicts potential mistakes and provides proactive learning hints
          </p>
        </div>

        <Card className="glass-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                What topic are you studying today?
              </label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter the topic or concept you want to learn about (e.g., photosynthesis, calculus derivatives, World War II timeline)..."
                className="min-h-[100px] resize-none"
              />
            </div>
            
            <Button
              onClick={analyzeMistakes}
              disabled={!input.trim() || isAnalyzing}
              className="w-full gradient-primary hover-glow"
              size="lg"
            >
              {isAnalyzing ? (
                <motion.div
                  className="flex items-center space-x-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5" />
                  <span>Analyzing learning patterns...</span>
                </motion.div>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Predict Mistakes & Get Hints
                </>
              )}
            </Button>
          </div>
        </Card>

        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">AI Predictions & Insights</h3>
            <div className="space-y-4">
              {predictions.map((prediction, index) => {
                const Icon = getPredictionIcon(prediction.type);
                const color = getPredictionColor(prediction.type);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card className={`p-4 border-l-4 border-l-${color} hover-lift`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-${color}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {prediction.confidence}% confidence
                            </Badge>
                            <span className="text-xs text-muted-foreground capitalize">
                              {prediction.type}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {prediction.message}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center">How AI Twin Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Pattern Analysis",
                description: "Analyzes your learning topic and identifies common misconceptions"
              },
              {
                step: 2,
                title: "Mistake Prediction", 
                description: "Predicts potential errors based on learning patterns and difficulty"
              },
              {
                step: 3,
                title: "Proactive Hints",
                description: "Provides targeted hints before you encounter the problems"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              >
                <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-foreground font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}