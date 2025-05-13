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

const typeOptions = [
  "default", "appointments", "notes", "tasks", "income", "expense", "savings", "reminder", "to do"
];

const typeColors: { [key: string]: string } = {
  default: "#e3f2fd",
  appointments: "#ffe0f0",
  notes: "#e1f5fe",
  tasks: "#e8f5e9",
  income: "#f1f8e9",
  expense: "#fff8e1",
  savings: "#ede7f6",
  reminder: "#fce4ec",
  "to do": "#f3e5f5"
};

const DayView: React.FC = () => {
  const { date, month } = useParams<{ date: string; month: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState("");
  const [type, setType] = useState("default");
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const year = new Date().getFullYear();
  const numericMonth = Number(month);
  const numericDate = Number(date);

  const fullDateStr = `${year}-${String(numericMonth + 1).padStart(2, '0')}-${String(numericDate).padStart(2, '0')}`;
  const constructedDate = new Date(year, numericMonth, numericDate);
  const getSuffix = (d: number) => (d > 3 && d < 21) ? "th" : ["st", "nd", "rd"][((d % 10) - 1)] || "th";
  const formattedDate = `${constructedDate.toLocaleString('default', { month: 'long' })} ${numericDate}${getSuffix(numericDate)}, ${year}`;
  const weekday = constructedDate.toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    if (!date || !month) return;

    const q = query(
      collection(db, "appointments"),
      where("date", "==", fullDateStr),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAppointments(items);
    });

    return () => unsubscribe();
  }, [date, month, fullDateStr]);

  const addAppointment = async () => {
    if (!newAppointment.trim()) return;

    await addDoc(collection(db, "appointments"), {
      text: newAppointment,
      type: type || "default",
      date: fullDateStr,
      createdAt: Timestamp.now()
    });

    setNewAppointment("");
    setType("default");
  };

  const deleteAppointment = async (id: string) => {
    await deleteDoc(doc(db, "appointments", id));
  };

  const toggleGroup = (groupType: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupType]: !prev[groupType] }));
  };

  const groupedByType: { [key: string]: any[] } = {};
  appointments.forEach(entry => {
    const entryType = entry.type || "default";
    if (!groupedByType[entryType]) groupedByType[entryType] = [];
    groupedByType[entryType].push(entry);
  });

  const goToMonthView = () => navigate(`/month/${month}`);
  const goToCalendar = () => navigate("/calendar");

return (
  <div className="day-view">
    <div className="top-bar">
      <button onClick={goToCalendar} className="home-button">🏠</button>
      <button onClick={goToMonthView} className="back-button">←</button>
    </div>

    <h2 className="day-date">{formattedDate}</h2>
    <p className="day-subtext"><em>{weekday}</em></p>
    <p className="day-subtext">Welcome! Let’s make today great 🌟</p>

    <div className="input-row">
      <input
        type="text"
        placeholder="Sounds like a plan..."
        value={newAppointment}
        onChange={(e) => setNewAppointment(e.target.value)}
        className="appointment-input"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="type-dropdown"
      >
        {typeOptions.map(opt => (
          <option key={opt} value={opt} style={{ backgroundColor: typeColors[opt] }}>
            {opt === "default" ? "  " : opt}
          </option>
        ))}
      </select>
      <button onClick={addAppointment} className="add-button">Add</button>
    </div>

    <div className="appointments">
      {Object.entries(groupedByType).map(([groupType, entries]) => (
        <div key={groupType} className="group-box" style={{ backgroundColor: typeColors[groupType] || "#f5f5f5" }}>
          <div className="group-header">
            <span className="group-title">{groupType === "default" ? "" : groupType}</span>
            <button onClick={() => toggleGroup(groupType)} className="collapse-button">
              {collapsedGroups[groupType] ? `+ (${entries.length})` : "-"}
            </button>
          </div>
          {!collapsedGroups[groupType] && (
            entries.map((a) => {
              const time = a.createdAt?.toDate?.()?.toLocaleTimeString?.() ?? "";
              return (
                <div key={a.id} className="appointment-entry">
                  <div className="entry-tab">
                    <span className="timestamp">{time}</span>
                    <button onClick={() => deleteAppointment(a.id)} className="delete-button">🗑️</button>
                  </div>
                  <div className="entry-body">{a.text}</div>
                </div>
              );
            })
          )}
        </div>
      ))}
    </div>
  </div>
);
};

export default DayView;

