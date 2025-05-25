
import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { useTypeContext } from '../context/TypeContext';
import { useAuth } from '../context/AuthProvider';

const isColorTooLight = (color: string) => {
  const c = color.substring(1); // remove #
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200;
};

const Dashboard: React.FC = () => {
  const { types, addType } = useTypeContext();
  const [newType, setNewType] = useState<string>('');

  const { user } = useAuth();

  // Loading state if user not loaded yet
  if (!user) return <p>Loading...</p>;


  const handleCreateType = async () => {
  const newTypeTrimmed = newType.trim().toLowerCase();

  if (!newTypeTrimmed) {
    console.log('❌ Please enter a valid type name.');
    return;
  }

  const added = await addType(newTypeTrimmed, '#9c4dcc');

  if (added) {
    console.log(`✅ Added new type: ${newTypeTrimmed}`);
    setNewType('');
  } else {
    console.log('❌ Duplicate type or max limit (10) reached.');
  }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', backgroundColor: '#fff0f5' }}>
      

      <h2>Welcome to your dashboard!</h2>
      <p>Here you can manage your calendar, tasks, and reminders.</p>
      

      {/* Calendar and Sidebar */}


      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ maxWidth: '75%' }}>
            <Calendar />
          </div>
        </div>

        <div style={{ flex: 1, marginLeft: '2rem' }}>
          <div>
            <h3>Upcoming Events</h3>
            <ul>
              <li>Meeting with team - 3 PM</li>
              <li>Doctor's appointment - 5 PM</li>
            </ul>
          </div>

          <div>
            <h3>High Priority Tasks</h3>
            <ul>
              <li>Finish project documentation</li>
              <li>Send emails to clients</li>
            </ul>
          </div>

          <div>
            <h3>Reminders</h3>
            <ul>
              <li>Buy groceries</li>
              <li>Pick up laundry</li>
            </ul>
          </div>

          {/* Create Type Section */}
          <div style={{ marginTop: '2rem' }}>
            <h3>Create New Type</h3>
            <input
              type="text"
              placeholder="Enter new type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              style={{
                padding: '0.5rem',
                marginRight: '1rem',
                width: '200px',
                borderRadius: '8px',
                border: '1px solid #e6e6e6',
              }}
            />
            <button
              onClick={handleCreateType}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#9c4dcc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Create Type
            </button>
            <p style={{ marginTop: '1rem' }}>Max 10 types allowed.</p>
          </div>

          {/* Available Types */}
           <div style={{ marginTop: '2rem', marginLeft: '1rem' }}>
  <h3>Available Types</h3>
  {types.length === 0 ? (
    <p style={{ color: '#888' }}>No types created yet.</p>
  ) : (
    <ul>
      {types.map((type) => (
        <li
          key={type.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: type.color,
              borderRadius: '50%',
              marginRight: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <span
            style={{
              color: isColorTooLight(type.color) ? '#333' : type.color,
              fontWeight: '500',
            }}
          >
            {type.label}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


