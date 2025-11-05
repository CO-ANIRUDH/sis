import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewConfig {
  jobProfile: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  mode: string;
}

interface InterviewSession {
  id?: string;
  config: InterviewConfig;
  startTime?: string;
  endTime?: string;
  status: 'setup' | 'in_progress' | 'completed' | 'cancelled';
  currentQuestion?: number;
  totalQuestions?: number;
  responses?: any[];
  overallScore?: number;
}

interface InterviewState {
  currentConfig: InterviewConfig | null;
  currentSession: InterviewSession | null;
  sessionResults: any | null;
  sessions: InterviewSession[];
  stats: {
    totalSessions: number;
    totalPoints: number;
    bestScore: number;
    currentStreak: number;
  };
  loading: boolean;
}

const initialState: InterviewState = {
  currentConfig: null,
  currentSession: null,
  sessionResults: null,
  sessions: [],
  stats: {
    totalSessions: 0,
    totalPoints: 0,
    bestScore: 0,
    currentStreak: 0,
  },
  loading: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviewConfig: (state, action: PayloadAction<InterviewConfig>) => {
      state.currentConfig = action.payload;
    },
    startSession: (state, action: PayloadAction<InterviewSession>) => {
      state.currentSession = action.payload;
    },
    updateSession: (state, action: PayloadAction<Partial<InterviewSession>>) => {
      if (state.currentSession) {
        state.currentSession = { ...state.currentSession, ...action.payload };
      }
    },
    completeSession: (state, action: PayloadAction<any>) => {
      state.sessionResults = action.payload;
      if (state.currentSession) {
        state.currentSession.status = 'completed';
        state.currentSession.endTime = new Date().toISOString();
      }
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.currentConfig = null;
      state.sessionResults = null;
    },
    setSessions: (state, action: PayloadAction<InterviewSession[]>) => {
      state.sessions = action.payload;
    },
    addSession: (state, action: PayloadAction<InterviewSession>) => {
      state.sessions.unshift(action.payload);
    },
    setStats: (state, action: PayloadAction<typeof initialState.stats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setInterviewConfig,
  startSession,
  updateSession,
  completeSession,
  clearCurrentSession,
  setSessions,
  addSession,
  setStats,
  setLoading,
} = interviewSlice.actions;
export default interviewSlice.reducer;