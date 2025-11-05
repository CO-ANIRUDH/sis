import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSessions, setStats, setLoading } from "../store/slices/interviewSlice";
import { toggleTheme } from "../store/slices/appSlice";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { api } from "../utils/api";
import { 
  Trophy, 
  Calendar, 
  Award,
  Play,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  Settings,
  Moon,
  Sun,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { Loading } from "./ui/loading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
  const dispatch = useAppDispatch();
  const { sessions, stats, loading } = useAppSelector((state) => state.interview);
  const { theme } = useAppSelector((state) => state.app);

  useEffect(() => {
    loadData();
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profile = await api.getProfile(accessToken);
      setProfileData(profile.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadData = async () => {
    dispatch(setLoading(true));
    try {
      const [profileData, sessionsData] = await Promise.all([
        api.getProfile(accessToken),
        api.getSessions(accessToken)
      ]);

      dispatch(setStats(profileData.stats || {
        totalSessions: 0,
        totalPoints: 0,
        bestScore: 0,
        currentStreak: 0,
      }));
      dispatch(setSessions(sessionsData.sessions || []));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getProgressChartData = () => {
    const completedSessions = sessions
      .filter((s: any) => s.status === 'completed' && s.overallScore !== undefined)
      .slice(-10)
      .map((s: any, index: number) => ({
        session: `Session ${index + 1}`,
        score: Math.round(s.overallScore || 0),
        date: new Date(s.startTime).toLocaleDateString()
      }));
    
    return completedSessions;
  };

  const averageScore = sessions
    .filter((s: any) => s.status === 'completed' && s.overallScore !== undefined)
    .reduce((sum: number, s: any) => sum + s.overallScore, 0) / 
    sessions.filter((s: any) => s.status === 'completed' && s.overallScore !== undefined).length || 0;

  const [profileData, setProfileData] = useState<any>(null);

  const handleResumeInterview = async () => {
    try {
      if (!profileData?.resumeUrl) {
        alert('Please upload your resume in Profile Settings first!');
        onViewProfile();
        return;
      }
      onStartInterview();
    } catch (error) {
      console.error('Error checking resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => dispatch(toggleTheme())}
        className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
      >
        {theme === 'light' ? 
          <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : 
          <Sun className="w-4 h-4 text-yellow-500" />
        }
      </Button>
      <Button 
        variant="outline" 
        onClick={onViewProfile}
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:scale-105"
      >
        <Settings className="w-4 h-4" />
        <span className="font-medium">Profile</span>
      </Button>
      <Button 
        onClick={onStartInterview}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Interview
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your interview progress</p>
              </div>
            </div>
            {headerActions}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ready to ace your next interview? Let's continue your practice journey and improve your skills.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Points</p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalPoints}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Best Score</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {stats.bestScore?.toFixed(0) || averageScore.toFixed(0) || 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Streak</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.currentStreak} 🔥</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all cursor-pointer" onClick={onStartInterview}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">Start Interview</h3>
            <p className="text-purple-600 dark:text-purple-400">AI-powered practice session</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all cursor-pointer" onClick={() => handleResumeInterview()}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">Resume Interview</h3>
            <p className="text-orange-600 dark:text-orange-400">AI analyzes your resume</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all cursor-pointer" onClick={onViewLeaderboard}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Leaderboard</h3>
            <p className="text-blue-600 dark:text-blue-400">See your ranking</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-all cursor-pointer" onClick={onViewProfile}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">Profile Settings</h3>
            <p className="text-emerald-600 dark:text-emerald-400">Manage account</p>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Sessions</h3>
                <p className="text-gray-600 dark:text-gray-400">Your latest practice sessions</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {sessions.length} Total
            </Badge>
          </div>
          
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      session.status === 'completed' ? 'bg-green-500' :
                      session.status === 'in_progress' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{session.jobProfile || 'Interview Session'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {session.overallScore ? `${session.overallScore.toFixed(0)}%` : 'In Progress'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{session.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sessions yet</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start your first interview to see your progress!</p>
              <Button 
                onClick={onStartInterview} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Your First Interview
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};