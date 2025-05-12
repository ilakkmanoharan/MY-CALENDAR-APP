
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/DayView.css';
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const DayView: React.FC = () => {
  const { date, month } = useParams<{ date: string; month: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState("");
  const navigate = useNavigate();

  const year = new Date().getFullYear();
  const numericMonth = Number(month);
  const numericDate = Number(date);

  const fullDateStr = `${year}-${String(numericMonth + 1).padStart(2, '0')}-${String(numericDate).padStart(2, '0')}`;
  const constructedDate = new Date(year, numericMonth, numericDate);
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

  try {
    const q = query(
      collection(db, "appointments"),
      where("date", "==", fullDateStr),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Fetched docs:", snapshot.docs.map(doc => doc.data()));
      setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  } catch (error) {
    console.error("Error setting up Firestore listener:", error);
  }
}, [date, month, fullDateStr]);


  const addAppointment = async () => {
    if (!newAppointment.trim() || !date || !month) return;

    await addDoc(collection(db, "appointments"), {
      text: newAppointment,
      date: fullDateStr,
      createdAt: Timestamp.now()
    });
    setNewAppointment("");
  };

  const deleteAppointment = async (id: string) => {
    await deleteDoc(doc(db, "appointments", id));
  };

  const goToMonthView = () => {
    navigate(`/month/${month}`);
  };

  const goToCalendar = () => {
    navigate("/calendar");
  };

  return (
    <div className="day-view">
      <div className="top-bar">
        <button onClick={goToMonthView} className="back-button">←</button>
        <button onClick={goToCalendar} className="home-button">🏠</button>
      </div>

      <h2 className="day-date">{formattedDate}</h2>
      <p className="day-subtext"><em>{weekday}</em></p>
      <p className="day-subtext">Welcome! Let’s make today great 🌟</p>

      <input
        type="text"
        placeholder="Add appointment..."
        value={newAppointment}
        onChange={(e) => setNewAppointment(e.target.value)}
      />
      <button onClick={addAppointment}>Add</button>

      <div className="appointments">
        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments for today.</p>
        ) : (
          appointments.map((a) => (
            <div className="appointment" key={a.id}>
              <span>{a.text}</span>
              <button onClick={() => deleteAppointment(a.id)} className="delete-button">🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DayView;
