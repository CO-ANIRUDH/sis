import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setAuth, clearAuth, setLoading } from "./store/slices/authSlice";
import { setCurrentScreen, setNeedsOnboarding } from "./store/slices/appSlice";
import { setInterviewConfig, completeSession, clearCurrentSession, setSessions, setStats } from "./store/slices/interviewSlice";
import { useAuth } from "./utils/useAuth";
import { ThemeProvider } from "./components/ThemeProvider";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { InterviewSetup, InterviewConfig } from "./components/InterviewSetup";
import { InterviewSession } from "./components/InterviewSession";
import { FeedbackReport } from "./components/FeedbackReport";
import { Leaderboard } from "./components/Leaderboard";
import { ProfileSettings } from "./components/ProfileSettings";
import { Toaster } from "./components/ui/sonner";
import { Loading } from "./components/ui/loading";
import { api } from "./utils/api";

export default function App() {
  const dispatch = useAppDispatch();
  const { user, session, loading: authLoading } = useAuth();
  const { currentScreen, needsOnboarding } = useAppSelector((state) => state.app);
  const { currentConfig, sessionResults } = useAppSelector((state) => state.interview);

  useEffect(() => {
    if (!authLoading) {
      if (user && session) {
        dispatch(setAuth({ user, session }));
        checkOnboardingStatus();
      } else {
        dispatch(clearAuth());
        dispatch(setCurrentScreen('landing'));
      }
    }
  }, [user, session, authLoading, dispatch]);

  const checkOnboardingStatus = async () => {
    try {
      const accessToken = session?.access_token;
      if (!accessToken) return;

      const response = await api.getProfile(accessToken);
      const profile = response.profile;

      if (!profile.consentTimestamp || !profile.jobPreferences || profile.jobPreferences.length === 0) {
        dispatch(setNeedsOnboarding(true));
        dispatch(setCurrentScreen('onboarding'));
      } else {
        dispatch(setNeedsOnboarding(false));
        dispatch(setCurrentScreen('dashboard'));
        loadDashboardData(accessToken);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      dispatch(setNeedsOnboarding(true));
      dispatch(setCurrentScreen('onboarding'));
    }
  };

  const loadDashboardData = async (accessToken: string) => {
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
    }
  };

  const handleGetStarted = () => {
    dispatch(setCurrentScreen('auth'));
  };

  const handleAuthSuccess = () => {
    // Auth hook will update and trigger the useEffect
  };

  const handleOnboardingComplete = () => {
    dispatch(setNeedsOnboarding(false));
    dispatch(setCurrentScreen('dashboard'));
    if (session?.access_token) {
      loadDashboardData(session.access_token);
    }
  };

  const handleStartInterview = () => {
    dispatch(setCurrentScreen('setup'));
  };

  const handleInterviewStart = (config: InterviewConfig) => {
    dispatch(setInterviewConfig(config));
    dispatch(setCurrentScreen('session'));
  };

  const handleInterviewComplete = (results: any) => {
    dispatch(completeSession(results));
    dispatch(setCurrentScreen('feedback'));
  };

  const handleBackToDashboard = () => {
    dispatch(setCurrentScreen('dashboard'));
    dispatch(clearCurrentSession());
    if (session?.access_token) {
      loadDashboardData(session.access_token);
    }
  };

  const handleViewLeaderboard = () => {
    dispatch(setCurrentScreen('leaderboard'));
  };

  const handleViewProfile = () => {
    dispatch(setCurrentScreen('profile'));
  };

  const handleSignOut = () => {
    dispatch(clearAuth());
    dispatch(setCurrentScreen('landing'));
    dispatch(clearCurrentSession());
  };

  // Enhanced loading state with better UI
  if (authLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center transition-colors duration-300">
          <Loading 
            size="lg" 
            text="Loading Smart Interview System" 
            className="animate-fade-in"
          />
        </div>
      </ThemeProvider>
    );
  }

  const accessToken = session?.access_token || '';

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      
      {currentScreen === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {currentScreen === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}

      {currentScreen === 'onboarding' && accessToken && (
        <Onboarding 
          accessToken={accessToken}
          onComplete={handleOnboardingComplete}
        />
      )}

      {currentScreen === 'dashboard' && accessToken && (
        <Dashboard
          accessToken={accessToken}
          onStartInterview={handleStartInterview}
          onViewLeaderboard={handleViewLeaderboard}
          onViewProfile={handleViewProfile}
        />
      )}

      {currentScreen === 'setup' && (
        <InterviewSetup
          onBack={handleBackToDashboard}
          onStart={handleInterviewStart}
        />
      )}

      {currentScreen === 'session' && accessToken && currentConfig && (
        <InterviewSession
          accessToken={accessToken}
          config={currentConfig}
          onComplete={handleInterviewComplete}
        />
      )}

      {currentScreen === 'feedback' && sessionResults && (
        <FeedbackReport
          results={sessionResults}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {currentScreen === 'leaderboard' && (
        <Leaderboard onBack={handleBackToDashboard} />
      )}

      {currentScreen === 'profile' && accessToken && (
        <ProfileSettings
          accessToken={accessToken}
          onBack={handleBackToDashboard}
          onSignOut={handleSignOut}
        />
      )}
      </div>
    </ThemeProvider>
  );
}