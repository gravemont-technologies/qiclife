import React, { useEffect, useState } from 'react';

export default function Missions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/missions', {
        headers: { 'x-session-id': 'demo-session-123' }
      });
      const data = await response.json();
      if (data.success) {
        setMissions(data.data.missions || []);
        setError(null);
      } else {
        setError('Failed to load missions');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const startMission = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/missions/start', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': 'demo-session-123'
        },
        body: JSON.stringify({ missionId: id })
      });
      const data = await response.json();
      if (data.success) {
        alert('Mission started! +' + (data.data?.xpGained || 0) + ' XP');
        fetchMissions(); // Refresh missions
      } else {
        alert('Failed to start mission: ' + data.message);
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const completeMission = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/missions/complete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': 'demo-session-123'
        },
        body: JSON.stringify({ missionId: id })
      });
      const data = await response.json();
      if (data.success) {
        alert('Mission completed! +' + (data.data?.xpGained || 0) + ' XP, +' + (data.data?.coinsEarned || 0) + ' coins');
        fetchMissions(); // Refresh missions
      } else {
        alert('Failed to complete mission: ' + data.message);
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '🟢';
      case 'in_progress': return '🟡';
      case 'completed': return '✅';
      default: return '⚪';
    }
  };

  return (
    <div>
      {/* Filter Controls */}
      <div style={{ 
        background: '#f5f6fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontWeight: 'bold', color: '#5D44FF' }}>Filter:</span>
        {['all', 'available', 'in_progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              background: filter === status ? '#5D44FF' : 'white',
              color: filter === status ? 'white' : '#2E2E2E',
              border: '1px solid #ddd',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              textTransform: 'capitalize'
            }}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
        <button
          onClick={fetchMissions}
          style={{
            background: '#00D77F',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: 'auto'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5D44FF' }}>
          <div style={{ fontSize: '18px' }}>Loading missions...</div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#d32f2f', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f44336'
        }}>
          Error: {error}
        </div>
      )}

      {/* Missions Grid */}
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {filteredMissions.map((mission) => (
          <div 
            key={mission.id} 
            style={{ 
              background: 'white',
              border: `2px solid ${getStatusColor(mission.status)}`,
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {/* Mission Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#2E2E2E', fontSize: '18px' }}>
                {mission.title_en || mission.title || mission.id}
              </h3>
              <div style={{ 
                background: getStatusColor(mission.status), 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getStatusIcon(mission.status)} {mission.status?.replace('_', ' ') || 'available'}
              </div>
            </div>

            {/* Mission Description */}
            <p style={{ 
              color: '#666', 
              margin: '0 0 15px 0', 
              lineHeight: '1.4',
              fontSize: '14px'
            }}>
              {mission.description_en || mission.description || 'Complete this mission to earn rewards!'}
            </p>

            {/* Mission Stats */}
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#FF9800' }}>⭐</span>
                <span style={{ fontWeight: 'bold' }}>{mission.xp_reward || mission.xp_reward_min || 10} XP</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#FFD700' }}>🪙</span>
                <span style={{ fontWeight: 'bold' }}>{mission.coin_reward || 0} coins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#9C27B0' }}>🏆</span>
                <span style={{ fontWeight: 'bold' }}>Level {mission.required_level || 1}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => startMission(mission.id)}
                style={{ 
                  background: '#5D44FF', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Start Mission
              </button>
              <button 
                onClick={() => completeMission(mission.id)}
                style={{ 
                  background: '#00D77F', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Complete Mission
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredMissions.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
          <h3 style={{ color: '#5D44FF', marginBottom: '10px' }}>No missions found</h3>
          <p>Try adjusting your filter or check back later for new missions!</p>
        </div>
      )}
    </div>
  );
}


