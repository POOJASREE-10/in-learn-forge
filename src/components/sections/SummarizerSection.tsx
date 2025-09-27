import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, BarChart3, Download, Copy, Check, Upload, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SummaryData {
  keyPoints: string[];
  mainConcepts: string[];
  summary: string;
  readingTime: number;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  visualData: {
    labels: string[];
    values: number[];
  };
}

export function SummarizerSection() {
  const [inputText, setInputText] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const generateSummary = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic summary based on input
    const words = inputText.split(/\s+/).length;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Extract key concepts (simulate NLP processing)
    const commonWords = inputText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 4)
      .reduce((acc: Record<string, number>, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    
    const topWords = Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    const mockSummary: SummaryData = {
      keyPoints: [
        "Core concept: " + (topWords[0] || "Main topic") + " and its applications",
        "Key relationship between " + (topWords[1] || "secondary concept") + " and " + (topWords[2] || "related idea"),
        "Important implications for understanding " + (topWords[3] || "broader context"),
        "Critical considerations when applying these principles"
      ].slice(0, Math.min(4, Math.ceil(sentences.length / 3))),
      
      mainConcepts: topWords,
      
      summary: sentences.length > 3 
        ? `This text discusses ${topWords[0]?.toLowerCase() || 'key concepts'} with emphasis on ${topWords[1]?.toLowerCase() || 'important principles'}. The main argument centers around the relationship between ${topWords[2]?.toLowerCase() || 'core elements'} and their practical applications. Key insights include the importance of understanding fundamental principles before applying advanced concepts.`
        : inputText.split('.')[0] + "...",
      
      readingTime: Math.ceil(words / 200),
      
      complexity: words < 200 ? "Beginner" : words < 500 ? "Intermediate" : "Advanced",
      
      visualData: {
        labels: topWords.slice(0, 4),
        values: Object.values(commonWords).sort((a, b) => b - a).slice(0, 4)
      }
    };

    setSummaryData(mockSummary);
    setIsProcessing(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const generateMindMap = () => {
    if (!summaryData) return "";
    
    return `
graph TD
    A[${summaryData.mainConcepts[0] || "Main Topic"}] --> B[${summaryData.mainConcepts[1] || "Concept 1"}]
    A --> C[${summaryData.mainConcepts[2] || "Concept 2"}]
    A --> D[${summaryData.mainConcepts[3] || "Concept 3"}]
    B --> E[Application 1]
    C --> F[Application 2]
    D --> G[Application 3]
    `;
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
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Smart Content Summarizer</h2>
          <p className="text-muted-foreground text-lg">
            Transform any text into concise summaries with visual learning aids and mind maps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Input Text
              </h3>
              
              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to upload
                    </p>
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="text-xs text-primary cursor-pointer hover:underline"
                    >
                      Supported: TXT, PDF, DOC, DOCX, CSV
                    </label>
                  </div>
                </div>

                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here or upload a file to generate an intelligent summary with key concepts, visual aids, and learning insights..."
                  className="min-h-[250px] resize-none text-sm"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{inputText.length} characters</span>
                  <span>{inputText.split(/\s+/).filter(w => w.length > 0).length} words</span>
                </div>

                <Button
                  onClick={generateSummary}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-full gradient-primary hover-glow"
                  size="lg"
                >
                  {isProcessing ? (
                    <motion.div
                      className="flex items-center space-x-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Generate Summary & Visuals
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {summaryData ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="concepts">Concepts</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
                  </TabsList>

                  {/* Summary Tab */}
                  <TabsContent value="summary">
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Intelligent Summary</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(summaryData.summary)}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="secondary">
                            {summaryData.readingTime} min read
                          </Badge>
                          <Badge variant={
                            summaryData.complexity === "Beginner" ? "default" :
                            summaryData.complexity === "Intermediate" ? "secondary" : "destructive"
                          }>
                            {summaryData.complexity}
                          </Badge>
                        </div>

                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground leading-relaxed">
                            {summaryData.summary}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Key Points:</h4>
                          <ul className="space-y-2">
                            {summaryData.keyPoints.map((point, index) => (
                              <motion.li
                                key={index}
                                className="flex items-start space-x-2 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Concepts Tab */}
                  <TabsContent value="concepts">
                    <Card className="glass-card p-6">
                      <h3 className="text-xl font-semibold mb-4">Main Concepts</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {summaryData.mainConcepts.map((concept, index) => (
                          <motion.div
                            key={index}
                            className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center hover-lift"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="font-medium text-primary">{concept}</span>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Visual Tab */}
                  <TabsContent value="visual">
                    <Card className="glass-card p-6">
                      <h3 className="text-xl font-semibold mb-4">Concept Frequency</h3>
                      <div className="space-y-3">
                        {summaryData.visualData.labels.map((label, index) => {
                          const value = summaryData.visualData.values[index];
                          const maxValue = Math.max(...summaryData.visualData.values);
                          const percentage = (value / maxValue) * 100;
                          
                          return (
                            <motion.div
                              key={label}
                              className="space-y-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                            >
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{label}</span>
                                <span className="text-muted-foreground">{value}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <motion.div
                                  className="h-3 bg-gradient-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Mind Map Tab */}
                  <TabsContent value="mindmap">
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Concept Mind Map</h3>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <div className="text-center text-muted-foreground">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">Interactive Mind Map</p>
                          <p className="text-sm">
                            Visual representation connecting your main concepts with related ideas
                          </p>
                          
                          {/* Simple Mind Map Representation */}
                          <div className="mt-6">
                            <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
                              {summaryData.mainConcepts.slice(0, 4).map((concept, index) => (
                                <motion.div
                                  key={concept}
                                  className="relative"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.3 }}
                                >
                                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium text-center p-2">
                                    {concept}
                                  </div>
                                  {index === 0 && (
                                    <div className="absolute top-1/2 left-full w-8 h-0.5 bg-primary transform -translate-y-1/2" />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <Card className="glass-card p-12 text-center h-full flex items-center justify-center">
                <div className="text-muted-foreground">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Enter text to generate your intelligent summary</p>
                  <p className="text-sm mt-2">
                    Get key concepts, visual aids, and mind maps automatically
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}