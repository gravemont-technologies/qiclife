import React, { useState } from 'react';
import Health from './pages/Health';
import Missions from './pages/Missions';
import Scenarios from './pages/Scenarios';
import Rewards from './pages/Rewards';
import SkillTree from './pages/SkillTree';
import Social from './pages/Social';
import Profile from './pages/Profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('health');

  const pages = {
    health: { component: Health, title: 'Health Dashboard' },
    missions: { component: Missions, title: 'Missions' },
    scenarios: { component: Scenarios, title: 'Scenarios' },
    rewards: { component: Rewards, title: 'Rewards' },
    skillTree: { component: SkillTree, title: 'Skill Tree' },
    social: { component: Social, title: 'Social' },
    profile: { component: Profile, title: 'Profile' }
  };

  const CurrentComponent = pages[currentPage].component;

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
        {Object.entries(pages).map(([key, page]) => (
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
            onMouseOver={(e) => {
              if (currentPage !== key) {
                e.target.style.background = '#E0D8FF';
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== key) {
                e.target.style.background = '#F5F6FA';
              }
            }}
          >
            {page.title}
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
          <h2 style={{ 
            color: '#5D44FF', 
            marginBottom: '20px',
            fontSize: '24px',
            borderBottom: '2px solid #E0D8FF',
            paddingBottom: '10px'
          }}>
            {pages[currentPage].title}
          </h2>
          <CurrentComponent />
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        background: '#2E2E2E', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ margin: 0, opacity: 0.8 }}>
          QIC Life MVP - Gamified Insurance Experience | Version 1.0.0
        </p>
      </div>
    </div>
  );
}


