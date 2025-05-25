import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TypeContextProvider } from './context/TypeContext';
import reportWebVitals from './reportWebVitals';

import { clearIndexedDbPersistence } from "firebase/firestore";
import { db } from './firebase';  // Your Firestore instance

async function startApp() {
  try {
    await clearIndexedDbPersistence(db);
    console.log("Cleared Firestore persistence");
  } catch (e) {
    console.warn("Failed to clear persistence", e);
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <TypeContextProvider>
        <App />
      </TypeContextProvider>
    </React.StrictMode>
  );
}

startApp();

// Optional: report web vitals as before
reportWebVitals();


