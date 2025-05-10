import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to MyPlanner</h1>
      <p>Plan your days, months, and appointments with ease.</p>
      
      <Link to="/login">
        <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
      </Link>
      
      <Link to="/signup">
        <button style={{ margin: '10px', padding: '10px 20px' }}>Signup</button>
      </Link>
    </div>
  );
};

export default LandingPage;