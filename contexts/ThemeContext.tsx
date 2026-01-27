import React, { createContext, useContext, useEffect, useState } from 'react';

// Simplified to just Day (light) and Night (dark)
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mzizi_theme');
    // Validate saved theme is valid, default to light
    return (saved === 'dark' ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Reset classes
    root.classList.remove('dark');
    body.classList.remove('bg-gray-50', 'bg-slate-900');
    
    // Save to local storage
    localStorage.setItem('mzizi_theme', theme);

    if (theme === 'light') {
       body.classList.add('bg-gray-50');
    } else {
       root.classList.add('dark');
       body.classList.add('bg-slate-900');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};