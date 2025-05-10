// src/pages/Dashboard.tsx
import React from 'react';
import { auth } from '../firebase';
import Calendar from '../components/Calendar';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/login");
  };

   return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.welcome}>
          Welcome, {user?.displayName || user?.email}
        </h1>
        <button onClick={logout} style={styles.logoutButton}>Logout</button>
      </div>
      <Calendar />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '2rem',
  },
  welcome: {
    fontSize: '1.8rem',
    fontWeight: 600,
    marginBottom: '1rem',
    fontFamily: 'Quicksand, sans-serif',
    color: '#6a1b9a',
  },
  logoutButton: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#f8bbd0',
    border: 'none',
    borderRadius: '8px',
    color: '#6a1b9a',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default Dashboard;