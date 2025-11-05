import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface AppState {
  currentScreen: AppScreen;
  needsOnboarding: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

const initialState: AppState = {
  currentScreen: 'landing',
  needsOnboarding: false,
  theme: 'light',
  sidebarOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentScreen: (state, action: PayloadAction<AppScreen>) => {
      state.currentScreen = action.payload;
    },
    setNeedsOnboarding: (state, action: PayloadAction<boolean>) => {
      state.needsOnboarding = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { 
  setCurrentScreen, 
  setNeedsOnboarding, 
  toggleTheme, 
  setTheme, 
  toggleSidebar, 
  setSidebarOpen 
} = appSlice.actions;
export default appSlice.reducer;