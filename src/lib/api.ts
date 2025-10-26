import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Get or create session ID
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('qic-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('qic-session-id', sessionId);
  }
  return sessionId;
};

// Create axios instance with session header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add session ID to all requests
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
});

// API Methods
export const apiClient = {
  // Health
  getHealth: () => api.get('/health'),

  // Profile
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),
  getStats: () => api.get('/profile/stats'),

  // Missions
  getMissions: () => api.get('/missions'),
  getMissionById: (id: string) => api.get(`/missions/${id}`),
  startMission: (id: string) => api.post(`/missions/${id}/start`),
  completeMission: (id: string) => api.post(`/missions/${id}/complete`),

  // Rewards
  getRewards: () => api.get('/rewards'),
  getRewardById: (id: string) => api.get(`/rewards/${id}`),
  redeemReward: (id: string) => api.post(`/rewards/${id}/redeem`),
  getRedemptions: () => api.get('/rewards/redemptions'),

  // Skills
  getSkills: () => api.get('/skills'),
  unlockSkill: (id: string) => api.post(`/skills/${id}/unlock`),

  // Social
  getLeaderboard: (limit?: number) => api.get('/social/leaderboard', { params: { limit } }),
  getFriends: () => api.get('/social/friends'),
  addFriend: (friendId: string) => api.post('/social/friends', { friendId }),
  removeFriend: (friendId: string) => api.delete(`/social/friends/${friendId}`),

  // Onboarding
  completeOnboarding: (data: any) => api.post('/onboarding/complete', data),

  // Scenarios
  getScenarios: () => api.get('/scenarios'),
  submitScenario: (scenarioId: string, choice: string) => 
    api.post(`/scenarios/${scenarioId}/submit`, { choice }),
};

export default api;
