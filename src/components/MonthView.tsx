import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDaysInMonth } from '../utils/dateUtils';

const MonthView = () => {
  const { monthIndex } = useParams<{ monthIndex: string }>();
  const month = parseInt(monthIndex || '0');
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, month, 1);
    setDays(getDaysInMonth(date));
  }, [month]);

  return (
    <div className="month-view">
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