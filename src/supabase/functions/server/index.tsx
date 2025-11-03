import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key
const getServiceClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Health check endpoint
app.get("/make-server-576ea37e/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-576ea37e/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, jobPreferences, experienceYears } = body;

    const supabase = getServiceClient();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        jobPreferences: jobPreferences || [],
        experienceYears: experienceYears || 0
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      name,
      email,
      jobPreferences: jobPreferences || [],
      experienceYears: experienceYears || 0,
      createdAt: new Date().toISOString(),
      videoStorage: true,
      consentTimestamp: null,
      privacyPref: 'private'
    });

    // Initialize user stats
    await kv.set(`stats:${userId}`, {
      totalSessions: 0,
      totalPoints: 0,
      bestScore: 0,
      currentStreak: 0
    });

    return c.json({ success: true, userId: data.user.id });
  } catch (error) {
    console.error("Error in signup route:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update user profile
app.post("/make-server-576ea37e/profile/update", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const userProfile = await kv.get(`user:${user.id}`);
    
    const updated = {
      ...userProfile,
      ...body,
      id: user.id // Ensure ID doesn't change
    };

    await kv.set(`user:${user.id}`, updated);
    return c.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user profile
app.get("/make-server-576ea37e/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    const stats = await kv.get(`stats:${user.id}`);

    return c.json({ 
      profile: userProfile || {},
      stats: stats || { totalSessions: 0, totalPoints: 0, bestScore: 0, currentStreak: 0 }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create interview session
app.post("/make-server-576ea37e/sessions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const sessionId = `session:${user.id}:${Date.now()}`;
    
    const session = {
      id: sessionId,
      userId: user.id,
      jobProfile: body.jobProfile,
      interviewType: body.interviewType,
      difficulty: body.difficulty,
      mode: body.mode,
      questionCount: body.questionCount,
      timePerQuestion: body.timePerQuestion,
      startTime: new Date().toISOString(),
      status: 'in_progress'
    };

    await kv.set(sessionId, session);
    return c.json({ success: true, session });
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Complete session and save results
app.post("/make-server-576ea37e/sessions/:sessionId/complete", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    
    const session = await kv.get(sessionId);
    if (!session || session.userId !== user.id) {
      return c.json({ error: 'Session not found' }, 404);
    }

    // Calculate overall score
    const scores = body.questionScores || [];
    const overallScore = scores.length > 0 
      ? scores.reduce((sum: number, s: any) => sum + s.total, 0) / scores.length 
      : 0;

    // Calculate difficulty multiplier for points
    const difficultyMultipliers: Record<string, number> = {
      'Easy': 1.0,
      'Medium': 1.2,
      'Hard': 1.5
    };
    const multiplier = difficultyMultipliers[session.difficulty] || 1.0;
    const points = Math.round((overallScore / 100) * 100 * multiplier);

    // Update session
    const updatedSession = {
      ...session,
      endTime: new Date().toISOString(),
      status: 'completed',
      overallScore,
      points,
      questionScores: scores,
      breakdown: body.breakdown,
      feedback: body.feedback
    };

    await kv.set(sessionId, updatedSession);

    // Update user stats
    const stats = await kv.get(`stats:${user.id}`) || { 
      totalSessions: 0, 
      totalPoints: 0, 
      bestScore: 0, 
      currentStreak: 0 
    };

    const updatedStats = {
      totalSessions: stats.totalSessions + 1,
      totalPoints: stats.totalPoints + points,
      bestScore: Math.max(stats.bestScore, overallScore),
      currentStreak: stats.currentStreak + 1,
      lastSessionDate: new Date().toISOString()
    };

    await kv.set(`stats:${user.id}`, updatedStats);

    // Update leaderboard entry
    await kv.set(`leaderboard:${user.id}`, {
      userId: user.id,
      totalPoints: updatedStats.totalPoints,
      bestScore: updatedStats.bestScore,
      recentSessionScore: overallScore,
      lastUpdated: new Date().toISOString()
    });

    return c.json({ success: true, session: updatedSession, stats: updatedStats });
  } catch (error) {
    console.error("Error completing session:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user sessions
app.get("/make-server-576ea37e/sessions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allSessions = await kv.getByPrefix(`session:${user.id}:`);
    const sessions = allSessions
      .filter((s: any) => s && s.userId === user.id)
      .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return c.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get leaderboard
app.get("/make-server-576ea37e/leaderboard", async (c) => {
  try {
    const entries = await kv.getByPrefix('leaderboard:');
    
    // Get user profiles for names
    const enriched = await Promise.all(
      entries.map(async (entry: any) => {
        if (!entry || !entry.userId) return null;
        const profile = await kv.get(`user:${entry.userId}`);
        return {
          ...entry,
          name: profile?.name || 'Anonymous',
          privacy: profile?.privacyPref || 'private'
        };
      })
    );

    // Filter out null entries and apply privacy settings
    const validEntries = enriched.filter(e => e !== null);
    
    // Sort by total points
    const sorted = validEntries.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    
    // Add rank
    const ranked = sorted.map((entry: any, index: number) => ({
      ...entry,
      rank: index + 1,
      // Hide name if privacy is set to private
      name: entry.privacy === 'private' ? 'Anonymous' : entry.name
    }));

    return c.json({ leaderboard: ranked });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Generate AI feedback (placeholder for now)
app.post("/make-server-576ea37e/generate-feedback", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { transcript, scores, questionType } = body;

    // Placeholder feedback generation
    // In production, this would call an LLM API
    const feedback = {
      strengths: [
        "Good speaking pace and clarity",
        "Appropriate use of technical terminology",
        "Maintained good eye contact"
      ],
      improvements: [
        "Reduce filler words like 'um' and 'uh'",
        "Provide more specific examples",
        "Structure answers using the STAR method"
      ],
      exercises: [
        "Practice the STAR method for behavioral questions",
        "Record yourself and identify filler words",
        "Research common questions for this role"
      ],
      overallFeedback: "You demonstrated solid knowledge and communication skills. Focus on structuring your answers more clearly and reducing hesitation to increase your confidence score."
    };

    return c.json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get question bank for interview
app.post("/make-server-576ea37e/questions/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getServiceClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { jobProfile, interviewType, difficulty, count } = body;

    // Hardcoded question bank (in production, this would be more extensive and possibly AI-generated)
    const questionBank: Record<string, any[]> = {
      'Frontend Engineer': [
        { id: 1, text: "Tell me about your experience with React and state management.", type: "Technical", difficulty: "Medium" },
        { id: 2, text: "Explain the virtual DOM and how React uses it.", type: "Technical", difficulty: "Medium" },
        { id: 3, text: "Describe a challenging bug you fixed recently.", type: "Behavioral", difficulty: "Easy" },
        { id: 4, text: "How do you optimize web application performance?", type: "Technical", difficulty: "Hard" },
        { id: 5, text: "What's your approach to responsive design?", type: "Technical", difficulty: "Easy" }
      ],
      'Data Scientist': [
        { id: 1, text: "Explain the difference between supervised and unsupervised learning.", type: "Technical", difficulty: "Easy" },
        { id: 2, text: "Walk me through a machine learning project you've worked on.", type: "Behavioral", difficulty: "Medium" },
        { id: 3, text: "How do you handle imbalanced datasets?", type: "Technical", difficulty: "Hard" },
        { id: 4, text: "Describe your experience with A/B testing.", type: "Technical", difficulty: "Medium" },
        { id: 5, text: "What metrics do you use to evaluate model performance?", type: "Technical", difficulty: "Medium" }
      ],
      'Product Manager': [
        { id: 1, text: "How do you prioritize features in a product roadmap?", type: "Behavioral", difficulty: "Medium" },
        { id: 2, text: "Tell me about a time you had to make a difficult product decision.", type: "Behavioral", difficulty: "Medium" },
        { id: 3, text: "How do you gather and incorporate user feedback?", type: "Technical", difficulty: "Easy" },
        { id: 4, text: "Design a product feature for elderly users.", type: "Case Study", difficulty: "Hard" },
        { id: 5, text: "How do you work with engineering teams?", type: "Behavioral", difficulty: "Easy" }
      ],
      'Sales Executive': [
        { id: 1, text: "Describe your sales process from lead to close.", type: "Behavioral", difficulty: "Medium" },
        { id: 2, text: "How do you handle objections from prospects?", type: "Behavioral", difficulty: "Medium" },
        { id: 3, text: "Tell me about your biggest sale.", type: "Behavioral", difficulty: "Easy" },
        { id: 4, text: "How do you maintain relationships with clients?", type: "Behavioral", difficulty: "Easy" },
        { id: 5, text: "What's your approach to cold calling?", type: "Technical", difficulty: "Medium" }
      ]
    };

    const questions = questionBank[jobProfile] || questionBank['Frontend Engineer'];
    
    // Filter by difficulty and type if needed
    let filtered = questions;
    if (difficulty !== 'Custom') {
      filtered = questions.filter(q => q.difficulty === difficulty);
    }
    if (interviewType !== 'Mixed') {
      filtered = filtered.filter(q => q.type === interviewType);
    }

    // Select random questions up to count
    const selected = filtered.sort(() => Math.random() - 0.5).slice(0, Math.min(count, filtered.length));
    
    // If not enough questions, fill with any remaining
    if (selected.length < count) {
      const remaining = questions.filter(q => !selected.includes(q)).slice(0, count - selected.length);
      selected.push(...remaining);
    }

    return c.json({ questions: selected });
  } catch (error) {
    console.error("Error generating questions:", error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
