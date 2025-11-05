import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTheme } from '../store/slices/appSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.app);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    dispatch(setTheme(initialTheme));
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
};