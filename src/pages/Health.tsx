import React, { useEffect, useState } from 'react';

export default function Health() {
  const [health, setHealth] = useState('Checking...');
  const [version, setVersion] = useState('N/A');
  const [uptime, setUptime] = useState('N/A');
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health', {
        headers: { 'x-session-id': 'demo-session-123' }
      });
      const data = await response.json();
      
      if (data.success) {
        setHealth(data.data.status);
        setVersion(data.data.version);
        setUptime(Math.round(data.data.uptime) + 's');
        setError(null);
      } else {
        setError('Backend returned error');
        setHealth('Error');
      }
    } catch (err) {
      setError(err.message);
      setHealth('Error');
    }
    setLastChecked(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* System Status Card */}
        <div style={{ 
          background: error ? '#ffebee' : '#e8f5e8', 
          border: `2px solid ${error ? '#f44336' : '#4caf50'}`,
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: error ? '#d32f2f' : '#2e7d32' }}>
            System Status
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: error ? '#d32f2f' : '#2e7d32' }}>
            {health}
          </div>
          {error && <p style={{ color: '#d32f2f', margin: '10px 0 0 0' }}>{error}</p>}
        </div>

        {/* Version Card */}
        <div style={{ 
          background: '#f3e5f5', 
          border: '2px solid #9c27b0',
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Version</h3>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7b1fa2' }}>
            {version}
          </div>
        </div>

        {/* Uptime Card */}
        <div style={{ 
          background: '#e3f2fd', 
          border: '2px solid #2196f3',
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Uptime</h3>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>
            {uptime}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        background: '#f5f6fa', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#5D44FF' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={fetchHealth}
            style={{
              background: '#5D44FF',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Status
          </button>
          <button 
            onClick={() => {
              fetch('http://localhost:3001/api/missions', {
                headers: { 'x-session-id': 'demo-session-123' }
              })
              .then(r => r.json())
              .then(d => alert('Missions API: ' + JSON.stringify(d.data?.missions?.length || 0) + ' missions available'))
              .catch(e => alert('Error: ' + e.message));
            }}
            style={{
              background: '#00D77F',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test Missions API
          </button>
          <button 
            onClick={() => {
              fetch('http://localhost:3001/api/rewards', {
                headers: { 'x-session-id': 'demo-session-123' }
              })
              .then(r => r.json())
              .then(d => alert('Rewards API: ' + JSON.stringify(d.data?.rewards?.length || 0) + ' rewards available'))
              .catch(e => alert('Error: ' + e.message));
            }}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test Rewards API
          </button>
        </div>
      </div>

      {/* Last Checked */}
      <div style={{ 
        background: '#e8f5e8', 
        borderRadius: '6px', 
        padding: '10px 15px',
        fontSize: '14px',
        color: '#2e7d32'
      }}>
        Last checked: {lastChecked || 'Never'}
      </div>
    </div>
  );
}


