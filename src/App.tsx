import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MonthView from './components/MonthView';
import DayView from './components/DayView';
import Calendar from './components/Calendar';
import Layout from './components/Layout';
import './styles/Calendar.css';
import './styles/MonthView.css';
import './styles/DayView.css';
import { auth } from './firebase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/calendar"
          element={isLoggedIn ? (
            <Layout>
              <Calendar />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/month/:monthIndex"
          element={isLoggedIn ? (
            <Layout>
              <MonthView />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/day/:month/:date"
          element={isLoggedIn ? (
            <Layout>
              <DayView />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;


