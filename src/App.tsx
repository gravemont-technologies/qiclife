import React from 'react';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#5D44FF', marginBottom: 20 }}>QIC Life MVP</h1>
      <div style={{ background: '#F5F6FA', padding: 20, borderRadius: 8 }}>
        <h2>Welcome to QIC Life!</h2>
        <p>This is a working React app. If you can see this, the frontend is working!</p>
        <div style={{ marginTop: 20 }}>
          <button 
            style={{ 
              background: '#5D44FF', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: 5,
              marginRight: 10,
              cursor: 'pointer'
            }}
            onClick={() => alert('Button works!')}
          >
            Test Button
          </button>
          <button 
            style={{ 
              background: '#00D77F', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: 5,
              cursor: 'pointer'
            }}
            onClick={() => {
              fetch('http://localhost:3001/api/health')
                .then(r => r.json())
                .then(d => alert('Backend: ' + JSON.stringify(d)))
                .catch(e => alert('Backend error: ' + e.message));
            }}
          >
            Test Backend
          </button>
        </div>
      </div>
    </div>
  );
}


