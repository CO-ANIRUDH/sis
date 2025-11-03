import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { api } from "../utils/api";
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Award,
  Play,
  BarChart3,
  Users,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DashboardProps {
  accessToken: string;
  onStartInterview: () => void;
  onViewLeaderboard: () => void;
  onViewProfile: () => void;
}

export const Dashboard = ({ 
  accessToken, 
  onStartInterview, 
  onViewLeaderboard,
  onViewProfile 
}: DashboardProps) => {
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, sessionsData] = await Promise.all([
        api.getProfile(accessToken),
        api.getSessions(accessToken)
      ]);

      setStats(profileData.stats);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressChartData = () => {
    return sessions
      .filter((s: any) => s.status === 'completed')
      .slice(0, 10)
      .reverse()
      .map((s: any, index: number) => ({
        session: `#${index + 1}`,
        score: s.overallScore || 0
      }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const averageScore = sessions
    .filter((s: any) => s.status === 'completed' && s.overallScore !== undefined)
    .reduce((sum: number, s: any) => sum + s.overallScore, 0) / 
    sessions.filter((s: any) => s.status === 'completed' && s.overallScore !== undefined).length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-gray-600 mt-1">Track your interview practice progress</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onViewProfile} className="hidden sm:flex">
                Profile
              </Button>
              <Button onClick={onStartInterview} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats?.totalSessions || 0}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Keep practicing!</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats?.totalPoints || 0}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Points earned</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-green-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.bestScore?.toFixed(0) || averageScore.toFixed(0) || 0}
            </p>
            <Progress 
              value={stats?.bestScore || averageScore || 0} 
              className="h-2 mt-2"
            />
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {stats?.currentStreak || 0}
              <span className="text-2xl ml-2">🔥</span>
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Days in a row</span>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Progress Chart */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Progress Over Time</h3>
                <p className="text-sm text-gray-600 mt-1">Your performance trends</p>
              </div>
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </div>
            {getProgressChartData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getProgressChartData()}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="session" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#colorScore)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <BarChart3 className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg mb-2">No session data yet</p>
                <p className="text-sm mb-4">Start your first interview to see your progress!</p>
                <Button onClick={onStartInterview} size="sm">
                  Get Started
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border-2">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600 mb-6">Get started with your next practice session</p>
            <div className="space-y-3">
              <Button 
                onClick={onStartInterview} 
                className="w-full justify-start h-auto py-4 text-left bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all" 
                size="lg"
              >
                <Play className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Start New Interview Practice</div>
                  <div className="text-xs opacity-90">Practice with AI-powered questions</div>
                </div>
              </Button>
              <Button 
                onClick={onViewLeaderboard} 
                variant="outline" 
                className="w-full justify-start h-auto py-4 text-left border-2 hover:bg-gray-50" 
                size="lg"
              >
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">View Leaderboard</div>
                  <div className="text-xs text-gray-600">See how you rank</div>
                </div>
              </Button>
              <Button 
                onClick={onViewProfile} 
                variant="outline" 
                className="w-full justify-start h-auto py-4 text-left border-2 hover:bg-gray-50" 
                size="lg"
              >
                <Award className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Update Profile & Settings</div>
                  <div className="text-xs text-gray-600">Customize your preferences</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Interview Sessions</h3>
              <p className="text-sm text-gray-600 mt-1">Your latest practice sessions</p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              {sessions.length} Total
            </Badge>
          </div>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session: any) => (
                <div 
                  key={session.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 hover:border-blue-200 hover:shadow-md transition-all gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{session.jobProfile}</h4>
                      <Badge variant="outline" className="border-gray-300">{session.interviewType}</Badge>
                      <Badge variant="secondary">{session.difficulty}</Badge>
                      {session.mode === 'Practice' ? (
                        <Badge className="bg-blue-600">Practice</Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-400">Mock</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
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
                    <div className="text-right sm:text-left">
                      <div className={`text-3xl font-bold ${getScoreColor(session.overallScore)} mb-1`}>
                        {session.overallScore.toFixed(0)}
                      </div>
                      <p className="text-sm text-gray-600">Score</p>
                      <Progress 
                        value={session.overallScore} 
                        className="w-20 sm:w-full mt-2 h-2"
                      />
                    </div>
                  )}
                  {session.status === 'in_progress' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-600 mb-2">No sessions yet</p>
              <p className="text-sm text-gray-500 mb-6">Start your first interview practice to see your history here!</p>
              <Button onClick={onStartInterview} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Play className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
