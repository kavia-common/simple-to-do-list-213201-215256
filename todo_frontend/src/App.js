import React, { useState, useEffect } from 'react';
import './App.css';
import TodoApp from './components/TodoApp.jsx';

// PUBLIC_INTERFACE
function App() {
  /**
   * App component: responsible for theme toggling and rendering the TodoApp shell.
   * Preserves the existing theme toggle behavior and applies the theme at document root.
   */
  const [theme, setTheme] = useState('light');

  // Apply theme to document element for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="App-header" role="banner">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <TodoApp />
      </header>
    </div>
  );
}

export default App;
