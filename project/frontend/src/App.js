import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import DashboardLayout from './layouts/DashboardLayout';
import SignupPage from './pages/SignupPage';
import { isTokenExpired } from './utils/auth';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if token exists and if it's expired
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      // If token is expired or doesn't exist, redirect to login
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Handle user logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Redirect to signup/login page
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />

          <Route
            path="/dashboard"
            element={isAuthenticated ? (
              <DashboardLayout
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onLogout={handleLogout} // Pass the handleLogout to DashboardLayout
              />
            ) : (
              <Navigate to="/" /> // Redirect to login if not authenticated or token expired
            )}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
