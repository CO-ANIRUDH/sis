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
  AlertCircle,
  Camera,
  Upload,
  FileText,
  Edit2
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
  const [uploading, setUploading] = useState(false);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const { url } = await api.uploadProfileImage(file);
      setProfile({ ...profile, avatarUrl: url });
      toast.success("Profile image updated!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid resume file (PDF, DOC, or DOCX)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const { url } = await api.uploadResume(file);
      setProfile({ ...profile, resumeUrl: url });
      toast.success("Resume uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setUploading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <Card className="p-8 mb-8 border-0 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl group-hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                  {profile?.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-14 h-14 text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 border-4 border-white dark:border-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="absolute -bottom-3 -right-12 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{profile.name || 'User'}</h2>
                  {profileCompletion === 100 && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Complete Profile
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  {profile.experienceYears !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium">{profile.experienceYears} years experience</span>
                    </div>
                  )}
                </div>
                
                {/* Profile Completion */}
                <div className="max-w-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Completion</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{profileCompletion}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={profileCompletion} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                  {profileCompletion < 100 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      Complete your profile to unlock personalized features
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {stats && (
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalSessions || 0}</div>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-200 dark:border-green-700 hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.bestScore?.toFixed(0) || 0}</div>
                    <div className="text-xs font-medium text-green-600 dark:text-green-400">Best Score</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl border border-yellow-200 dark:border-yellow-700 hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalPoints || 0}</div>
                    <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Points</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                activeTab === 'privacy'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacy & Security
            </button>
            {stats && (
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
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

                      <Separator />

                      {/* Resume Upload */}
                      <div>
                        <Label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Resume/CV
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          {profile?.resumeUrl ? (
                            <div className="space-y-3">
                              <FileText className="w-12 h-12 text-green-600 mx-auto" />
                              <p className="text-sm font-medium text-green-600">Resume uploaded successfully</p>
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(profile.resumeUrl, '_blank')}
                                >
                                  View Resume
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('resume-upload')?.click()}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Replace
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Upload your resume</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, or DOCX up to 10MB</p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => document.getElementById('resume-upload')?.click()}
                                disabled={uploading}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Choose File'}
                              </Button>
                            </div>
                          )}
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving || uploading} 
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                  size="lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving Changes...' : uploading ? 'Uploading...' : 'Save Changes'}
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  className="flex-1 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
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
