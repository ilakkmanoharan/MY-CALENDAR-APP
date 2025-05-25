import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; //
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


const signup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name in Firebase Auth
    await updateProfile(user, { displayName: name });

    // Create a userProfile document in Firestore
    await setDoc(doc(db, 'userProfile', user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      createdAt: new Date(),
    });

    navigate("/dashboard");
  } catch (error) {
    console.error("Signup failed", error);
    alert("Signup failed");
  }
};

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>

        <input
          className="signup-input"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="signup-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <p className="signup-note">
          Note: Passwords must be at least 6 characters long to meet Firebase requirements.
        </p>

        <button className="signup-button" onClick={signup}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;

