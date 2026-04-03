import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType } from '../types/theme';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeType) || 'cyber';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // 移除所有主题类
    document.body.classList.remove('theme-cyber', 'theme-gold', 'theme-dark', 'theme-light');
    
    // 添加当前主题类
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
