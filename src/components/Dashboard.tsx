import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSessions, setStats, setLoading } from "../store/slices/interviewSlice";
import { toggleTheme } from "../store/slices/appSlice";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  Zap,
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { Loading } from "./ui/loading";
import { StatCard } from "./common/StatCard";
import { GradientButton } from "./common/GradientButton";
import { SessionCard } from "./common/SessionCard";
import { PageHeader } from "./layout/PageHeader";
import { EmptyState } from "./common/EmptyState";
import { Chart } from "./common/Chart";

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
  }, []);

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
    return sessions
      .filter((s: any) => s.status === 'completed')
      .slice(0, 10)
      .reverse()
      .map((s: any, index: number) => ({
        session: `#${index + 1}`,
        score: s.overallScore || 0
      }));
  };

  const averageScore = sessions
    .filter((s: any) => s.status === 'completed' && s.overallScore !== undefined)
    .reduce((sum: number, s: any) => sum + s.overallScore, 0) / 
    sessions.filter((s: any) => s.status === 'completed' && s.overallScore !== undefined).length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <Loading size="lg" text="Loading Dashboard" className="animate-fade-in" />
      </div>
    );
  }

  const headerActions = (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => dispatch(toggleTheme())}
        className="hidden sm:flex border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </Button>
      <Button 
        variant="outline" 
        onClick={onViewProfile} 
        className="hidden sm:flex border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Settings className="w-4 h-4 mr-2" />
        Profile
      </Button>
      <GradientButton onClick={onStartInterview} icon={Play} size="lg">
        Start Interview
      </GradientButton>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <PageHeader
        title="Dashboard"
        subtitle="Track your interview practice progress"
        icon={BarChart3}
        actions={headerActions}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Calendar}
            subtitle="Keep practicing!"
            color="blue"
            className="animate-slide-in-up"
          />
          <StatCard
            title="Total Points"
            value={stats.totalPoints}
            icon={Trophy}
            subtitle="Points earned"
            color="yellow"
            className="animate-slide-in-up stagger-2"
          />
          <StatCard
            title="Best Score"
            value={stats.bestScore?.toFixed(0) || averageScore.toFixed(0) || 0}
            icon={Award}
            color="green"
            progress={stats.bestScore || averageScore || 0}
            className="animate-slide-in-up stagger-3"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} 🔥`}
            icon={Zap}
            subtitle="Days in a row"
            color="orange"
            className="animate-slide-in-up stagger-4"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Chart */}
          <Chart
            title="Progress Over Time"
            subtitle="Your performance trends"
            icon={BarChart3}
            data={getProgressChartData()}
            dataKey="score"
            xAxisKey="session"
            color="#3b82f6"
            height={300}
            emptyState={{
              icon: BarChart3,
              title: "No session data yet",
              description: "Start your first interview to see your progress!",
              action: {
                label: "Get Started",
                onClick: onStartInterview,
                icon: Play
              }
            }}
            className="lg:col-span-2 animate-slide-in-up"
            style={{ animationDelay: '0.4s' }}
          />

          {/* Quick Actions */}
          <Card className="p-6 border-2 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 animate-slide-in-up stagger-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get started with your next practice</p>
              </div>
            </div>
            <div className="space-y-4">
              <GradientButton 
                onClick={onStartInterview}
                icon={Play}
                className="w-full justify-start h-auto py-4 text-left"
              >
                <div>
                  <div className="font-semibold">Start New Interview</div>
                  <div className="text-xs opacity-90">AI-powered practice session</div>
                </div>
              </GradientButton>
              
              <Button 
                onClick={onViewLeaderboard} 
                variant="outline" 
                className="w-full justify-start h-auto py-4 text-left border-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all" 
                size="lg"
              >
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">View Leaderboard</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">See how you rank</div>
                </div>
              </Button>
              
              <Button 
                onClick={onViewProfile} 
                variant="outline" 
                className="w-full justify-start h-auto py-4 text-left border-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all" 
                size="lg"
              >
                <Settings className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-semibold">Profile & Settings</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Customize preferences</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="p-6 border-2 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-700/30 animate-slide-in-up stagger-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Interview Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your latest practice sessions</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {sessions.length} Total
            </Badge>
          </div>
          
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session: any, index: number) => (
                <SessionCard 
                  key={session.id} 
                  session={session}
                  className="animate-slide-in-up"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No sessions yet"
              description="Start your first interview practice to see your history and track your progress over time!"
              action={{
                label: "Start Your First Interview",
                onClick: onStartInterview,
                icon: Play
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};