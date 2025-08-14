import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Trophy, Target, Calendar, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  category: string;
  points: number;
  requiredScore: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  totalMilestones: number;
  completedMilestones: number;
  color: string;
  icon: typeof BarChart3;
}

export function ProgressSection() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Foundation Builder",
      description: "Master basic concepts and build confidence",
      progress: 100,
      isCompleted: true,
      isUnlocked: true,
      category: "Fundamentals",
      points: 250,
      requiredScore: 80
    },
    {
      id: "2", 
      title: "Concept Connector",
      description: "Link related ideas and see patterns",
      progress: 75,
      isCompleted: false,
      isUnlocked: true,
      category: "Integration",
      points: 400,
      requiredScore: 75
    },
    {
      id: "3",
      title: "Advanced Explorer", 
      description: "Dive deep into complex topics",
      progress: 30,
      isCompleted: false,
      isUnlocked: true,
      category: "Advanced",
      points: 600,
      requiredScore: 85
    },
    {
      id: "4",
      title: "Master Synthesizer",
      description: "Create original insights and solutions",
      progress: 0,
      isCompleted: false,
      isUnlocked: false,
      category: "Mastery",
      points: 1000,
      requiredScore: 90
    },
    {
      id: "5",
      title: "Expert Mentor",
      description: "Teach others and solidify understanding",
      progress: 0,
      isCompleted: false,
      isUnlocked: false,
      category: "Teaching",
      points: 1500,
      requiredScore: 95
    }
  ]);

  const [learningPaths] = useState<LearningPath[]>([
    {
      id: "science",
      name: "Science Path",
      description: "Biology, Chemistry, Physics",
      totalMilestones: 12,
      completedMilestones: 7,
      color: "success",
      icon: Target
    },
    {
      id: "math",
      name: "Mathematics Path", 
      description: "Algebra, Calculus, Statistics",
      totalMilestones: 15,
      completedMilestones: 5,
      color: "primary",
      icon: BarChart3
    },
    {
      id: "history",
      name: "History Path",
      description: "World Events, Cultures, Timeline",
      totalMilestones: 10,
      completedMilestones: 3,
      color: "secondary",
      icon: Calendar
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(650);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const next = milestones.find(m => !m.isCompleted && m.isUnlocked);
    setNextMilestone(next || null);
  }, [milestones]);

  const unlockMilestone = (milestoneId: string) => {
    setMilestones(prev => 
      prev.map(m => 
        m.id === milestoneId 
          ? { ...m, isUnlocked: true }
          : m
      )
    );
  };

  const simulateProgress = () => {
    setMilestones(prev => 
      prev.map(m => {
        if (m.id === "2" && !m.isCompleted) {
          const newProgress = Math.min(100, m.progress + 15);
          return {
            ...m,
            progress: newProgress,
            isCompleted: newProgress >= 100
          };
        }
        return m;
      })
    );
    
    setTotalPoints(prev => prev + 50);
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
            <BarChart3 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Learning Progress Roadmap</h2>
          <p className="text-muted-foreground text-lg">
            Track your journey with adaptive milestones that unlock based on your performance
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-4 text-center">
            <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gradient">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </Card>
          
          <Card className="glass-card p-4 text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>
          
          <Card className="glass-card p-4 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {milestones.filter(m => m.isCompleted).length}
            </div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </Card>
          
          <Card className="glass-card p-4 text-center">
            <Star className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">
              {Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestone Roadmap */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Learning Milestones</h3>
                <Button 
                  onClick={simulateProgress}
                  size="sm"
                  className="gradient-secondary"
                >
                  Simulate Progress
                </Button>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      milestone.isCompleted 
                        ? "border-success/30 bg-success/5"
                        : milestone.isUnlocked
                        ? "border-primary/30 bg-primary/5"
                        : "border-muted bg-muted/20 opacity-60"
                    }`}
                  >
                    {/* Connection Line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}

                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        milestone.isCompleted
                          ? "bg-success text-success-foreground"
                          : milestone.isUnlocked
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {milestone.isCompleted ? (
                          <Trophy className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{milestone.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {milestone.points} pts
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {milestone.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Category: {milestone.category}
                          </span>
                          <span className="text-xs font-medium">
                            {milestone.progress}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={milestone.progress} 
                          className={`h-2 ${
                            milestone.isCompleted 
                              ? "[&>div]:bg-success"
                              : milestone.isUnlocked
                              ? "[&>div]:bg-primary"
                              : "[&>div]:bg-muted-foreground"
                          }`}
                        />

                        {!milestone.isUnlocked && (
                          <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                            🔒 Unlocks at {milestone.requiredScore}% in previous milestone
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Learning Paths & Next Steps */}
          <div className="space-y-6">
            {/* Next Milestone */}
            {nextMilestone && (
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Next Milestone
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="font-medium text-primary mb-1">
                      {nextMilestone.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {nextMilestone.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{nextMilestone.progress}%</span>
                  </div>
                  
                  <Progress value={nextMilestone.progress} className="h-2" />
                  
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    {100 - nextMilestone.progress}% remaining to unlock next level
                  </div>
                </div>
              </Card>
            )}

            {/* Learning Paths */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Paths</h3>
              <div className="space-y-3">
                {learningPaths.map((path, index) => {
                  const Icon = path.icon;
                  const completionRate = (path.completedMilestones / path.totalMilestones) * 100;
                  
                  return (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border border-border rounded-lg hover-lift cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-5 h-5 text-${path.color}`} />
                          <span className="font-medium">{path.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {path.completedMilestones}/{path.totalMilestones}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {path.description}
                      </p>
                      
                      <Progress 
                        value={completionRate} 
                        className={`h-1 [&>div]:bg-${path.color}`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-secondary" />
                Recent Achievements
              </h3>
              
              <div className="space-y-3">
                {[
                  { title: "Foundation Builder", description: "Completed basic concepts", icon: "🎯" },
                  { title: "Consistency King", description: "7-day learning streak", icon: "🔥" },
                  { title: "Point Collector", description: "Earned 600+ points", icon: "💎" }
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 bg-secondary/10 rounded-lg"
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}