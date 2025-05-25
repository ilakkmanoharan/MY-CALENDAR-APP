// App.tsx
import React from 'react';
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

import { AuthProvider, useAuth } from './context/AuthProvider'; // Adjust path

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Layout><Dashboard /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/calendar"
        element={
          user ? (
            <Layout><Calendar /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/month/:monthIndex"
        element={
          user ? (
            <Layout><MonthView /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/day/:month/:date"
        element={
          user ? (
            <Layout><DayView /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;


