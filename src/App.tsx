import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [userStats, setUserStats] = useState({
    xp: 0,
    coins: 0,
    level: 1,
    lifeScore: 750
  });

  // Check backend status
  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(r => r.json())
      .then(data => setBackendStatus(data.success ? 'Connected' : 'Error'))
      .catch(() => setBackendStatus('Disconnected'));
  }, []);

  const pages = {
    dashboard: 'Dashboard',
    missions: 'Missions', 
    rewards: 'Rewards',
    profile: 'Profile'
  };

  const renderDashboard = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#2e7d32', margin: '0 0 10px 0' }}>LifeScore</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2e7d32' }}>{userStats.lifeScore}</div>
        </div>
        <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#f57c00', margin: '0 0 10px 0' }}>XP</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f57c00' }}>{userStats.xp}</div>
        </div>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>Level</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>{userStats.level}</div>
        </div>
        <div style={{ background: '#f3e5f5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#7b1fa2', margin: '0 0 10px 0' }}>Coins</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7b1fa2' }}>{userStats.coins}</div>
        </div>
      </div>

      <div style={{ background: '#f5f6fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#5D44FF', margin: '0 0 15px 0' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              setUserStats(prev => ({ ...prev, xp: prev.xp + 50, coins: prev.coins + 10 }));
              alert('Mission completed! +50 XP, +10 coins');
            }}
            style={{
              background: '#5D44FF',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Complete Mission (+50 XP)
          </button>
          <button 
            onClick={() => {
              setUserStats(prev => ({ ...prev, coins: prev.coins + 25 }));
              alert('Reward claimed! +25 coins');
            }}
            style={{
              background: '#00D77F',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Claim Reward (+25 coins)
          </button>
          <button 
            onClick={() => {
              setUserStats(prev => ({ ...prev, lifeScore: Math.min(1000, prev.lifeScore + 25) }));
              alert('LifeScore improved! +25 points');
            }}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Improve LifeScore (+25)
          </button>
        </div>
      </div>

      <div style={{ background: backendStatus === 'Connected' ? '#e8f5e8' : '#ffebee', padding: '15px', borderRadius: '8px', border: `2px solid ${backendStatus === 'Connected' ? '#4caf50' : '#f44336'}` }}>
        <h4 style={{ margin: '0 0 5px 0', color: backendStatus === 'Connected' ? '#2e7d32' : '#d32f2f' }}>
          Backend Status: {backendStatus}
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: backendStatus === 'Connected' ? '#2e7d32' : '#d32f2f' }}>
          {backendStatus === 'Connected' ? 'All systems operational' : 'Backend server not running'}
        </p>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div>
      <h3 style={{ color: '#5D44FF', marginBottom: '20px' }}>Available Missions</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {[
          { id: 1, title: 'Complete Health Check', description: 'Take a health assessment to improve your LifeScore', xp: 100, coins: 20 },
          { id: 2, title: 'Update Profile', description: 'Keep your profile information current', xp: 50, coins: 10 },
          { id: 3, title: 'Explore Rewards', description: 'Check out available rewards and benefits', xp: 75, coins: 15 }
        ].map(mission => (
          <div key={mission.id} style={{ 
            background: 'white', 
            border: '2px solid #e0d8ff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2E2E2E' }}>{mission.title}</h4>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>{mission.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                <span style={{ color: '#FF9800' }}>⭐ {mission.xp} XP</span>
                <span style={{ color: '#FFD700' }}>🪙 {mission.coins} coins</span>
              </div>
              <button 
                onClick={() => {
                  setUserStats(prev => ({ 
                    ...prev, 
                    xp: prev.xp + mission.xp, 
                    coins: prev.coins + mission.coins,
                    level: Math.floor((prev.xp + mission.xp) / 100) + 1
                  }));
                  alert(`Mission completed! +${mission.xp} XP, +${mission.coins} coins`);
                }}
                style={{
                  background: '#5D44FF',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div>
      <h3 style={{ color: '#5D44FF', marginBottom: '20px' }}>Available Rewards</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {[
          { id: 1, title: 'Health Consultation', description: 'Free 30-minute health consultation', cost: 100, category: 'Health' },
          { id: 2, title: 'Gym Membership', description: '3-month gym membership discount', cost: 200, category: 'Fitness' },
          { id: 3, title: 'Insurance Discount', description: '5% discount on next premium payment', cost: 500, category: 'Insurance' }
        ].map(reward => (
          <div key={reward.id} style={{ 
            background: 'white', 
            border: '2px solid #e0d8ff', 
            borderRadius: '8px', 
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#2E2E2E' }}>{reward.title}</h4>
              <span style={{ 
                background: '#00D77F', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {reward.category}
              </span>
            </div>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>{reward.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px', fontWeight: 'bold', color: '#7b1fa2' }}>
                🪙 {reward.cost} coins
              </div>
              <button 
                onClick={() => {
                  if (userStats.coins >= reward.cost) {
                    setUserStats(prev => ({ ...prev, coins: prev.coins - reward.cost }));
                    alert(`Reward redeemed! -${reward.cost} coins`);
                  } else {
                    alert(`Not enough coins! Need ${reward.cost}, have ${userStats.coins}`);
                  }
                }}
                disabled={userStats.coins < reward.cost}
                style={{
                  background: userStats.coins >= reward.cost ? '#00D77F' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: userStats.coins >= reward.cost ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                {userStats.coins >= reward.cost ? 'Redeem' : 'Not enough coins'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
      <h3 style={{ color: '#5D44FF', marginBottom: '20px' }}>User Profile</h3>
      <div style={{ background: 'white', border: '2px solid #e0d8ff', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#2E2E2E' }}>Current Stats</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>LifeScore</label>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>{userStats.lifeScore}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Experience Points</label>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>{userStats.xp}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Level</label>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{userStats.level}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Coins</label>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>{userStats.coins}</div>
          </div>
        </div>
      </div>
      
      <div style={{ background: '#f5f6fa', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#5D44FF' }}>Profile Settings</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              setUserStats({ xp: 0, coins: 0, level: 1, lifeScore: 750 });
              alert('Profile reset!');
            }}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset Profile
          </button>
          <button 
            onClick={() => {
              setUserStats(prev => ({ ...prev, xp: prev.xp + 1000, coins: prev.coins + 500 }));
              alert('Cheat activated! +1000 XP, +500 coins');
            }}
            style={{
              background: '#9c27b0',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cheat Mode
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return renderDashboard();
      case 'missions': return renderMissions();
      case 'rewards': return renderRewards();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e0d8ff 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        background: '#5D44FF', 
        color: 'white', 
        padding: '20px',
        boxShadow: '0 2px 10px rgba(93, 68, 255, 0.3)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>QIC Life MVP</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Gamified Insurance Experience</p>
      </div>

      {/* Navigation */}
      <div style={{ 
        background: 'white', 
        padding: '15px 20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {Object.entries(pages).map(([key, title]) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key)}
            style={{
              background: currentPage === key ? '#00D77F' : '#F5F6FA',
              color: currentPage === key ? 'white' : '#2E2E2E',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: currentPage === key ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              fontSize: '14px'
            }}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          minHeight: '500px'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


