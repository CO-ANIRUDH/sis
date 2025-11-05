import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { setInterviewConfig } from "../store/slices/interviewSlice";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { PageHeader } from "./layout/PageHeader";
import { GradientButton } from "./common/GradientButton";
import { 
  ArrowLeft, 
  Play, 
  Settings, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  Info
} from "lucide-react";

interface InterviewSetupProps {
  onBack: () => void;
  onStart: (config: InterviewConfig) => void;
}

export interface InterviewConfig {
  jobProfile: string;
  interviewType: string;
  difficulty: string;
  mode: string;
  questionCount: number;
  timePerQuestion: number;
}

const jobProfiles = [
  { value: "Frontend Engineer", icon: "💻", description: "React, Vue, Angular, JavaScript" },
  { value: "Backend Engineer", icon: "⚙️", description: "Node.js, Python, Java, APIs" },
  { value: "Full Stack Engineer", icon: "🔄", description: "Frontend + Backend skills" },
  { value: "Data Scientist", icon: "📊", description: "Python, ML, Statistics" },
  { value: "Product Manager", icon: "📋", description: "Strategy, Analytics, Leadership" },
  { value: "Sales Executive", icon: "💼", description: "B2B/B2C Sales, CRM" },
  { value: "Marketing Manager", icon: "📈", description: "Digital Marketing, Growth" },
  { value: "UX Designer", icon: "🎨", description: "Design Systems, Prototyping" }
];

const interviewTypes = [
  { value: "Mixed", description: "Combination of technical and behavioral questions" },
  { value: "Technical", description: "Coding, system design, and technical concepts" },
  { value: "Behavioral", description: "Situational and experience-based questions" },
  { value: "HR", description: "Company culture and general interview questions" },
  { value: "Case Study", description: "Problem-solving and analytical thinking" }
];

const ConfigCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  children, 
  color = "blue",
  delay = "0s" 
}: {
  icon: any;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  color?: string;
  delay?: string;
}) => {
  const colorClasses = {
    blue: "hover:border-blue-200 dark:hover:border-blue-700 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    purple: "hover:border-purple-200 dark:hover:border-purple-700 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    green: "hover:border-green-200 dark:hover:border-green-700 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    orange: "hover:border-orange-200 dark:hover:border-orange-700 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    gray: "hover:border-gray-300 dark:hover:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
  };

  return (
    <Card className={`p-6 border-2 transition-all animate-slide-in-up hover:shadow-lg`} style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]?.split(' ').slice(2).join(' ')}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <Label className="text-lg font-semibold">{title}</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </Card>
  );
};

export const InterviewSetup = ({ onBack, onStart }: InterviewSetupProps) => {
  const dispatch = useAppDispatch();
  const [config, setConfig] = useState<InterviewConfig>({
    jobProfile: "Frontend Engineer",
    interviewType: "Mixed",
    difficulty: "Medium",
    mode: "Practice",
    questionCount: 5,
    timePerQuestion: 120
  });

  const handleStart = () => {
    dispatch(setInterviewConfig(config));
    onStart(config);
  };

  const estimatedTime = Math.ceil((config.questionCount * config.timePerQuestion) / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <PageHeader
        title="Configure Your Interview"
        subtitle="Customize your practice session to match your goals and skill level"
        icon={Settings}
        backButton={{
          label: "Back to Dashboard",
          onClick: onBack
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* Job Profile */}
              <ConfigCard icon={Target} title="Job Profile" subtitle="Select your target role" color="blue">
                <Select value={config.jobProfile} onValueChange={(value) => setConfig({ ...config, jobProfile: value })}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobProfiles.map((job) => (
                      <SelectItem key={job.value} value={job.value} className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{job.icon}</span>
                          <div>
                            <div className="font-medium">{job.value}</div>
                            <div className="text-xs text-gray-500">{job.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ConfigCard>

              {/* Interview Type */}
              <ConfigCard icon={Zap} title="Interview Type" subtitle="Choose question category" color="purple" delay="0.1s">
                <Select value={config.interviewType} onValueChange={(value) => setConfig({ ...config, interviewType: value })}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-3">
                        <div>
                          <div className="font-medium">{type.value}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ConfigCard>

              {/* Difficulty & Mode */}
              <div className="grid md:grid-cols-2 gap-6">
                <ConfigCard icon={Target} title="Difficulty Level" subtitle="Match your skill level" color="green" delay="0.2s">
                  <RadioGroup value={config.difficulty} onValueChange={(value) => setConfig({ ...config, difficulty: value })}>
                    <div className="space-y-3">
                      {["Easy", "Medium", "Hard", "Custom"].map((level) => (
                        <div key={level} className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          config.difficulty === level 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={level} id={level} />
                            <Label htmlFor={level} className="cursor-pointer font-medium flex-1">
                              {level}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </ConfigCard>

                <ConfigCard icon={Settings} title="Interview Mode" subtitle="Choose experience type" color="orange" delay="0.3s">
                  <RadioGroup value={config.mode} onValueChange={(value) => setConfig({ ...config, mode: value })}>
                    <div className="space-y-3">
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        config.mode === 'Practice' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="Practice" id="practice" className="mt-1" />
                          <div>
                            <Label htmlFor="practice" className="cursor-pointer font-medium">
                              Practice Mode 🎯
                            </Label>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Get instant feedback during interview
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        config.mode === 'Mock' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="Mock" id="mock" className="mt-1" />
                          <div>
                            <Label htmlFor="mock" className="cursor-pointer font-medium">
                              Mock Mode 🎭
                            </Label>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Real interview simulation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </ConfigCard>
              </div>

              {/* Session Settings */}
              <ConfigCard icon={Clock} title="Session Settings" subtitle="Customize duration and questions" color="gray" delay="0.4s">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">Questions</Label>
                      <Badge variant="secondary">{config.questionCount}</Badge>
                    </div>
                    <Slider
                      value={[config.questionCount]}
                      onValueChange={(value) => setConfig({ ...config, questionCount: value[0] })}
                      min={3}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>3</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium">Time per Question</Label>
                      <Badge variant="secondary">
                        {Math.floor(config.timePerQuestion / 60)}:{(config.timePerQuestion % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                    <Slider
                      value={[config.timePerQuestion]}
                      onValueChange={(value) => setConfig({ ...config, timePerQuestion: value[0] })}
                      min={60}
                      max={300}
                      step={30}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1m</span>
                      <span>5m</span>
                    </div>
                  </div>
                </div>
              </ConfigCard>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6 border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 animate-slide-in-right">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-semibold">Summary</h4>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                      <span className="text-sm font-medium">{config.jobProfile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="text-sm font-medium">{config.interviewType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <Badge variant="secondary">{config.difficulty}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
                      <span className="text-sm font-medium">{config.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Questions:</span>
                      <span className="text-sm font-medium">{config.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="text-sm font-medium">~{estimatedTime}m</span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg mb-6">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        Ensure quiet environment and stable internet
                      </p>
                    </div>
                  </div>

                  <GradientButton 
                    onClick={handleStart}
                    icon={Play}
                    className="w-full"
                    size="lg"
                  >
                    Start Interview
                  </GradientButton>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};