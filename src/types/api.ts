// API Response Types matching backend structure

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// User Profile Types
export interface UserProfile {
  sessionId: string;
  name: string;
  email?: string;
  lifescore: number;
  level: number;
  totalXP: number;
  coins: number;
  createdAt: string;
  lastActive: string;
  preferences?: {
    notifications: boolean;
    language: string;
  };
}

export interface UserStats {
  missionsCompleted: number;
  missionsActive: number;
  totalRewardsRedeemed: number;
  skillsUnlocked: number;
  friendsCount: number;
  currentStreak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  coinReward: number;
  lifescoreImpact: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  isActive?: boolean;
  isCompleted?: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface MissionCompletion {
  missionId: string;
  xpEarned: number;
  coinsEarned: number;
  lifescoreIncrease: number;
  newLevel?: number;
  leveledUp: boolean;
}

// Reward Types
export interface Reward {
  id: string;
  name: string;
  description: string;
  category: string;
  coinCost: number;
  availability: string;
  terms?: string;
  imageUrl?: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardName: string;
  coinCost: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  redeemedAt: string;
  processedAt?: string;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  xpCost: number;
  benefits: string[];
  prerequisites?: string[];
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Social Types
export interface LeaderboardEntry {
  rank: number;
  sessionId: string;
  name: string;
  lifescore: number;
  level: number;
  totalXP: number;
}

export interface Friend {
  sessionId: string;
  name: string;
  lifescore: number;
  level: number;
  lastActive: string;
}

// Onboarding Types
export interface OnboardingData {
  name: string;
  email?: string;
  age?: number;
  interests?: string[];
  goals?: string[];
  preferences?: {
    notifications: boolean;
    language: string;
  };
}

// Scenario Types
export interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: ScenarioChoice[];
  category: string;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  xpReward: number;
  lifescoreImpact: number;
}

export interface ScenarioResult {
  scenarioId: string;
  choiceId: string;
  xpEarned: number;
  lifescoreChange: number;
  feedback: string;
  recommendations?: string[];
}
