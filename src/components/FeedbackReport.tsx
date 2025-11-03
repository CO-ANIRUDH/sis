import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy, 
  TrendingUp, 
  Award,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Home
} from "lucide-react";

interface FeedbackReportProps {
  results: any;
  onBackToDashboard: () => void;
}

export const FeedbackReport = ({ results, onBackToDashboard }: FeedbackReportProps) => {
  const { session, stats } = results;
  const { overallScore, breakdown, feedback, points } = session;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Here's your detailed performance analysis</p>
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-6 text-center">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Overall Score</p>
              <div className={`text-6xl mb-2 ${getScoreColor(overallScore)}`}>
                {overallScore.toFixed(0)}
              </div>
              <p className="text-2xl text-gray-600">Grade: {getGrade(overallScore)}</p>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <p className="text-2xl">{points}</p>
                </div>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <p className="text-2xl">{stats.currentStreak}</p>
                </div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <p className="text-2xl">{stats.totalSessions}</p>
                </div>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card className="p-6 mb-6">
            <h3 className="mb-6">Performance Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Content Knowledge</span>
                  <span className={getScoreColor(breakdown.content)}>
                    {breakdown.content.toFixed(0)}%
                  </span>
                </div>
                <Progress value={breakdown.content} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Communication Skills</span>
                  <span className={getScoreColor(breakdown.communication)}>
                    {breakdown.communication.toFixed(0)}%
                  </span>
                </div>
                <Progress value={breakdown.communication} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Confidence</span>
                  <span className={getScoreColor(breakdown.confidence)}>
                    {breakdown.confidence.toFixed(0)}%
                  </span>
                </div>
                <Progress value={breakdown.confidence} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Body Language & Gestures</span>
                  <span className={getScoreColor(breakdown.bodyLanguage)}>
                    {breakdown.bodyLanguage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={breakdown.bodyLanguage} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Time Management</span>
                  <span className={getScoreColor(breakdown.timeManagement)}>
                    {breakdown.timeManagement.toFixed(0)}%
                  </span>
                </div>
                <Progress value={breakdown.timeManagement} />
              </div>
            </div>
          </Card>

          {/* Feedback Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3>Strengths</h3>
              </div>
              <ul className="space-y-2">
                {feedback.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3>Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Overall Feedback */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Overall Feedback</h3>
            <p className="text-gray-700 leading-relaxed">{feedback.overallFeedback}</p>
          </Card>

          {/* Recommended Exercises */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3>Recommended Practice</h3>
            </div>
            <div className="space-y-3">
              {feedback.exercises.map((exercise: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Badge className="mt-0.5">{index + 1}</Badge>
                  <p className="text-gray-700">{exercise}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={onBackToDashboard} size="lg" className="flex-1">
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <TrendingUp className="w-5 h-5 mr-2" />
              Practice Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
