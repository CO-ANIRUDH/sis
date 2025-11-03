import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { api } from "../utils/api";
import { createClient } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { 
  ArrowLeft, 
  Save, 
  LogOut, 
  User, 
  Mail, 
  Briefcase, 
  Shield, 
  Award,
  TrendingUp,
  Calendar,
  Trophy,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface ProfileSettingsProps {
  accessToken: string;
  onBack: () => void;
  onSignOut: () => void;
}

const jobRoles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Scientist",
  "Product Manager",
  "Sales Executive",
  "Marketing Manager",
  "UX Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer",
  "System Architect"
];

export const ProfileSettings = ({ accessToken, onBack, onSignOut }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'stats'>('profile');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile(accessToken);
      setProfile(response.profile);
      setStats(response.stats);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(accessToken, profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleJobPreference = (job: string) => {
    const current = profile.jobPreferences || [];
    if (current.includes(job)) {
      setProfile({
        ...profile,
        jobPreferences: current.filter((j: string) => j !== job)
      });
    } else {
      setProfile({
        ...profile,
        jobPreferences: [...current, job]
      });
    }
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 6;
    
    if (profile?.name) completed++;
    if (profile?.email) completed++;
    if (profile?.experienceYears !== undefined) completed++;
    if (profile?.jobPreferences && profile.jobPreferences.length > 0) completed++;
    if (profile?.privacyPref) completed++;
    if (profile?.videoStorage !== undefined) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <Card className="p-8 mb-6 border-2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full w-6 h-6 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{profile.name || 'User'}</h2>
                  {profileCompletion === 100 && (
                    <Badge className="bg-green-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.experienceYears !== undefined && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{profile.experienceYears} years experience</span>
                    </div>
                  )}
                </div>
                
                {/* Profile Completion */}
                <div className="max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-semibold text-gray-900">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  {profileCompletion < 100 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Complete your profile to unlock all features
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {stats && (
                <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalSessions || 0}</div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{stats.bestScore?.toFixed(0) || 0}</div>
                    <div className="text-xs text-gray-600">Best Score</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalPoints || 0}</div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'privacy'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Privacy & Security
            </button>
            {stats && (
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'stats'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Statistics
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'profile' && (
                <>
                  {/* Basic Information */}
                  <Card className="p-6 border-2">
                    <div className="flex items-center gap-2 mb-6">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profile.name || ''}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mt-2 h-11"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                          Years of Experience
                        </Label>
                        <Input
                          id="experience"
                          type="number"
                          min="0"
                          max="50"
                          value={profile.experienceYears || 0}
                          onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })}
                          className="mt-2 h-11"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Select your total years of professional experience
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <Label className="mb-3 block text-sm font-semibold text-gray-700">
                          Target Job Roles
                        </Label>
                        <p className="text-xs text-gray-500 mb-4">
                          Select all job roles you're interested in practicing for
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {jobRoles.map((job) => {
                            const isSelected = (profile.jobPreferences || []).includes(job);
                            return (
                              <Badge
                                key={job}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer px-4 py-2 transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md'
                                    : 'hover:border-blue-300 hover:bg-blue-50'
                                }`}
                                onClick={() => toggleJobPreference(job)}
                              >
                                {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {job}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'privacy' && (
                <Card className="p-6 border-2">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Privacy & Security Settings</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor="video-storage" className="cursor-pointer font-semibold text-gray-900">
                              Store Full Video Recordings
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            When enabled, full video recordings of your practice sessions will be stored for detailed analysis. 
                            When disabled, only performance metrics and transcripts will be saved.
                          </p>
                        </div>
                        <Switch
                          id="video-storage"
                          checked={profile.videoStorage !== false}
                          onCheckedChange={(checked) => setProfile({ ...profile, videoStorage: checked })}
                          className="ml-4"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="privacy" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Leaderboard Privacy
                      </Label>
                      <p className="text-xs text-gray-500 mb-3">
                        Choose how you appear on public leaderboards
                      </p>
                      <Select 
                        value={profile.privacyPref || 'private'} 
                        onValueChange={(value) => setProfile({ ...profile, privacyPref: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Private (show as Anonymous)
                            </div>
                          </SelectItem>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Public (show my name)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Data Privacy Notice</p>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            All your data is encrypted and stored securely using industry-standard practices. 
                            We comply with GDPR, CCPA, and other data protection regulations. You can request 
                            complete data deletion at any time by contacting our support team. Your privacy is our priority.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'stats' && stats && (
                <div className="space-y-6">
                  <Card className="p-6 border-2">
                    <div className="flex items-center gap-2 mb-6">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Your Performance</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Total Sessions</span>
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalSessions || 0}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Best Score</span>
                          <Award className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {stats.bestScore?.toFixed(0) || 0}
                          <span className="text-lg text-gray-600">/100</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Total Points</span>
                          <Trophy className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalPoints || 0}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Current Streak</span>
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {stats.currentStreak || 0}
                          <span className="text-xl ml-2">🔥</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="flex-1 border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Sidebar - Quick Info */}
            <div className="space-y-6">
              <Card className="p-6 border-2 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-gray-900">Achievements</h4>
                </div>
                <div className="space-y-3">
                  {profileCompletion === 100 && (
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Profile Complete</span>
                    </div>
                  )}
                  {stats?.currentStreak >= 7 && (
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium">7-Day Streak! 🔥</span>
                    </div>
                  )}
                  {stats?.bestScore >= 80 && (
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">High Performer</span>
                    </div>
                  )}
                  {(!profileCompletion || profileCompletion < 100) && stats?.totalSessions === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600">Start practicing to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-2">
                <h4 className="font-bold text-gray-900 mb-4">Quick Tips</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Complete your profile to get personalized question recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Select multiple job roles to practice diverse interview scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enable video storage for detailed body language analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Keep your profile updated as you gain experience</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
