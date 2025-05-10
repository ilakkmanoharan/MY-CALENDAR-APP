
// src/components/DayView.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/DayView.css';
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const DayView: React.FC = () => {
  const { date, month } = useParams<{ date: string; month: string }>();
  const [appointments, setAppointments] = useState<string[]>([]);
  const [newAppointment, setNewAppointment] = useState("");

  const year = new Date().getFullYear();
  const numericMonth = Number(month);
  const numericDate = Number(date);

  // Construct full date string for Firestore: YYYY-MM-DD
  const fullDateStr = `${year}-${String(numericMonth + 1).padStart(2, '0')}-${String(numericDate).padStart(2, '0')}`;

  // Construct JS Date object
  const constructedDate = new Date(year, numericMonth, numericDate);

  // Format date as "April 12th, 2025"
  const getSuffix = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formattedDate = `${constructedDate.toLocaleString('default', { month: 'long' })} ${numericDate}${getSuffix(numericDate)}, ${year}`;
  const weekday = constructedDate.toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    if (!date || !month) return;

    const q = query(
      collection(db, "appointments"),
      where("date", "==", fullDateStr),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map((doc) => doc.data().text));
    });

    return () => unsubscribe();
  }, [date, month]);

  const addAppointment = async () => {
    if (!newAppointment.trim() || !date || !month) return;

    await addDoc(collection(db, "appointments"), {
      text: newAppointment,
      date: fullDateStr,
      createdAt: new Date()
    });
    setNewAppointment("");
  };

  return (
    <div className="day-view">
      <h2 className="day-date">{formattedDate}</h2>
      <p className="day-subtext"><em>{weekday}</em></p>
      <p className="day-subtext">Welcome! Let’s make today great 🌟</p>

      <div className="appointments">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments for today.</p>
        ) : (
          appointments.map((a, idx) => (
            <div className="appointment" key={idx}>{a}</div>
          ))
        )}
      </div>

      <input
        type="text"
        placeholder="Add appointment..."
        value={newAppointment}
        onChange={(e) => setNewAppointment(e.target.value)}
      />
      <button onClick={addAppointment}>Add</button>
    </div>
  );
};

export default DayView;