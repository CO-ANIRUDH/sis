import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";

interface SessionCardProps {
  session: {
    id: string;
    jobProfile: string;
    interviewType: string;
    difficulty: string;
    mode: string;
    startTime: string;
    status: string;
    overallScore?: number;
  };
  className?: string;
}

export const SessionCard = ({ session, className }: SessionCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 rounded-xl border-2 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-200 gap-4 group",
      className
    )}>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {session.jobProfile}
          </h4>
          <Badge variant="outline" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            {session.interviewType}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {session.difficulty}
          </Badge>
          {session.mode === 'Practice' ? (
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Practice
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
              Mock
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(session.startTime).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })} at{' '}
          {new Date(session.startTime).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      
      {session.status === 'completed' && session.overallScore !== undefined && (
        <div className="text-center">
          <div className={cn("text-4xl font-bold mb-2", getScoreColor(session.overallScore))}>
            {session.overallScore.toFixed(0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Score</p>
          <Progress 
            value={session.overallScore} 
            className="w-24 h-3"
          />
        </div>
      )}
      
      {session.status === 'in_progress' && (
        <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700">
          In Progress
        </Badge>
      )}
    </div>
  );
};