import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Clock, CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  story: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    question: "What happens when plants perform photosynthesis?",
    options: [
      "They consume oxygen and produce carbon dioxide",
      "They consume carbon dioxide and produce oxygen",
      "They consume water and produce sugar",
      "They consume light and produce chlorophyll"
    ],
    correctAnswer: 1,
    explanation: "During photosynthesis, plants use carbon dioxide from the air and water from their roots, combined with sunlight, to produce glucose (sugar) and release oxygen as a byproduct.",
    story: "Imagine a tiny green factory inside every leaf. The workers (chlorophyll) capture sunlight like solar panels. They take in CO₂ through tiny doors (stomata) and water through underground pipes (roots). In the factory, they combine these ingredients to make sugar for food and release fresh oxygen for us to breathe. It's like a magical recipe: Light + CO₂ + Water = Sugar + Oxygen!",
    difficulty: "medium",
    topic: "Biology"
  },
  {
    id: "2",
    question: "Which mathematical operation should be performed first in the expression: 3 + 4 × 2?",
    options: [
      "Addition: 3 + 4 = 7, then 7 × 2 = 14",
      "Multiplication: 4 × 2 = 8, then 3 + 8 = 11", 
      "Left to right: 3 + 4 = 7, then 7 × 2 = 14",
      "It doesn't matter, both give the same result"
    ],
    correctAnswer: 1,
    explanation: "According to the order of operations (PEMDAS/BODMAS), multiplication comes before addition. So we calculate 4 × 2 = 8 first, then add 3 to get 11.",
    story: "Picture a busy kitchen where chefs must follow a strict order to create the perfect dish. The head chef (Parentheses) goes first, then the sauce expert (Exponents), followed by the grill masters (Multiplication and Division - they work left to right), and finally the garnish team (Addition and Subtraction - also left to right). If they don't follow this order, the dish would be ruined! In our math kitchen, multiplication must happen before addition, or our 'equation dish' won't turn out right.",
    difficulty: "easy",
    topic: "Mathematics"
  },
  {
    id: "3",
    question: "What was a major cause of World War I?",
    options: [
      "The invention of the airplane",
      "The assassination of Archduke Franz Ferdinand",
      "The discovery of oil in the Middle East",
      "The Russian Revolution"
    ],
    correctAnswer: 1,
    explanation: "The assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo on June 28, 1914, was the immediate trigger that led to the outbreak of World War I due to the complex alliance system in Europe.",
    story: "Imagine Europe in 1914 as a powder keg, with nations bound by secret alliances like a complex web. Austria-Hungary and Germany were best friends, while France and Russia had each other's backs, and Britain was ready to help. When a young Serbian nationalist shot Archduke Franz Ferdinand in Sarajevo, it was like dropping a lit match into this powder keg. Austria-Hungary declared war on Serbia, Russia backed Serbia, Germany backed Austria-Hungary, France backed Russia, and Britain joined to help France. What started as a regional conflict exploded into a world war because of these intertwined friendships and promises.",
    difficulty: "medium",
    topic: "History"
  }
];

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === question.correctAnswer;

    const result: QuizResult = {
      questionId: question.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setQuizResults(prev => [...prev, result]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowStory(false);
      setQuestionStartTime(Date.now());
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowStory(false);
    setQuizResults([]);
    setIsQuizComplete(false);
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const getScorePercentage = () => {
    const correctAnswers = quizResults.filter(r => r.isCorrect).length;
    return Math.round((correctAnswers / quizResults.length) * 100);
  };

  const getAverageTime = () => {
    const totalTime = quizResults.reduce((sum, result) => sum + result.timeSpent, 0);
    return Math.round(totalTime / quizResults.length / 1000);
  };

  if (isQuizComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card p-8 text-center">
            <div className="w-20 h-20 gradient-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Great job! Here's how you performed:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  {getScorePercentage()}%
                </div>
                <div className="text-muted-foreground">Overall Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">
                  {quizResults.filter(r => r.isCorrect).length}
                </div>
                <div className="text-muted-foreground">Correct Answers</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {getAverageTime()}s
                </div>
                <div className="text-muted-foreground">Avg. Time</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {sampleQuestions.map((q, index) => {
                const result = quizResults[index];
                const Icon = result.isCorrect ? CheckCircle : XCircle;
                const color = result.isCorrect ? "success" : "destructive";
                
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border border-${color}/30 bg-${color}/10`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 text-${color}`} />
                        <span className="font-medium">{q.topic}</span>
                      </div>
                      <Badge variant={result.isCorrect ? "default" : "destructive"}>
                        {Math.round(result.timeSpent / 1000)}s
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={resetQuiz}
              size="lg"
              className="gradient-primary hover-glow"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Take Quiz Again
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Interactive Learning Quiz</h2>
          <p className="text-muted-foreground text-lg">
            Test your knowledge with real-time feedback and story-based explanations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
            <Badge variant="secondary">
              {question.difficulty} • {question.topic}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Card */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6 mb-6">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
                
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      } ${showExplanation ? "pointer-events-none" : ""}`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={showExplanation}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {showExplanation && index === question.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-success ml-auto" />
                        )}
                        {showExplanation && index === selectedAnswer && index !== question.correctAnswer && (
                          <XCircle className="w-5 h-5 text-destructive ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  {!showExplanation ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      size="lg"
                      className="gradient-primary hover-glow"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      size="lg"
                      className="gradient-secondary hover-glow"
                    >
                      {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  )}
                </div>
              </motion.div>
            </Card>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className={`p-6 border-l-4 ${
                    selectedAnswer === question.correctAnswer
                      ? "border-l-success bg-success/5"
                      : "border-l-destructive bg-destructive/5"
                  }`}>
                    <div className="flex items-center space-x-2 mb-4">
                      {selectedAnswer === question.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                      <h4 className="text-lg font-semibold">
                        {selectedAnswer === question.correctAnswer ? "Correct!" : "Not quite right"}
                      </h4>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-4">
                      {question.explanation}
                    </p>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStory(!showStory)}
                      className="mb-4"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showStory ? "Hide" : "Show"} Story Explanation
                    </Button>
                    
                    <AnimatePresence>
                      {showStory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-muted/50 rounded-lg"
                        >
                          <p className="text-sm leading-relaxed italic">
                            {question.story}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quiz Stats Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Current Progress
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions</span>
                  <span className="font-medium">{currentQuestion + 1}/{sampleQuestions.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Correct so far</span>
                  <span className="font-medium text-success">
                    {quizResults.filter(r => r.isCorrect).length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time elapsed</span>
                  <span className="font-medium">
                    {Math.floor((Date.now() - quizStartTime) / 1000)}s
                  </span>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Question History</h3>
              <div className="space-y-2">
                {sampleQuestions.slice(0, currentQuestion + 1).map((q, index) => {
                  const result = quizResults[index];
                  
                  return (
                    <div
                      key={q.id}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        index === currentQuestion
                          ? "bg-primary/10 text-primary"
                          : result?.isCorrect
                          ? "bg-success/10 text-success"
                          : result
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/50"
                      }`}
                    >
                      <span>Q{index + 1}: {q.topic}</span>
                      {result && (
                        result.isCorrect ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}