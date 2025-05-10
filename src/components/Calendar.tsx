import React, { useState, useEffect } from 'react';
import { getMonthsInYear, getCurrentYear } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [months, setMonths] = useState<Date[]>([]);

  useEffect(() => {
    const currentYear = getCurrentYear();
    setMonths(getMonthsInYear(currentYear));
  }, []);

  return (
    <div className="calendar">
      <h1>Calendar {new Date().getFullYear()}</h1>
      <div className="months">
        {months.map((month, index) => (
          <Link key={index} to={`/month/${month.getMonth()}`}>
            <div className="month">{month.toLocaleString('default', { month: 'long' })}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Calendar;