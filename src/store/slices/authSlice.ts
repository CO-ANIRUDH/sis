import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.loading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setAuth, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;