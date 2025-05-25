





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useTypeContext } from "../context/TypeContext";
import { saveUserScopedEntry } from "../firestoreUtils";
import { useAuth } from "../context/AuthProvider"; // ✅ NEW
import { serverTimestamp } from "firebase/firestore";

const DayView: React.FC = () => {
  const { date, month } = useParams<{ date: string; month: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState("");
  const [type, setType] = useState("default");
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const { user } = useAuth(); // ✅ NEW
  const { types } = useTypeContext();

  const typeColors: { [key: string]: string } = Object.fromEntries(
    types.map(t => [t.label, t.color])
  );

  const year = new Date().getFullYear();
  const numericMonth = Number(month);
  const numericDate = Number(date);

  const fullDateStr = `${year}-${String(numericMonth + 1).padStart(2, '0')}-${String(numericDate).padStart(2, '0')}`;
  const constructedDate = new Date(year, numericMonth, numericDate);
  const getSuffix = (d: number) => (d > 3 && d < 21) ? "th" : ["st", "nd", "rd"][(d % 10) - 1] || "th";
  const formattedDate = `${constructedDate.toLocaleString('default', { month: 'long' })} ${numericDate}${getSuffix(numericDate)}, ${year}`;
  const weekday = constructedDate.toLocaleDateString("en-US", { weekday: "long" });

  useEffect(() => {
    if (!user || !date || !month) return;

    const uid = user.uid;
    const dataRef = collection(db, "appointments", uid, "data");

    const q = query(
      dataRef,
      where("date", "==", fullDateStr),
      orderBy("createdAt", "desc")
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(items);
    });

    return () => {
      unsubscribeSnapshot();
    };
  }, [user, date, month, fullDateStr]); // ✅ includes user


  const addAppointment = async () => {
  if (!newAppointment.trim() || !user) return;

  const uid = user.uid;
  const dataRef = collection(db, "appointments", uid, "data");
  const newDocRef = doc(dataRef); // generate new doc ref with ID

  // Construct temporary appointment with client timestamp and known id
  const tempEntry = {
    id: newDocRef.id,
    text: newAppointment,
    type: type || "default",
    date: fullDateStr,
    createdAt: new Date(), // client timestamp for instant UI update
  };

  // Add temp entry to local state immediately
  setAppointments(prev => [tempEntry, ...prev]);

  try {
    // Save to Firestore with server timestamp
    await setDoc(newDocRef, {
      text: newAppointment,
      type: type || "default",
      date: fullDateStr,
      createdAt: serverTimestamp(),
    });

    // Clear input only after successful save
    setNewAppointment("");
    setType("default");

  } catch (error) {
    console.error("Error adding appointment: ", error);
    // Remove the temp entry since save failed
    setAppointments(prev => prev.filter(entry => entry.id !== newDocRef.id));
    alert("Failed to add appointment. Please try again.");
  }
};



  const deleteAppointment = async (id: string) => {
    if (!user) return;

    const uid = user.uid;
    await deleteDoc(doc(db, "appointments", uid, "data", id));
  };

  const toggleGroup = (groupType: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType],
    }));
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
          {types.map(opt => (
            <option
              key={opt.label}
              value={opt.label}
              style={{ backgroundColor: opt.color }}
            >
              {opt.label === "default" ? "  " : opt.label}
            </option>
          ))}
        </select>
        <button onClick={addAppointment} className="add-button">Add</button>
      </div>

      <div className="appointments">
        {Object.entries(groupedByType).map(([groupType, entries]) => (
          <div
            key={groupType}
            className="group-box"
            style={{ backgroundColor: typeColors[groupType] || "#f5f5f5" }}
          >
            <div className="group-header">
              <span className="group-title">{groupType === "default" ? "" : groupType}</span>
              <button onClick={() => toggleGroup(groupType)} className="collapse-button">
                {collapsedGroups[groupType] ? `+ (${entries.length})` : "-"}
              </button>
            </div>
            {!collapsedGroups[groupType] &&
              entries.map((a) => {
                const time = a.createdAt?.toDate?.()?.toLocaleTimeString?.() ?? "";
                return (
                  <div key={a.id} className="appointment-entry">
                    <div className="entry-tab">
                      <span className="timestamp">{time}</span>
                      <button onClick={() => deleteAppointment(a.id)} className="delete-button">
                        🗑️
                      </button>
                    </div>
                    <div className="entry-body">{a.text}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;



