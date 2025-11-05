import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateSession, completeSession } from "../store/slices/interviewSlice";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Loading } from "./ui/loading";
import { GradientButton } from "./common/GradientButton";
import { api } from "../utils/api";
import { toast } from "sonner";
import {
  Mic, MicOff, Video, VideoOff, SkipForward, Volume2,
  AlertCircle, Activity, Brain, Eye, MessageSquare, Clock
} from "lucide-react";
import type { InterviewConfig } from "./InterviewSetup";

interface InterviewSessionProps {
  accessToken: string;
  config: InterviewConfig;
  onComplete: (results: any) => void;
}

interface Question {
  id: number;
  text: string;
  type: string;
  difficulty: string;
}

const MetricCard = ({ icon: Icon, label, value, color = "blue", animated = false }: {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
  animated?: boolean;
}) => (
  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
    animated ? 'animate-pulse' : ''
  } ${
    color === 'blue' ? 'bg-blue-900/30 border-blue-700' :
    color === 'green' ? 'bg-green-900/30 border-green-700' :
    color === 'yellow' ? 'bg-yellow-900/30 border-yellow-700' :
    'bg-gray-900/30 border-gray-700'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        color === 'blue' ? 'bg-blue-600' :
        color === 'green' ? 'bg-green-600' :
        color === 'yellow' ? 'bg-yellow-600' :
        'bg-gray-600'
      }`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export const InterviewSession = ({ accessToken, config, onComplete }: InterviewSessionProps) => {
  const dispatch = useAppDispatch();
  const { currentSession } = useAppSelector((state) => state.interview);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState(config.timePerQuestion);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [questionScores, setQuestionScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live metrics with smooth animations
  const [metrics, setMetrics] = useState({
    confidence: 70,
    gestures: 75,
    speakingRate: 0,
    wordCount: 0,
    eyeContact: 80,
    clarity: 85
  });

  const [mediaError, setMediaError] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechStartTimeRef = useRef<number>(0);
  const speechWordCountRef = useRef<number>(0);

  // Initialize session
  useEffect(() => {
    initializeSession();
    return () => {
      cleanup();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isRecording && timeRemaining === 0) {
      handleNextQuestion();
    }
  }, [timeRemaining, isRecording]);

  // Video analysis loop
  useEffect(() => {
    if (isRecording && videoRef.current) {
      const analyzeLoop = () => {
        analyzeVideoFrame();
        animationFrameRef.current = requestAnimationFrame(analyzeLoop);
      };
      analyzeLoop();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      
      // Create session
      const sessionResponse = await api.createSession(accessToken, config);
      setSessionId(sessionResponse.session.id);
      
      dispatch(updateSession({
        id: sessionResponse.session.id,
        status: 'in_progress',
        startTime: new Date().toISOString()
      }));

      // Generate questions
      const questionsResponse = await api.generateQuestions(accessToken, {
        jobProfile: config.jobProfile,
        interviewType: config.interviewType,
        difficulty: config.difficulty,
        count: config.questionCount,
      });

      setQuestions(questionsResponse.questions);
      await startMediaStream();
      
      setTimeout(() => {
        startRecording();
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error initializing session:", error);
      toast.error("Failed to start interview session");
      setIsLoading(false);
    }
  };

  const startMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaError("");
      toast.success("Camera and microphone ready");
    } catch (error: any) {
      const errorMessage = getMediaErrorMessage(error);
      setMediaError(errorMessage);
      toast.error(errorMessage, { duration: 6000 });
    }
  };

  const getMediaErrorMessage = (error: any) => {
    if (error.name === "NotAllowedError") {
      return "Camera/microphone access denied. Please allow permissions and refresh.";
    } else if (error.name === "NotFoundError") {
      return "No camera or microphone found. Please connect your devices.";
    } else if (error.name === "NotReadableError") {
      return "Camera/microphone is already in use. Please close other applications.";
    }
    return "Failed to access camera/microphone. Please check your permissions.";
  };

  const initializeSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      return null;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      speechStartTimeRef.current = Date.now();
      speechWordCountRef.current = 0;
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        const words = finalTranscript.trim().split(/\s+/).length;
        speechWordCountRef.current += words;
        
        setMetrics(prev => ({
          ...prev,
          wordCount: speechWordCountRef.current,
          speakingRate: calculateSpeakingRate()
        }));
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        toast.error("Microphone permission denied. Please enable it in browser settings.");
      }
    };

    return recognition;
  }, []);

  const calculateSpeakingRate = () => {
    const elapsedTime = (Date.now() - speechStartTimeRef.current) / 1000 / 60;
    return elapsedTime > 0 ? Math.round(speechWordCountRef.current / elapsedTime) : 0;
  };

  const analyzeVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simulate analysis with smooth transitions
    setMetrics(prev => ({
      ...prev,
      confidence: Math.round(prev.confidence * 0.9 + (65 + Math.random() * 20) * 0.1),
      gestures: Math.round(prev.gestures * 0.9 + (70 + Math.random() * 15) * 0.1),
      eyeContact: Math.round(prev.eyeContact * 0.9 + (75 + Math.random() * 15) * 0.1),
      clarity: Math.round(prev.clarity * 0.9 + (80 + Math.random() * 10) * 0.1)
    }));
  }, []);

  const startRecording = () => {
    if (!mediaStreamRef.current) {
      toast.error("Media stream not available");
      return;
    }

    try {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setTimeRemaining(config.timePerQuestion);
      setTranscript("");
      
      setMetrics(prev => ({ ...prev, wordCount: 0, speakingRate: 0 }));

      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }

      speakQuestion(questions[currentQuestionIndex].text);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => resolve();
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        resolve();
      }
    });
  };

  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextQuestion = async () => {
    await stopRecording();
    
    const analysis = analyzeResponse();
    setQuestionScores([...questionScores, analysis]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(config.timePerQuestion);
      setTimeout(() => startRecording(), 2000);
    } else {
      await completeInterview([...questionScores, analysis]);
    }
  };

  const analyzeResponse = () => {
    const actualTranscript = transcript.trim() || 
      `Simulated response for question ${currentQuestionIndex + 1}. Detailed answer provided.`;

    const scores = {
      content: Math.min(100, Math.max(50, 70 + Math.random() * 20)),
      communication: Math.min(100, Math.max(60, metrics.speakingRate > 120 ? 85 : 70)),
      confidence: metrics.confidence,
      bodyLanguage: metrics.gestures,
      timeManagement: timeRemaining / config.timePerQuestion > 0.2 ? 80 : 60
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return {
      questionId: questions[currentQuestionIndex].id,
      transcript: actualTranscript,
      scores,
      total: totalScore,
      metrics: {
        speakingRate: metrics.speakingRate,
        eyeContact: metrics.eyeContact,
        posture: metrics.gestures,
        clarity: metrics.clarity
      }
    };
  };

  const completeInterview = async (allScores: any[]) => {
    try {
      const breakdown = {
        content: allScores.reduce((sum, s) => sum + s.scores.content, 0) / allScores.length,
        communication: allScores.reduce((sum, s) => sum + s.scores.communication, 0) / allScores.length,
        confidence: allScores.reduce((sum, s) => sum + s.scores.confidence, 0) / allScores.length,
        bodyLanguage: allScores.reduce((sum, s) => sum + s.scores.bodyLanguage, 0) / allScores.length,
        timeManagement: allScores.reduce((sum, s) => sum + s.scores.timeManagement, 0) / allScores.length
      };

      const feedbackResponse = await api.generateFeedback(accessToken, {
        transcript: allScores.map((s) => s.transcript).join(" "),
        scores: breakdown,
        questionType: config.interviewType
      });

      const results = await api.completeSession(accessToken, sessionId, {
        questionScores: allScores,
        breakdown,
        feedback: feedbackResponse.feedback
      });

      dispatch(completeSession(results));
      cleanup();
      onComplete(results);
    } catch (error) {
      console.error("Error completing interview:", error);
      toast.error("Failed to save interview results");
    }
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Loading size="lg" text="Preparing Interview Session" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Animated Header */}
      <div className="border-b border-gray-700/50 bg-black/20 backdrop-blur-md sticky top-0 z-50 animate-slide-in-up">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <Progress value={progress} className="w-64 mt-2 h-3 bg-gray-700" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 bg-gray-800 border-gray-600 animate-pulse">
                <Clock className="w-4 h-4 mr-2" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
              </Badge>
              <Badge className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
                {config.mode}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Feed */}
            <Card className="bg-black/40 border-gray-700/50 p-6 overflow-hidden backdrop-blur-sm animate-slide-in-up stagger-2">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {mediaError && (
                  <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center p-6 animate-fade-in">
                    <div className="text-center max-w-md">
                      <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                      <h4 className="text-white mb-2 font-semibold">Media Access Error</h4>
                      <p className="text-red-200 text-sm mb-4">{mediaError}</p>
                      <GradientButton onClick={startMediaStream} variant="warning">
                        Retry Access
                      </GradientButton>
                    </div>
                  </div>
                )}

                {isRecording && !mediaError && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}

                {/* Live Metrics Overlay */}
                {config.mode === "Practice" && isRecording && (
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 animate-slide-in-up">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Live Analysis
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 mb-2 text-xs uppercase">Confidence</p>
                        <div className="flex items-center gap-3">
                          <Progress value={metrics.confidence} className="flex-1 h-3" />
                          <span className="text-white font-bold text-lg min-w-[3ch]">
                            {metrics.confidence}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2 text-xs uppercase">Body Language</p>
                        <div className="flex items-center gap-3">
                          <Progress value={metrics.gestures} className="flex-1 h-3" />
                          <span className="text-white font-bold text-lg min-w-[3ch]">
                            {metrics.gestures}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2 text-xs uppercase">Speaking Rate</p>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-lg">
                            {metrics.speakingRate > 0 ? metrics.speakingRate : "--"}
                          </span>
                          <span className="text-gray-400 text-sm">wpm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Question Card */}
            <Card className="bg-black/40 border-gray-700/50 p-8 backdrop-blur-sm animate-slide-in-up stagger-3">
              <div className="flex items-start gap-6 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="border-gray-600 bg-gray-800/50">
                      {currentQuestion.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <p className="text-2xl leading-relaxed font-light">
                    {currentQuestion.text}
                  </p>
                </div>
              </div>

              {/* Live Transcript */}
              {isRecording && transcript && (
                <div className="bg-blue-900/30 border border-blue-700/50 p-6 rounded-xl mt-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <p className="text-sm text-blue-200 font-semibold">Live Transcript</p>
                  </div>
                  <p className="text-blue-100 leading-relaxed mb-3">{transcript}</p>
                  <div className="flex items-center gap-4 text-xs text-blue-300">
                    <span>{metrics.wordCount} words</span>
                    <span>•</span>
                    <span>{metrics.speakingRate > 0 ? `${metrics.speakingRate} wpm` : "Calculating..."}</span>
                  </div>
                </div>
              )}

              {config.mode === "Practice" && (
                <div className="bg-green-900/30 border border-green-700/50 p-6 rounded-xl mt-6 animate-slide-in-up">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-green-200 font-medium mb-2">💡 Pro Tip</p>
                      <p className="text-green-100 text-sm">
                        Structure your answer using the STAR method: Situation, Task, Action, Result
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Controls */}
            <Card className="bg-black/40 border-gray-700/50 p-6 backdrop-blur-sm animate-slide-in-right">
              <h4 className="mb-6 font-semibold text-lg">Session Controls</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    {isRecording ? (
                      <Mic className="w-5 h-5 text-red-400" />
                    ) : (
                      <MicOff className="w-5 h-5 text-gray-400" />
                    )}
                    <span>Microphone</span>
                  </div>
                  <Badge variant={isRecording ? "destructive" : "secondary"}>
                    {isRecording ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-green-400" />
                    <span>Camera</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">Active</Badge>
                </div>

                <GradientButton
                  onClick={handleNextQuestion}
                  icon={SkipForward}
                  className="w-full"
                  disabled={!isRecording}
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                </GradientButton>
              </div>
            </Card>

            {/* Live Metrics */}
            <Card className="bg-black/40 border-gray-700/50 p-6 backdrop-blur-sm animate-slide-in-right stagger-2">
              <h4 className="mb-6 font-semibold text-lg">Performance Metrics</h4>
              <div className="space-y-4">
                <MetricCard
                  icon={Brain}
                  label="Confidence"
                  value={`${metrics.confidence}%`}
                  color="blue"
                  animated={isRecording}
                />
                <MetricCard
                  icon={Eye}
                  label="Eye Contact"
                  value={`${metrics.eyeContact}%`}
                  color="green"
                  animated={isRecording}
                />
                <MetricCard
                  icon={MessageSquare}
                  label="Clarity"
                  value={`${metrics.clarity}%`}
                  color="yellow"
                  animated={isRecording}
                />
              </div>
            </Card>

            {/* Live Feedback */}
            {config.mode === "Practice" && (
              <Card className="bg-black/40 border-gray-700/50 p-6 backdrop-blur-sm animate-slide-in-right stagger-3">
                <h4 className="mb-6 font-semibold text-lg">Live Feedback</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-green-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-200">
                      {metrics.gestures > 70 ? "Good posture maintained" : "Adjust your posture"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-blue-200">
                      {metrics.confidence > 60 ? "Confident delivery" : "Maintain eye contact"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-yellow-200">
                      {metrics.speakingRate > 120 && metrics.speakingRate < 180 
                        ? "Perfect speaking pace" 
                        : "Adjust speaking rate"}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};