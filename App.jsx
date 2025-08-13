import React from 'react';
import { auth, db } from './firebase';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Fouraethiopia App</h1>
      <p>Firebase is connected!</p>
    </div>
  );
}
