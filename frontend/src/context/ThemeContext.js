import React, { createContext, useReducer, useEffect } from 'react';

// Create context
export const ThemeContext = createContext();

// Initial state
const initialState = {
  theme: localStorage.getItem('theme') || 'light'
};

// Create reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return {
        ...state,
        theme: newTheme
      };
    default:
      return state;
  }
};

// Provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', state.theme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};