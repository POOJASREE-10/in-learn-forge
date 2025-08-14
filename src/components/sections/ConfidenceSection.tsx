import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertCircle, CheckCircle2, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface ConfidenceEntry {
  topic: string;
  confidence: number;
  accuracy: number;
  timestamp: Date;
  feedback: string;
  type: "overconfident" | "underconfident" | "calibrated";
}

export function ConfidenceSection() {
  const [currentConfidence, setCurrentConfidence] = useState([75]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [confidenceHistory, setConfidenceHistory] = useState<ConfidenceEntry[]>([
    {
      topic: "Photosynthesis Process",
      confidence: 85,
      accuracy: 60,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      feedback: "You were overconfident. Review the light-dependent reactions.",
      type: "overconfident"
    },
    {
      topic: "Calculus Derivatives",
      confidence: 40,
      accuracy: 80,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      feedback: "Great work! You understand more than you think. Trust yourself!",
      type: "underconfident"
    },
    {
      topic: "World War II Timeline",
      confidence: 70,
      accuracy: 75,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      feedback: "Well calibrated! Your confidence matches your knowledge.",
      type: "calibrated"
    }
  ]);

  const [overallCalibration, setOverallCalibration] = useState(72);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");

  // Sample quiz questions
  const quizQuestions = [
    {
      question: "What is the primary function of mitochondria in cells?",
      options: ["Protein synthesis", "Energy production", "DNA storage", "Waste removal"],
      correct: 1,
      topic: "Cell Biology"
    },
    {
      question: "Which of these is NOT a primary color in additive color theory?",
      options: ["Red", "Green", "Blue", "Yellow"],
      correct: 3,
      topic: "Color Theory"
    },
    {
      question: "What year did the Berlin Wall fall?",
      options: ["1987", "1989", "1991", "1985"],
      correct: 1,
      topic: "Modern History"
    }
  ];

  const [currentQuiz] = useState(quizQuestions[Math.floor(Math.random() * quizQuestions.length)]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return "destructive";
    if (confidence < 70) return "warning";
    return "success";
  };

  const getCalibrationFeedback = (confidence: number, accuracy: number) => {
    const diff = Math.abs(confidence - accuracy);
    if (diff <= 15) return { type: "calibrated", message: "Well calibrated! Your confidence matches your knowledge." };
    if (confidence > accuracy) return { type: "overconfident", message: "You might be overconfident. Consider reviewing the fundamentals." };
    return { type: "underconfident", message: "You know more than you think! Trust your knowledge." };
  };

  const simulateQuizResult = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === currentQuiz.correct;
    const accuracy = isCorrect ? 100 : 0;
    const confidence = currentConfidence[0];
    
    const feedback = getCalibrationFeedback(confidence, accuracy);
    
    const newEntry: ConfidenceEntry = {
      topic: currentQuiz.topic,
      confidence,
      accuracy,
      timestamp: new Date(),
      feedback: feedback.message,
      type: feedback.type as any
    };

    setConfidenceHistory(prev => [newEntry, ...prev.slice(0, 4)]);
    setShowQuiz(false);
    
    // Update overall calibration
    const avgCalibration = [...confidenceHistory, newEntry]
      .slice(0, 5)
      .reduce((acc, entry) => acc + Math.abs(entry.confidence - entry.accuracy), 0) / 5;
    setOverallCalibration(Math.max(0, 100 - avgCalibration));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Adaptive Confidence Meter</h2>
          <p className="text-muted-foreground text-lg">
            Track your confidence vs. actual performance and improve your learning calibration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Confidence Input */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-confidence" />
              Set Your Confidence
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  How confident are you about your next topic?
                </label>
                
                {/* Confidence Slider */}
                <div className="relative">
                  <Slider
                    value={currentConfidence}
                    onValueChange={setCurrentConfidence}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="confidence-meter h-2 rounded-full mt-2 opacity-50" />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Not confident</span>
                  <span className={`font-bold text-${getConfidenceColor(currentConfidence[0])}`}>
                    {currentConfidence[0]}%
                  </span>
                  <span>Very confident</span>
                </div>
              </div>

              <Button
                onClick={() => setShowQuiz(true)}
                className="w-full gradient-primary hover-glow"
                size="lg"
              >
                Test My Knowledge
                <Target className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Calibration Dashboard */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-success" />
              Calibration Score
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gradient mb-2">
                {overallCalibration}%
              </div>
              <p className="text-muted-foreground">
                Overall Calibration Accuracy
              </p>
              <Badge 
                variant={overallCalibration > 80 ? "default" : overallCalibration > 60 ? "secondary" : "destructive"}
                className="mt-2"
              >
                {overallCalibration > 80 ? "Excellent" : overallCalibration > 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overconfident instances</span>
                <span className="text-sm font-medium text-destructive">
                  {confidenceHistory.filter(h => h.type === "overconfident").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Underconfident instances</span>
                <span className="text-sm font-medium text-warning">
                  {confidenceHistory.filter(h => h.type === "underconfident").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Well-calibrated instances</span>
                <span className="text-sm font-medium text-success">
                  {confidenceHistory.filter(h => h.type === "calibrated").length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Card className="glass-card p-6 max-w-2xl w-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Quick Knowledge Check</h3>
                <p className="text-muted-foreground">
                  Your confidence: <span className="font-bold text-confidence">{currentConfidence[0]}%</span>
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">{currentQuiz.question}</h4>
                <div className="space-y-2">
                  {currentQuiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => simulateQuizResult(index)}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowQuiz(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Confidence History */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Learning History</h3>
          <div className="space-y-4">
            {confidenceHistory.map((entry, index) => {
              const Icon = entry.type === "calibrated" ? CheckCircle2 : 
                          entry.type === "overconfident" ? AlertCircle : TrendingUp;
              const color = entry.type === "calibrated" ? "success" :
                          entry.type === "overconfident" ? "destructive" : "warning";
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border border-${color}/20 bg-${color}/5`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 text-${color}`} />
                      <span className="font-medium">{entry.topic}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{entry.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy: </span>
                      <span className="font-medium">{entry.accuracy}%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    {entry.feedback}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}