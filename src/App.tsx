import { useEffect, useState } from "react";
import { useAuth } from "./utils/useAuth";
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
import { api } from "./utils/api";

type AppScreen = 
  | 'landing'
  | 'auth'
  | 'onboarding'
  | 'dashboard'
  | 'setup'
  | 'session'
  | 'feedback'
  | 'leaderboard'
  | 'profile';

export default function App() {
  const { user, session, loading: authLoading } = useAuth();
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [sessionResults, setSessionResults] = useState<any>(null);

  useEffect(() => {
    if (!authLoading) {
      if (user && session) {
        checkOnboardingStatus();
      } else {
        setScreen('landing');
      }
    }
  }, [user, session, authLoading]);

  const checkOnboardingStatus = async () => {
    try {
      const accessToken = session?.access_token;
      if (!accessToken) return;

      const response = await api.getProfile(accessToken);
      const profile = response.profile;

      // Check if user needs onboarding
      if (!profile.consentTimestamp || !profile.jobPreferences || profile.jobPreferences.length === 0) {
        setNeedsOnboarding(true);
        setScreen('onboarding');
      } else {
        setNeedsOnboarding(false);
        setScreen('dashboard');
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // Default to onboarding if we can't check
      setNeedsOnboarding(true);
      setScreen('onboarding');
    }
  };

  const handleGetStarted = () => {
    setScreen('auth');
  };

  const handleAuthSuccess = () => {
    // Auth hook will update and trigger the useEffect
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    setScreen('dashboard');
  };

  const handleStartInterview = () => {
    setScreen('setup');
  };

  const handleInterviewStart = (config: InterviewConfig) => {
    setInterviewConfig(config);
    setScreen('session');
  };

  const handleInterviewComplete = (results: any) => {
    setSessionResults(results);
    setScreen('feedback');
  };

  const handleBackToDashboard = () => {
    setScreen('dashboard');
    setInterviewConfig(null);
    setSessionResults(null);
  };

  const handleViewLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleViewProfile = () => {
    setScreen('profile');
  };

  const handleSignOut = () => {
    setScreen('landing');
    setNeedsOnboarding(false);
    setInterviewConfig(null);
    setSessionResults(null);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const accessToken = session?.access_token || '';

  return (
    <div className="min-h-screen">
      <Toaster />
      
      {screen === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {screen === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}

      {screen === 'onboarding' && accessToken && (
        <Onboarding 
          accessToken={accessToken}
          onComplete={handleOnboardingComplete}
        />
      )}

      {screen === 'dashboard' && accessToken && (
        <Dashboard
          accessToken={accessToken}
          onStartInterview={handleStartInterview}
          onViewLeaderboard={handleViewLeaderboard}
          onViewProfile={handleViewProfile}
        />
      )}

      {screen === 'setup' && (
        <InterviewSetup
          onBack={handleBackToDashboard}
          onStart={handleInterviewStart}
        />
      )}

      {screen === 'session' && accessToken && interviewConfig && (
        <InterviewSession
          accessToken={accessToken}
          config={interviewConfig}
          onComplete={handleInterviewComplete}
        />
      )}

      {screen === 'feedback' && sessionResults && (
        <FeedbackReport
          results={sessionResults}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard onBack={handleBackToDashboard} />
      )}

      {screen === 'profile' && accessToken && (
        <ProfileSettings
          accessToken={accessToken}
          onBack={handleBackToDashboard}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}
