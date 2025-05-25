// src/components/Layout.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {/* Home Button */}
        <button
          onClick={goToDashboard}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            margin: '1rem',
            padding: '0.4rem 0.8rem',
            fontSize: '1.2rem',
            fontWeight: 600,
            backgroundColor: '#d1c4e9',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#4527a0',
          }}
        >
          Home
        </button>

        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: '1rem',
          fontFamily: 'Quicksand, sans-serif',
          color: '#6a1b9a',
        }}>
          Welcome, {user?.displayName || user?.email}
        </h1>

        <button
          onClick={logout}
          style={{
            padding: '0.5rem 1.2rem',
            backgroundColor: '#f8bbd0',
            border: 'none',
            borderRadius: '8px',
            color: '#6a1b9a',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Logout
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

