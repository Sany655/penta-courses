import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('penta_theme');
      if (saved) return saved;
    }
    // Default to dark mode
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('penta_theme', theme);
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme,
      isDark: theme === 'dark',
      isLight: theme === 'light'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
