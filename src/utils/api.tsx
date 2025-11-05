import { createClient } from './supabase/client';

const supabase = createClient();

export const api = {
  async signup(email: string, password: string, name: string, jobPreferences: string[], experienceYears: number) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          job_preferences: jobPreferences,
          experience_years: experienceYears
        }
      }
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  async getProfile(accessToken: string) {
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) throw new Error('User not found');

    // Get profile data (might not exist for new users)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // Use maybeSingle to handle non-existent profiles

    // Get session stats
    const { data: sessions } = await supabase
      .from('interview_sessions')
      .select('overall_score, points, status')
      .eq('user_id', user.id);

    const completedSessions = sessions?.filter(s => s.status === 'completed') || [];
    const stats = {
      totalSessions: sessions?.length || 0,
      totalPoints: sessions?.reduce((sum, s) => sum + (s.points || 0), 0) || 0,
      bestScore: completedSessions.length > 0 ? Math.max(...completedSessions.map(s => s.overall_score || 0)) : 0,
      currentStreak: 0
    };

    return {
      profile: {
        name: profile?.name || user.user_metadata?.name || '',
        email: user.email,
        experienceYears: profile?.experience_years,
        jobPreferences: profile?.job_preferences || [],
        privacyPref: profile?.privacy_pref || 'private',
        videoStorage: profile?.video_storage !== false,
        avatarUrl: profile?.avatar_url,
        resumeUrl: profile?.resume_url
      },
      stats
    };
  },

  async updateProfile(accessToken: string, updates: any) {
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) throw new Error('User not found');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: updates.name,
        experience_years: updates.experienceYears,
        job_preferences: updates.jobPreferences,
        privacy_pref: updates.privacyPref,
        video_storage: updates.videoStorage,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  },

  async createSession(accessToken: string, config: any) {
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        job_profile: config.jobProfile,
        interview_type: config.interviewType,
        difficulty: config.difficulty,
        mode: config.mode,
        status: 'setup'
      })
      .select()
      .single();

    if (error) throw error;
    return { session: data };
  },

  async completeSession(accessToken: string, sessionId: string, results: any) {
    const { error } = await supabase
      .from('interview_sessions')
      .update({
        status: 'completed',
        overall_score: results.overallScore,
        points: results.points,
        end_time: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    return { success: true };
  },

  async getSessions(accessToken: string) {
    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) throw new Error('User not found');

    const { data: sessions, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { sessions: sessions || [] };
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('best_score', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { leaderboard: data || [] };
  },

  async generateQuestions(accessToken: string, config: any) {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .or(`job_profile.eq.${config.jobProfile},job_profile.eq.General`)
      .eq('difficulty', config.difficulty)
      .limit(5);

    if (error) throw error;
    return { questions: questions || [] };
  },

  async generateFeedback(accessToken: string, data: any) {
    // Store response in database
    const { error } = await supabase
      .from('responses')
      .insert({
        session_id: data.sessionId,
        question_id: data.questionId,
        transcript: data.transcript,
        video_url: data.videoUrl,
        content_score: data.scores?.content || 0,
        communication_score: data.scores?.communication || 0,
        confidence_score: data.scores?.confidence || 0,
        total_score: data.overallScore || 0,
        feedback: data.feedback,
        duration_seconds: data.duration || 0
      });

    if (error) throw error;
    return data;
  },

  async uploadVideo(file: File, sessionId: string, questionId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const fileName = `${user.id}/${sessionId}/${questionId}.webm`;
    const { data, error } = await supabase.storage
      .from('interview-videos')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('interview-videos')
      .getPublicUrl(fileName);

    return { url: publicUrl };
  },

  async uploadProfileImage(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage not configured. Please contact support.');
      }
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with image URL
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, avatar_url: publicUrl });

    if (updateError) {
      console.warn('Failed to update profile:', updateError);
    }

    return { url: publicUrl };
  },

  async uploadResume(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/resume.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { upsert: true });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage not configured. Please contact support.');
      }
      throw error;
    }
    
    // For private bucket, create a signed URL
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);

    if (urlError) {
      // Fallback to public URL if signed URL fails
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, resume_url: publicUrl });

      return { url: publicUrl };
    }

    // Update profile with resume URL
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, resume_url: signedUrl.signedUrl });

    if (updateError) {
      console.warn('Failed to update profile:', updateError);
    }

    return { url: signedUrl.signedUrl };
  }
};
