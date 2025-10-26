import axios from 'axios';
import { getOrCreateSessionId } from './session';

const baseURL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL,
  headers: { 'x-session-id': getOrCreateSessionId() },
});

export async function health() {
  const { data } = await api.get('/api/health');
  return data;
}

// Missions
export async function getMissions() {
  const { data } = await api.get('/api/missions');
  // backend returns { data: { missions, pagination } }
  return data?.data?.missions || data?.data || data;
}
export async function startMission(id: string) {
  const { data } = await api.post('/api/missions/start', { missionId: id });
  return data;
}
export async function completeMission(id: string) {
  const { data } = await api.post('/api/missions/complete', { missionId: id });
  return data;
}

// Scenarios
export async function simulateScenario(payload: any) {
  const { data } = await api.post('/api/scenarios/simulate', payload);
  return data;
}

// Rewards
export async function getRewards() {
  const { data } = await api.get('/api/rewards');
  return data?.data?.rewards || data?.data || data;
}
export async function redeemReward(id: string) {
  const { data } = await api.post('/api/rewards/redeem', { rewardId: id });
  return data;
}

// Skill Tree
export async function getSkills() {
  const { data } = await api.get('/api/skill-tree');
  // backend returns tree with levels/skills; normalize to skills list for UI
  const skills = data?.data?.skills || data?.skills || [];
  return skills;
}
export async function unlockSkill(id: string) {
  const { data } = await api.post('/api/skill-tree/unlock', { skillId: id });
  return data;
}

// Social
export async function getSocialFeed() {
  // use leaderboard and friends as a basic feed
  const [friends, leaderboard] = await Promise.all([
    api.get('/api/social/friends'),
    api.get('/api/social/leaderboard'),
  ]);
  return { friends: friends.data?.data?.friends || [], leaderboard: leaderboard.data?.data?.leaderboard || [] };
}

// Profile
export async function getProfile() {
  const { data } = await api.get('/api/profile');
  return data?.data || data;
}
export async function updateProfile(payload: any) {
  const { data } = await api.put('/api/profile', payload);
  return data;
}


