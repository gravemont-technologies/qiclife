// QIC Gamified Insurance App - Missions Service
// Handles all mission-related operations with mock data

import type {
  Mission,
  UserMission,
  MissionCategory,
  MissionDifficulty,
  MissionStatus,
  MissionRecommendation
} from '@/types';
import { aiService } from './ai';

// Mock missions data
const mockMissions: Mission[] = [
  {
    id: 'mission_001',
    category: 'safe_driving',
    title_en: 'Safe Driver Challenge',
    title_ar: 'تحدي السائق الآمن',
    description_en: 'Complete 7 consecutive days of safe driving without any violations or accidents.',
    description_ar: 'أكمل 7 أيام متتالية من القيادة الآمنة دون أي مخالفات أو حوادث.',
    difficulty: 'medium',
    xp_reward: 75,
    lifescore_impact: 15,
    requirements: {
      min_level: 2,
      time_constraints: {
        days_of_week: [1, 2, 3, 4, 5, 6, 7]
      }
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 7,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mission_002',
    category: 'health',
    title_en: 'Daily Health Check',
    title_ar: 'فحص الصحة اليومي',
    description_en: 'Log your daily health metrics including steps, heart rate, and sleep quality.',
    description_ar: 'سجل مقاييس صحتك اليومية بما في ذلك الخطوات ومعدل ضربات القلب وجودة النوم.',
    difficulty: 'easy',
    xp_reward: 25,
    lifescore_impact: 10,
    requirements: {
      min_level: 1
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mission_003',
    category: 'financial_guardian',
    title_en: 'Financial Health Assessment',
    title_ar: 'تقييم الصحة المالية',
    description_en: 'Complete a comprehensive financial health assessment and create a protection plan.',
    description_ar: 'أكمل تقييم شامل للصحة المالية وأنشئ خطة حماية.',
    difficulty: 'hard',
    xp_reward: 100,
    lifescore_impact: 25,
    requirements: {
      min_level: 3,
      required_skills: ['financial_planning', 'risk_assessment']
    },
    is_collaborative: true,
    max_participants: 4,
    duration_days: 14,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mission_004',
    category: 'family_protection',
    title_en: 'Family Safety Plan',
    title_ar: 'خطة أمان العائلة',
    description_en: 'Create and implement a comprehensive family safety plan including emergency contacts and procedures.',
    description_ar: 'أنشئ ونفذ خطة أمان شاملة للعائلة تشمل جهات الاتصال والإجراءات الطارئة.',
    difficulty: 'medium',
    xp_reward: 60,
    lifescore_impact: 20,
    requirements: {
      min_level: 2,
      previous_missions: ['mission_001']
    },
    is_collaborative: true,
    max_participants: 6,
    duration_days: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mission_005',
    category: 'lifestyle',
    title_en: 'Wellness Journey',
    title_ar: 'رحلة العافية',
    description_en: 'Start a 30-day wellness journey focusing on physical, mental, and emotional health.',
    description_ar: 'ابدأ رحلة عافية لمدة 30 يوماً تركز على الصحة الجسدية والعقلية والعاطفية.',
    difficulty: 'expert',
    xp_reward: 150,
    lifescore_impact: 35,
    requirements: {
      min_level: 5,
      required_skills: ['wellness_planning', 'habit_formation']
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 30,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock user missions data
const mockUserMissions: UserMission[] = [
  {
    id: 'user_mission_001',
    user_id: 'user_001',
    mission_id: 'mission_001',
    status: 'active',
    progress: 45,
    started_at: '2024-01-15T00:00:00Z',
    xp_earned: 0,
    lifescore_change: 0,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_mission_002',
    user_id: 'user_001',
    mission_id: 'mission_002',
    status: 'completed',
    progress: 100,
    started_at: '2024-01-10T00:00:00Z',
    completed_at: '2024-01-10T23:59:59Z',
    xp_earned: 25,
    lifescore_change: 10,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T23:59:59Z'
  }
];

// Missions Service Class
export class MissionsService {
  // Get all available missions
  async getAllMissions(filters?: {
    category?: MissionCategory;
    difficulty?: MissionDifficulty;
    is_collaborative?: boolean;
    is_active?: boolean;
  }): Promise<Mission[]> {
    await this.simulateDelay();
    
    let filteredMissions = [...mockMissions];
    
    if (filters?.category) {
      filteredMissions = filteredMissions.filter(mission => mission.category === filters.category);
    }
    
    if (filters?.difficulty) {
      filteredMissions = filteredMissions.filter(mission => mission.difficulty === filters.difficulty);
    }
    
    if (filters?.is_collaborative !== undefined) {
      filteredMissions = filteredMissions.filter(mission => mission.is_collaborative === filters.is_collaborative);
    }
    
    if (filters?.is_active !== undefined) {
      filteredMissions = filteredMissions.filter(mission => mission.is_active === filters.is_active);
    }
    
    return filteredMissions;
  }

  // Get mission by ID
  async getMissionById(missionId: string): Promise<Mission | null> {
    await this.simulateDelay();
    return mockMissions.find(mission => mission.id === missionId) || null;
  }

  // Get user's missions
  async getUserMissions(userId: string, status?: MissionStatus): Promise<UserMission[]> {
    await this.simulateDelay();
    
    let userMissions = mockUserMissions.filter(um => um.user_id === userId);
    
    if (status) {
      userMissions = userMissions.filter(um => um.status === status);
    }
    
    return userMissions;
  }

  // Start a mission
  async startMission(userId: string, missionId: string): Promise<UserMission> {
    await this.simulateDelay();
    
    const mission = await this.getMissionById(missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }
    
    // Check if user already has this mission
    const existingUserMission = mockUserMissions.find(
      um => um.user_id === userId && um.mission_id === missionId
    );
    
    if (existingUserMission) {
      throw new Error('Mission already started');
    }
    
    const userMission: UserMission = {
      id: `user_mission_${Date.now()}`,
      user_id: userId,
      mission_id: missionId,
      status: 'active',
      progress: 0,
      started_at: new Date().toISOString(),
      xp_earned: 0,
      lifescore_change: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockUserMissions.push(userMission);
    return userMission;
  }

  // Update mission progress
  async updateMissionProgress(
    userMissionId: string,
    progress: number
  ): Promise<UserMission> {
    await this.simulateDelay();
    
    const userMission = mockUserMissions.find(um => um.id === userMissionId);
    if (!userMission) {
      throw new Error('User mission not found');
    }
    
    userMission.progress = Math.min(progress, 100);
    userMission.updated_at = new Date().toISOString();
    
    // Auto-complete if progress reaches 100%
    if (userMission.progress >= 100 && userMission.status === 'active') {
      await this.completeMission(userMissionId);
    }
    
    return userMission;
  }

  // Complete a mission
  async completeMission(userMissionId: string): Promise<UserMission> {
    await this.simulateDelay();
    
    const userMission = mockUserMissions.find(um => um.id === userMissionId);
    if (!userMission) {
      throw new Error('User mission not found');
    }
    
    const mission = await this.getMissionById(userMission.mission_id);
    if (!mission) {
      throw new Error('Mission not found');
    }
    
    userMission.status = 'completed';
    userMission.progress = 100;
    userMission.completed_at = new Date().toISOString();
    userMission.xp_earned = mission.xp_reward;
    userMission.lifescore_change = mission.lifescore_impact;
    userMission.updated_at = new Date().toISOString();
    
    return userMission;
  }

  // Get AI recommendations for missions
  async getMissionRecommendations(
    userId: string,
    context: {
      currentLevel: number;
      lifescore: number;
      recentMissions: string[];
      preferences: string[];
    }
  ): Promise<MissionRecommendation[]> {
    const response = await aiService.generateMissionRecommendations(userId, context);
    return response.data || [];
  }

  // Get mission statistics
  async getMissionStats(userId: string): Promise<{
    total_missions: number;
    completed_missions: number;
    active_missions: number;
    total_xp_earned: number;
    total_lifescore_change: number;
    completion_rate: number;
  }> {
    await this.simulateDelay();
    
    const userMissions = mockUserMissions.filter(um => um.user_id === userId);
    const completedMissions = userMissions.filter(um => um.status === 'completed');
    const activeMissions = userMissions.filter(um => um.status === 'active');
    
    const totalXpEarned = completedMissions.reduce((sum, um) => sum + um.xp_earned, 0);
    const totalLifeScoreChange = completedMissions.reduce((sum, um) => sum + um.lifescore_change, 0);
    const completionRate = userMissions.length > 0 ? (completedMissions.length / userMissions.length) * 100 : 0;
    
    return {
      total_missions: userMissions.length,
      completed_missions: completedMissions.length,
      active_missions: activeMissions.length,
      total_xp_earned: totalXpEarned,
      total_lifescore_change: totalLifeScoreChange,
      completion_rate: completionRate
    };
  }

  // Get missions by category
  async getMissionsByCategory(category: MissionCategory): Promise<Mission[]> {
    return this.getAllMissions({ category });
  }

  // Get collaborative missions
  async getCollaborativeMissions(): Promise<Mission[]> {
    return this.getAllMissions({ is_collaborative: true });
  }

  // Get solo missions
  async getSoloMissions(): Promise<Mission[]> {
    return this.getAllMissions({ is_collaborative: false });
  }

  // Search missions
  async searchMissions(query: string): Promise<Mission[]> {
    await this.simulateDelay();
    
    const searchTerm = query.toLowerCase();
    return mockMissions.filter(mission =>
      mission.title_en.toLowerCase().includes(searchTerm) ||
      mission.title_ar.includes(searchTerm) ||
      mission.description_en.toLowerCase().includes(searchTerm) ||
      mission.description_ar.includes(searchTerm)
    );
  }

  // Get mission categories
  getMissionCategories(): MissionCategory[] {
    return ['safe_driving', 'health', 'financial_guardian', 'family_protection', 'lifestyle'];
  }

  // Get difficulty levels
  getDifficultyLevels(): MissionDifficulty[] {
    return ['easy', 'medium', 'hard', 'expert'];
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const missionsService = new MissionsService();

// Export individual functions for easier use
export const getAllMissions = (filters?: any) => missionsService.getAllMissions(filters);
export const getMissionById = (missionId: string) => missionsService.getMissionById(missionId);
export const getUserMissions = (userId: string, status?: MissionStatus) => missionsService.getUserMissions(userId, status);
export const startMission = (userId: string, missionId: string) => missionsService.startMission(userId, missionId);
export const updateMissionProgress = (userMissionId: string, progress: number) => missionsService.updateMissionProgress(userMissionId, progress);
export const completeMission = (userMissionId: string) => missionsService.completeMission(userMissionId);
export const getMissionRecommendations = (userId: string, context: any) => missionsService.getMissionRecommendations(userId, context);
export const getMissionStats = (userId: string) => missionsService.getMissionStats(userId);
export const getMissionsByCategory = (category: MissionCategory) => missionsService.getMissionsByCategory(category);
export const getCollaborativeMissions = () => missionsService.getCollaborativeMissions();
export const getSoloMissions = () => missionsService.getSoloMissions();
export const searchMissions = (query: string) => missionsService.searchMissions(query);
export const getMissionCategories = () => missionsService.getMissionCategories();
export const getDifficultyLevels = () => missionsService.getDifficultyLevels();
