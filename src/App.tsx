import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
// import Calendar from './components/Calendar';
import MonthView from './components/MonthView';
import DayView from './components/DayView';
import './styles/Calendar.css';
import './styles/MonthView.css';
import './styles/DayView.css';
import { auth } from './firebase';
import { useState, useEffect } from 'react';

const App: React.FC = () => {
  //const isLoggedIn = !!auth.currentUser;
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
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/month/:monthIndex" element={<MonthView />} />
        <Route path="/day/:month/:date" element={<DayView />} />
      </Routes>
    </Router>
  );
};


export default App;
// Removed the conflicting local useState function declaration.

