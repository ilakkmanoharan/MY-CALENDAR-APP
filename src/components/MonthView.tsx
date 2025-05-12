// src/components/MonthView.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDaysInMonth } from '../utils/dateUtils';
import '../styles/MonthView.css'; // Ensure this file exists and is styled appropriately

const MonthView = () => {
  const { monthIndex } = useParams<{ monthIndex: string }>();
  const month = parseInt(monthIndex || '0');
  const [days, setDays] = useState<Date[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, month, 1);
    setDays(getDaysInMonth(date));
  }, [month]);

  // Function to navigate to the Calendar View
  const goToCalendar = () => {
    navigate("/calendar");
  };

  return (
    <div className="month-view">
      
      <button onClick={goToCalendar} className="calendar-button">←</button>

      <h2>{new Date(2024, month).toLocaleString('default', { month: 'long' })}</h2>
      <div className="days">
        {days.map((day, index) => (
          <Link key={index} to={`/day/${month}/${day.getDate()}`} className="day-link">
            <div className="day">
              <div className="date-number">{day.getDate()}</div>
              <div className="weekday-name">
                {day.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MonthView;

