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
            onClick={async () => {
              try {
                console.log('Testing backend connection...');
                const response = await fetch('http://localhost:3001/api/health', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);
                alert('Backend: ' + JSON.stringify(data));
              } catch (error) {
                console.error('Backend error:', error);
                alert('Backend error: ' + error.message);
              }
            }}
          >
            Test Backend
          </button>
        </div>
      </div>
    </div>
  );
}


