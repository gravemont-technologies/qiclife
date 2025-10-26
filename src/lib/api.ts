import axios, { AxiosError } from 'axios';
import type {
  ApiResponse,
  UserProfile,
  UserStats,
  Mission,
  MissionCompletion,
  Reward,
  RewardRedemption,
  Skill,
  LeaderboardEntry,
  Friend,
  OnboardingData,
  Scenario,
  ScenarioResult,
} from '@/types/api';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Enhanced error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend may be offline:', error.message);
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 3001.');
    }
    
    // Handle specific HTTP errors
    if (error.response.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    // Pass through other errors with response data
    throw error;
  }
);

// API Methods with proper TypeScript types
export const apiClient = {
  // Health
  getHealth: () => api.get<ApiResponse<{ status: string; timestamp: string }>>('/health'),

  // Profile
  getProfile: () => api.get<ApiResponse<UserProfile>>('/profile'),
  updateProfile: (data: Partial<UserProfile>) => api.put<ApiResponse<UserProfile>>('/profile', data),
  getStats: () => api.get<ApiResponse<UserStats>>('/profile/stats'),

  // Missions
  getMissions: () => api.get<ApiResponse<{ missions: Mission[] }>>('/missions'),
  getMissionById: (id: string) => api.get<ApiResponse<Mission>>(`/missions/${id}`),
  startMission: (id: string) => api.post<ApiResponse<{ mission: Mission }>>(`/missions/${id}/start`),
  completeMission: (id: string) => api.post<ApiResponse<MissionCompletion>>(`/missions/${id}/complete`),

  // Rewards
  getRewards: () => api.get<ApiResponse<{ rewards: Reward[] }>>('/rewards'),
  getRewardById: (id: string) => api.get<ApiResponse<Reward>>(`/rewards/${id}`),
  redeemReward: (id: string) => api.post<ApiResponse<RewardRedemption>>(`/rewards/${id}/redeem`),
  getRedemptions: () => api.get<ApiResponse<{ redemptions: RewardRedemption[] }>>('/rewards/redemptions'),

  // Skills
  getSkills: () => api.get<ApiResponse<{ skills: Skill[] }>>('/skills'),
  unlockSkill: (id: string) => api.post<ApiResponse<{ skill: Skill; remainingXP: number }>>(`/skills/${id}/unlock`),

  // Social
  getLeaderboard: (limit?: number) => 
    api.get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>('/social/leaderboard', { params: { limit } }),
  getFriends: () => api.get<ApiResponse<{ friends: Friend[] }>>('/social/friends'),
  addFriend: (friendId: string) => api.post<ApiResponse<Friend>>('/social/friends', { friendId }),
  removeFriend: (friendId: string) => api.delete<ApiResponse<{ message: string }>>(`/social/friends/${friendId}`),

  // Onboarding
  completeOnboarding: (data: OnboardingData) => 
    api.post<ApiResponse<{ profile: UserProfile; initialMissions: Mission[] }>>('/onboarding/complete', data),

  // Scenarios
  getScenarios: () => api.get<ApiResponse<{ scenarios: Scenario[] }>>('/scenarios'),
  submitScenario: (scenarioId: string, choice: string) => 
    api.post<ApiResponse<ScenarioResult>>(`/scenarios/${scenarioId}/submit`, { choice }),
};

export default api;
