# SmartInterview - AI-Powered Interview Practice Platform

A comprehensive web application that helps job candidates practice interviews with AI-driven questions, real-time video/audio analysis, and detailed performance feedback.

## 🎯 Features

### Authentication & User Management
- **Multiple Sign-in Methods**: Email/password, Google OAuth, and GitHub OAuth
- **User Profiles**: Customizable profiles with job preferences, experience level, and privacy settings
- **Onboarding Flow**: Guided setup with camera/microphone permission handling

### Interview Practice
- **Customizable Interviews**: Configure job profile, interview type, difficulty, question count, and time limits
- **Multiple Interview Types**: Technical, Behavioral, HR, Case Study, or Mixed
- **Difficulty Levels**: Easy, Medium, Hard, or Custom
- **Practice & Mock Modes**: 
  - Practice: Real-time feedback during interview
  - Mock: Simulated real interview with feedback at the end

### Real-Time Analysis
- **Video Capture**: Records candidate video for body language analysis
- **Audio Recording**: Captures audio for speech analysis and transcription
- **Live Metrics** (Practice Mode):
  - Confidence meter
  - Gesture score
  - Speaking rate
  - Posture analysis
  - Eye contact tracking

### Performance Analytics
- **Comprehensive Scoring**:
  - Content Knowledge (40%)
  - Communication Skills (20%)
  - Confidence (15%)
  - Body Language & Gestures (15%)
  - Time Management (10%)
- **Detailed Feedback**: Strengths, areas for improvement, and recommended exercises
- **Progress Tracking**: Historical performance charts and trends

### Gamification
- **Points System**: Earn points based on performance and difficulty
- **Leaderboards**: Global rankings with privacy controls
- **Streaks**: Track consecutive practice days
- **Achievements**: Unlock badges and milestones

### Privacy & Security
- **Explicit Consent**: Clear permission requests for camera and microphone
- **Data Control**: Option to store only metrics without full video recordings
- **Privacy Settings**: Public or private leaderboard visibility
- **Encrypted Storage**: All data stored securely in Supabase

## 🏗️ Technical Architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Web APIs**: MediaDevices, MediaRecorder, Speech Synthesis

### Backend
- **Supabase** for authentication and database
- **Hono** web framework for edge functions
- **Key-Value Store** for data persistence

### Data Model

#### User Profile
- Basic info (name, email, experience)
- Job preferences
- Privacy settings
- Consent timestamps

#### Interview Session
- Configuration (job profile, type, difficulty, mode)
- Questions and responses
- Timestamps and duration
- Recording metadata

#### Performance Metrics
- Per-question scores
- Overall breakdown
- Live analysis data
- Historical trends

#### Leaderboard
- Total points
- Best scores
- Recent performance
- Privacy-filtered rankings

## 🚀 Getting Started

1. **Sign Up**: Create an account using email or social login
2. **Onboarding**: Set up your profile and grant camera/microphone permissions
3. **Configure Interview**: Choose your job role, interview type, and difficulty
4. **Practice**: Answer AI-generated questions while being recorded
5. **Review Feedback**: Analyze your performance and get actionable tips
6. **Track Progress**: View your improvement over time on the dashboard

## 📊 Scoring Algorithm

Overall score is calculated as a weighted average:

```
Overall Score = (Content × 0.40) + 
                (Communication × 0.20) + 
                (Confidence × 0.15) + 
                (Body Language × 0.15) + 
                (Time Management × 0.10)
```

**Points Calculation:**
```
Points = (Score / 100) × 100 × Difficulty Multiplier

Difficulty Multipliers:
- Easy: 1.0x
- Medium: 1.2x
- Hard: 1.5x
```

## 🎥 Video & Audio Analysis

### Current Implementation
- Browser-based video/audio recording using MediaRecorder API
- Simulated analysis metrics for demonstration
- Text-to-Speech for question delivery
- Real-time confidence and gesture scoring simulation

### Production Enhancement Opportunities
For a production deployment, integrate:

1. **Speech-to-Text**: OpenAI Whisper, Google Speech-to-Text
2. **NLP Analysis**: Semantic matching, keyword detection, sentiment analysis
3. **Vocal Features**: Prosody analysis, filler word detection, speaking rate
4. **Computer Vision**: 
   - Pose estimation (MediaPipe, BlazePose)
   - Face landmarks for gaze and expressions
   - Gesture recognition
5. **Feedback Generation**: LLM-powered personalized feedback (GPT-4, Claude)

## 🔐 Privacy & Compliance

- **Explicit Consent**: Users must grant permission before any recording
- **Data Minimization**: Option to store only metrics, not full recordings
- **User Control**: Users can choose leaderboard visibility
- **Secure Storage**: All data encrypted in Supabase
- **Transparency**: Clear explanation of data usage

**Note**: This is a prototype for demonstration. For production use with real user data, implement full GDPR/CCPA compliance and proper data retention policies.

## 🔧 Configuration

### Social Login Setup

To enable Google or GitHub OAuth:

1. Visit your Supabase project dashboard
2. Navigate to Authentication → Providers
3. Follow setup instructions at:
   - Google: https://supabase.com/docs/guides/auth/social-login/auth-google
   - GitHub: https://supabase.com/docs/guides/auth/social-login/auth-github

## 📈 Future Enhancements

- Resume parsing and job description matching
- Live 1-on-1 mock interviews with human reviewers
- Industry-specific question banks
- Company-specific interview prep
- Video clip highlighting and sharing
- Mobile app support
- Integration with LinkedIn and job boards
- Advanced ML models for more accurate analysis
- Multi-language support
- Accessibility improvements

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **Edge Functions**: Deno, Hono
- **Notifications**: Sonner
- **Web APIs**: MediaDevices, MediaRecorder, Speech Synthesis

## ⚠️ Important Notes

1. **Camera/Microphone Access**: Required for full functionality
2. **Browser Compatibility**: Best experience in Chrome, Edge, or Safari
3. **Internet Connection**: Required for backend operations
4. **Data Storage**: Uses browser localStorage and Supabase backend
5. **Prototype Status**: Current ML features are simulated for demonstration

## 📝 License

This is a prototype application created for demonstration purposes.

---

**Built with ❤️ using React, Supabase, and AI**
