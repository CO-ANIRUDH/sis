import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { ArrowLeft, Play } from "lucide-react";

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
  "Frontend Engineer",
  "Backend Engineer", 
  "Full Stack Engineer",
  "Data Scientist",
  "Product Manager",
  "Sales Executive",
  "Marketing Manager",
  "UX Designer"
];

const interviewTypes = [
  "Mixed",
  "Technical",
  "Behavioral",
  "HR",
  "Case Study"
];

export const InterviewSetup = ({ onBack, onStart }: InterviewSetupProps) => {
  const [config, setConfig] = useState<InterviewConfig>({
    jobProfile: "Frontend Engineer",
    interviewType: "Mixed",
    difficulty: "Medium",
    mode: "Practice",
    questionCount: 5,
    timePerQuestion: 120
  });

  const handleStart = () => {
    onStart(config);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <h2 className="mb-8">Configure Your Interview</h2>

            <div className="space-y-8">
              {/* Job Profile */}
              <div>
                <Label className="text-lg mb-3 block">Job Profile</Label>
                <Select value={config.jobProfile} onValueChange={(value) => setConfig({ ...config, jobProfile: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobProfiles.map((job) => (
                      <SelectItem key={job} value={job}>{job}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Type */}
              <div>
                <Label className="text-lg mb-3 block">Interview Type</Label>
                <Select value={config.interviewType} onValueChange={(value) => setConfig({ ...config, interviewType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div>
                <Label className="text-lg mb-3 block">Difficulty Level</Label>
                <RadioGroup value={config.difficulty} onValueChange={(value) => setConfig({ ...config, difficulty: value })}>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="Easy" id="easy" />
                      <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="Medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="Hard" id="hard" />
                      <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="Custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Mode */}
              <div>
                <Label className="text-lg mb-3 block">Interview Mode</Label>
                <RadioGroup value={config.mode} onValueChange={(value) => setConfig({ ...config, mode: value })}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="Practice" id="practice" />
                        <Label htmlFor="practice" className="cursor-pointer">Practice Mode</Label>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Get instant feedback and tips during the interview
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="Mock" id="mock" />
                        <Label htmlFor="mock" className="cursor-pointer">Mock Mode</Label>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Simulate a real interview with feedback at the end
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Number of Questions */}
              <div>
                <Label className="text-lg mb-3 block">
                  Number of Questions: {config.questionCount}
                </Label>
                <Slider
                  value={[config.questionCount]}
                  onValueChange={(value) => setConfig({ ...config, questionCount: value[0] })}
                  min={3}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>3 questions</span>
                  <span>10 questions</span>
                </div>
              </div>

              {/* Time per Question */}
              <div>
                <Label className="text-lg mb-3 block">
                  Time per Question: {Math.floor(config.timePerQuestion / 60)}:{(config.timePerQuestion % 60).toString().padStart(2, '0')}
                </Label>
                <Slider
                  value={[config.timePerQuestion]}
                  onValueChange={(value) => setConfig({ ...config, timePerQuestion: value[0] })}
                  min={60}
                  max={300}
                  step={30}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 minute</span>
                  <span>5 minutes</span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="mb-3">Interview Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Job Role:</p>
                    <p>{config.jobProfile}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type:</p>
                    <p>{config.interviewType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Difficulty:</p>
                    <p>{config.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mode:</p>
                    <p>{config.mode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Questions:</p>
                    <p>{config.questionCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estimated Time:</p>
                    <p>{Math.ceil((config.questionCount * config.timePerQuestion) / 60)} minutes</p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button onClick={handleStart} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
