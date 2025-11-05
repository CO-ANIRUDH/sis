-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  experience_years INTEGER DEFAULT 0,
  job_preferences TEXT[] DEFAULT '{}',
  privacy_pref TEXT DEFAULT 'private' CHECK (privacy_pref IN ('private', 'public')),
  video_storage BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview sessions table
CREATE TABLE interview_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  job_profile TEXT NOT NULL,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('behavioral', 'technical', 'case_study')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'timed', 'mock')),
  status TEXT DEFAULT 'setup' CHECK (status IN ('setup', 'in_progress', 'completed', 'cancelled')),
  overall_score FLOAT CHECK (overall_score >= 0 AND overall_score <= 100),
  points INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('behavioral', 'technical', 'case_study')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  job_profile TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session questions table (many-to-many)
CREATE TABLE session_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES interview_sessions ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id),
  UNIQUE(session_id, order_index)
);

-- Create responses table
CREATE TABLE responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES interview_sessions ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions ON DELETE CASCADE NOT NULL,
  transcript TEXT,
  video_url TEXT,
  audio_url TEXT,
  content_score FLOAT DEFAULT 0 CHECK (content_score >= 0 AND content_score <= 100),
  communication_score FLOAT DEFAULT 0 CHECK (communication_score >= 0 AND communication_score <= 100),
  confidence_score FLOAT DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  body_language_score FLOAT DEFAULT 0 CHECK (body_language_score >= 0 AND body_language_score <= 100),
  time_management_score FLOAT DEFAULT 0 CHECK (time_management_score >= 0 AND time_management_score <= 100),
  total_score FLOAT DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  feedback TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- Create leaderboard view
CREATE VIEW leaderboard_view AS
SELECT 
  CASE 
    WHEN p.privacy_pref = 'public' THEN p.name 
    ELSE 'Anonymous' 
  END as display_name,
  COUNT(s.id) as total_sessions,
  ROUND(AVG(s.overall_score)::numeric, 1) as avg_score,
  MAX(s.overall_score) as best_score,
  SUM(s.points) as total_points,
  s.user_id
FROM interview_sessions s
JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'completed' AND s.overall_score IS NOT NULL
GROUP BY s.user_id, p.privacy_pref, p.name
ORDER BY best_score DESC, total_points DESC;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for interview_sessions
CREATE POLICY "Users can view own sessions" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON interview_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for questions (public read)
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT TO authenticated USING (true);

-- Create RLS policies for session_questions
CREATE POLICY "Users can view own session questions" ON session_questions 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM interview_sessions s 
    WHERE s.id = session_questions.session_id AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create own session questions" ON session_questions 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM interview_sessions s 
    WHERE s.id = session_questions.session_id AND s.user_id = auth.uid()
  )
);

-- Create RLS policies for responses
CREATE POLICY "Users can view own responses" ON responses 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM interview_sessions s 
    WHERE s.id = responses.session_id AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create own responses" ON responses 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM interview_sessions s 
    WHERE s.id = responses.session_id AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own responses" ON responses 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM interview_sessions s 
    WHERE s.id = responses.session_id AND s.user_id = auth.uid()
  )
);

-- Create storage bucket for video recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('interview-videos', 'interview-videos', false);

-- Create storage policies for video bucket
CREATE POLICY "Users can upload own videos" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'interview-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own videos" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'interview-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Insert sample questions
INSERT INTO questions (text, type, difficulty, job_profile, category, tags) VALUES
('Tell me about yourself and your professional background.', 'behavioral', 'easy', 'General', 'Introduction', '{"introduction", "background"}'),
('Why are you interested in this position?', 'behavioral', 'easy', 'General', 'Motivation', '{"motivation", "interest"}'),
('Describe a challenging project you worked on recently.', 'behavioral', 'medium', 'General', 'Experience', '{"projects", "challenges"}'),
('How do you handle working under pressure?', 'behavioral', 'medium', 'General', 'Soft Skills', '{"pressure", "stress"}'),
('Where do you see yourself in 5 years?', 'behavioral', 'easy', 'General', 'Career Goals', '{"career", "goals"}'),

-- Frontend Engineer Questions
('Explain the difference between let, const, and var in JavaScript.', 'technical', 'easy', 'Frontend Engineer', 'JavaScript', '{"javascript", "variables"}'),
('What is the virtual DOM and how does React use it?', 'technical', 'medium', 'Frontend Engineer', 'React', '{"react", "virtual-dom"}'),
('How would you optimize a React application for performance?', 'technical', 'hard', 'Frontend Engineer', 'Performance', '{"react", "optimization"}'),
('Explain CSS specificity and how it works.', 'technical', 'medium', 'Frontend Engineer', 'CSS', '{"css", "specificity"}'),
('What are React hooks and why are they useful?', 'technical', 'medium', 'Frontend Engineer', 'React', '{"react", "hooks"}'),

-- Backend Engineer Questions
('Explain the difference between SQL and NoSQL databases.', 'technical', 'medium', 'Backend Engineer', 'Databases', '{"databases", "sql", "nosql"}'),
('How would you design a RESTful API?', 'technical', 'medium', 'Backend Engineer', 'API Design', '{"api", "rest"}'),
('What is database indexing and when would you use it?', 'technical', 'hard', 'Backend Engineer', 'Databases', '{"databases", "indexing"}'),
('Explain microservices architecture and its benefits.', 'technical', 'hard', 'Backend Engineer', 'Architecture', '{"microservices", "architecture"}'),
('How do you handle authentication and authorization?', 'technical', 'medium', 'Backend Engineer', 'Security', '{"auth", "security"}'),

-- Product Manager Questions
('How would you prioritize features for a new product?', 'case_study', 'medium', 'Product Manager', 'Strategy', '{"prioritization", "strategy"}'),
('Walk me through how you would launch a new feature.', 'case_study', 'medium', 'Product Manager', 'Product Launch', '{"launch", "process"}'),
('How do you measure product success?', 'behavioral', 'medium', 'Product Manager', 'Metrics', '{"metrics", "success"}'),
('Describe a time when you had to make a difficult product decision.', 'behavioral', 'hard', 'Product Manager', 'Decision Making', '{"decisions", "leadership"}'),
('How would you handle conflicting stakeholder requirements?', 'case_study', 'hard', 'Product Manager', 'Stakeholder Management', '{"stakeholders", "conflict"}');

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, experience_years, job_preferences)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    COALESCE((new.raw_user_meta_data->>'experience_years')::integer, 0),
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'job_preferences')),
      '{}'::text[]
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON interview_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();