import axios from 'axios';
import { getSessionId } from './session';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to attach session ID
api.interceptors.request.use(
  (config) => {
    const sessionId = getSessionId();
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login or show modal
      console.warn('Unauthorized request');
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      console.warn('Rate limit exceeded');
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout
      console.warn('Request timeout');
    }
    return Promise.reject(error);
  }
);

// Onboarding API
export const onboardingAPI = {
  submit: (data: any) => api.post('/api/onboarding/submit', data),
  getProgress: () => api.get('/api/onboarding/progress'),
  getIntegrations: () => api.get('/api/onboarding/integrations'),
  reset: () => api.delete('/api/onboarding/reset'),
};

// Missions API
export const missionsAPI = {
  getAll: (filters?: any) => api.get('/api/missions', { params: filters }),
  getById: (missionId: string) => api.get(`/api/missions/${missionId}`),
  start: (missionId: string) => api.post('/api/missions/start', { missionId }),
  complete: (missionId: string, completionData?: any) => 
    api.post('/api/missions/complete', { missionId, completionData }),
  join: (missionId: string) => api.post('/api/missions/join', { missionId }),
  getActive: () => api.get('/api/missions/user/active'),
  getCompleted: () => api.get('/api/missions/user/completed'),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/api/profile'),
  update: (data: any) => api.put('/api/profile', data),
  getStats: () => api.get('/api/profile/stats'),
  updatePreferences: (preferences: any) => 
    api.put('/api/profile/preferences', { preferences }),
  updateSettings: (settings: any) => 
    api.put('/api/profile/settings', { settings }),
  getIntegrations: () => api.get('/api/profile/integrations'),
  updateIntegrations: (integrations: string[]) => 
    api.put('/api/profile/integrations', { integrations }),
};

// AI API
export const aiAPI = {
  getRecommendations: (type?: string) => 
    api.get('/api/ai/recommendations', { params: { type } }),
  getRecommendationsWithContext: (context: string, type?: string) => 
    api.post('/api/ai/recommendations', { context, type }),
  generateProfile: (onboardingData: any) => 
    api.post('/api/ai/profile', { onboardingData }),
  simulateScenario: (scenarioInputs: any) => 
    api.post('/api/ai/scenarios/simulate', scenarioInputs),
  getInsights: () => api.get('/api/ai/insights'),
  chat: (message: string, context?: any) => 
    api.post('/api/ai/chat', { message, context }),
};

// Health API
export const healthAPI = {
  check: () => api.get('/api/health'),
  detailed: () => api.get('/api/health/detailed'),
};

// Social API
export const socialAPI = {
  getFriends: () => api.get('/api/social/friends'),
  getLeaderboard: () => api.get('/api/social/leaderboard'),
  getCollaborativeMissions: () => api.get('/api/social/missions'),
  inviteFriend: (friendId: string) => api.post('/api/social/invite', { friendId }),
  joinMission: (missionId: string) => api.post('/api/missions/join', { missionId }),
};

// Scenarios API
export const scenariosAPI = {
  getAll: () => api.get('/api/scenarios'),
  simulate: (data: any) => api.post('/api/ai/scenarios/simulate', data),
};

// Rewards API
export const rewardsAPI = {
  getAll: () => api.get('/api/rewards'),
  getBadges: () => api.get('/api/rewards/badges'),
  getPartnerOffers: () => api.get('/api/rewards/offers'),
  getUserRewards: () => api.get('/api/rewards/user'),
  redeem: (rewardId: string) => api.post('/api/rewards/redeem', { rewardId }),
};

// Skill Tree API
export const skillTreeAPI = {
  getTree: (category?: string) => api.get('/api/skill-tree', { params: { category } }),
  getUserSkills: () => api.get('/api/skill-tree/user'),
  unlockSkill: (skillId: string) => api.post('/api/skill-tree/unlock', { skillId }),
};

// Generic API methods
export const apiClient = {
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),
};

export default api;
