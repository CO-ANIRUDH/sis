import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Camera, Mic, CheckCircle } from "lucide-react";

interface OnboardingProps {
  accessToken: string;
  onComplete: () => void;
}

const jobRoles = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Scientist",
  "Product Manager",
  "Sales Executive",
  "Marketing Manager",
  "UX Designer"
];

export const Onboarding = ({ accessToken, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    jobPreferences: [] as string[],
    experienceYears: 0,
  });
  const [cameraConsent, setCameraConsent] = useState(false);
  const [micConsent, setMicConsent] = useState(false);
  const [videoStorage, setVideoStorage] = useState(true);
  const [privacyPref, setPrivacyPref] = useState('private');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string>('');
  const [isTestingPermissions, setIsTestingPermissions] = useState(false);

  const toggleJobPreference = (job: string) => {
    if (profile.jobPreferences.includes(job)) {
      setProfile({
        ...profile,
        jobPreferences: profile.jobPreferences.filter(j => j !== job)
      });
    } else {
      setProfile({
        ...profile,
        jobPreferences: [...profile.jobPreferences, job]
      });
    }
  };

  const handlePermissionsTest = async () => {
    setIsTestingPermissions(true);
    setPermissionError('');
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera/microphone access. Please use a modern browser like Chrome, Firefox, or Safari.");
      }

      // Request permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionsGranted(true);
      setPermissionError('');
      toast.success("Camera and microphone access granted!");
    } catch (error: any) {
      console.error("Permission error:", error);
      
      let errorMessage = '';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Permission denied. Please click the camera icon in your browser's address bar and allow access, then try again.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No camera or microphone found. Please connect devices and try again.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Camera/microphone is already in use by another application. Please close other apps and try again.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Camera/microphone doesn't meet requirements. Please check your device settings.";
      } else if (error.name === 'SecurityError') {
        errorMessage = "Access blocked due to security settings. Please ensure you're using HTTPS or localhost.";
      } else {
        errorMessage = error.message || "Failed to access camera/microphone. Please check your browser permissions and try again.";
      }
      
      setPermissionError(errorMessage);
      toast.error(errorMessage);
      setPermissionsGranted(false);
    } finally {
      setIsTestingPermissions(false);
    }
  };

  const handleComplete = async () => {
    try {
      await api.updateProfile(accessToken, {
        ...profile,
        consentTimestamp: new Date().toISOString(),
        videoStorage,
        privacyPref
      });

      toast.success("Profile setup complete!");
      onComplete();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile");
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <h2 className="mb-6">Tell us about yourself</h2>
          
          <div className="space-y-6">
            <div>
              <Label>Years of Experience</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="mb-3 block">Select your target job roles (select multiple)</Label>
              <div className="flex flex-wrap gap-2">
                {jobRoles.map((job) => (
                  <Badge
                    key={job}
                    variant={profile.jobPreferences.includes(job) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => toggleJobPreference(job)}
                  >
                    {job}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setStep(2)} 
              className="w-full"
              disabled={profile.jobPreferences.length === 0}
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <h2 className="mb-6">Privacy & Permissions</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="mb-2">Why we need camera and microphone access</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Camera:</strong> Analyzes your body language, posture, eye contact, and facial expressions</li>
                <li>• <strong>Microphone:</strong> Records your answers for speech analysis and transcription</li>
                <li>• <strong>Privacy:</strong> All data is encrypted and stored securely. You control what gets saved.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="camera-consent"
                  checked={cameraConsent}
                  onCheckedChange={(checked) => setCameraConsent(checked as boolean)}
                />
                <div>
                  <Label htmlFor="camera-consent" className="cursor-pointer">
                    I consent to camera recording for posture and gesture analysis
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="mic-consent"
                  checked={micConsent}
                  onCheckedChange={(checked) => setMicConsent(checked as boolean)}
                />
                <div>
                  <Label htmlFor="mic-consent" className="cursor-pointer">
                    I consent to microphone recording for speech analysis
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="video-storage"
                  checked={videoStorage}
                  onCheckedChange={(checked) => setVideoStorage(checked as boolean)}
                />
                <div>
                  <Label htmlFor="video-storage" className="cursor-pointer">
                    Store full video recordings (you can disable this to store only metrics)
                  </Label>
                </div>
              </div>

              <div>
                <Label>Leaderboard Privacy</Label>
                <Select value={privacyPref} onValueChange={setPrivacyPref}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (show as Anonymous)</SelectItem>
                    <SelectItem value="public">Public (show my name)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {permissionError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800 text-sm">
                <p className="mb-2">{permissionError}</p>
                <p className="text-xs text-red-600">
                  Need help? Make sure:
                  <br />• Your browser has permission to access camera/microphone
                  <br />• No other tabs or applications are using your camera/microphone
                  <br />• You're using a supported browser (Chrome, Firefox, Safari, Edge)
                </p>
              </div>
            )}

            {!permissionsGranted && (
              <Button
                onClick={handlePermissionsTest}
                disabled={!cameraConsent || !micConsent || isTestingPermissions}
                className="w-full"
                variant="outline"
              >
                <Camera className="w-4 h-4 mr-2" />
                <Mic className="w-4 h-4 mr-2" />
                {isTestingPermissions ? "Testing..." : permissionError ? "Retry Camera & Microphone Access" : "Test Camera & Microphone Access"}
              </Button>
            )}

            {permissionsGranted && (
              <div className="bg-green-50 p-4 rounded-lg flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                Permissions granted successfully!
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!cameraConsent || !micConsent || !permissionsGranted}
                className="flex-1"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
