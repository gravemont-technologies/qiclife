// QIC Gamified Insurance App - TypeScript Types and Interfaces
// This file defines all TypeScript interfaces matching the database schema

// ============================================================================
// ENUMS
// ============================================================================

export enum MissionCategory {
  SAFE_DRIVING = 'safe_driving',
  HEALTH = 'health',
  FINANCIAL_GUARDIAN = 'financial_guardian',
  FAMILY_PROTECTION = 'family_protection',
  LIFESTYLE = 'lifestyle'
}

export enum MissionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export enum MissionStatus {
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  LOCKED = 'locked'
}

export enum RewardType {
  BADGE = 'badge',
  COIN_BOOST = 'coin_boost',
  PARTNER_OFFER = 'partner_offer',
  STREAK_BONUS = 'streak_bonus',
  ACHIEVEMENT = 'achievement'
}

export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum RelationshipType {
  FRIEND = 'friend',
  FAMILY = 'family',
  COLLEAGUE = 'colleague',
  MENTOR = 'mentor'
}

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked'
}

export enum ScenarioCategory {
  LIFESTYLE = 'lifestyle',
  TRAVEL = 'travel',
  POLICY_CHANGE = 'policy_change',
  LIFE_EVENT = 'life_event'
}

export enum AIRecommendationType {
  MISSION = 'mission',
  SKILL = 'skill',
  SCENARIO = 'scenario',
  SOCIAL = 'social',
  REWARD = 'reward'
}

export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
  FRENCH = 'fr',
  SPANISH = 'es',
  GERMAN = 'de',
  CHINESE = 'zh'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface User {
  id: string;
  email: string;
  lifescore: number;
  xp: number;
  level: number;
  streak_days: number;
  avatar_config: AvatarConfig;
  language_preference: Language;
  theme_preference: Theme;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface AvatarConfig {
  skin_tone?: string;
  hair_color?: string;
  eye_color?: string;
  accessories?: string[];
  background?: string;
}

export interface Mission {
  id: string;
  category: MissionCategory;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  difficulty: MissionDifficulty;
  xp_reward: number;
  lifescore_impact: number;
  requirements: MissionRequirements;
  is_collaborative: boolean;
  max_participants: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MissionRequirements {
  min_level?: number;
  required_skills?: string[];
  previous_missions?: string[];
  time_constraints?: {
    start_time?: string;
    end_time?: string;
    days_of_week?: number[];
  };
  location_requirements?: {
    type: 'any' | 'home' | 'gym' | 'office' | 'vehicle';
    coordinates?: [number, number];
    radius?: number;
  };
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  status: MissionStatus;
  progress: number;
  started_at?: string;
  completed_at?: string;
  xp_earned: number;
  lifescore_change: number;
  created_at: string;
  updated_at: string;
}

export interface SkillTree {
  id: string;
  category: MissionCategory;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  nodes: SkillNode[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillNode {
  id: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  xp_cost: number;
  requirements: SkillRequirements;
  children: string[];
  position: { x: number; y: number };
  unlocked: boolean;
  progress: number;
}

export interface SkillRequirements {
  min_level?: number;
  required_skills?: string[];
  missions_completed?: string[];
  xp_required?: number;
  lifescore_threshold?: number;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skill_node_id: string;
  unlocked: boolean;
  progress: number;
  unlocked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  type: RewardType;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  coins_cost: number;
  badge_icon?: string;
  badge_rarity: BadgeRarity;
  partner_offer: PartnerOffer;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerOffer {
  partner_name?: string;
  discount_percentage?: number;
  offer_code?: string;
  valid_until?: string;
  terms_conditions?: string;
  category?: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  earned_at: string;
  context: RewardContext;
  created_at: string;
}

export interface RewardContext {
  mission_id?: string;
  skill_id?: string;
  scenario_id?: string;
  achievement_type?: string;
  streak_days?: number;
}

export interface SocialConnection {
  id: string;
  user_id: string;
  friend_id: string;
  relationship_type: RelationshipType;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface Scenario {
  id: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  category: ScenarioCategory;
  input_params: ScenarioInputParams;
  ai_predictions: AIPredictions;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScenarioInputParams {
  lifestyle_factors?: {
    age?: number;
    occupation?: string;
    income_level?: string;
    family_status?: string;
    health_conditions?: string[];
  };
  travel_factors?: {
    destination?: string;
    duration_days?: number;
    activities?: string[];
    accommodation_type?: string;
  };
  policy_factors?: {
    current_coverage?: string;
    desired_coverage?: string;
    budget_range?: [number, number];
    beneficiaries?: number;
  };
}

export interface AIPredictions {
  risk_assessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  };
  lifescore_impact: {
    current: number;
    predicted: number;
    change: number;
  };
  xp_potential: {
    min: number;
    max: number;
    factors: string[];
  };
  cost_analysis?: {
    premium_change: number;
    savings_potential: number;
    roi_timeline: string;
  };
}

export interface UserScenario {
  id: string;
  user_id: string;
  scenario_id: string;
  inputs: ScenarioInputParams;
  results: AIPredictions;
  lifescore_impact: number;
  created_at: string;
}

export interface CollaborativeMission {
  id: string;
  mission_id: string;
  leader_id: string;
  participants: string[];
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  type: AIRecommendationType;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  priority: number;
  context: RecommendationContext;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface RecommendationContext {
  user_level?: number;
  current_lifescore?: number;
  recent_activities?: string[];
  preferences?: string[];
  time_sensitivity?: 'low' | 'medium' | 'high';
  social_factors?: {
    friends_participating?: number;
    family_involvement?: boolean;
  };
}

// ============================================================================
// AI INTEGRATION TYPES
// ============================================================================

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface MissionRecommendation {
  mission_id: string;
  confidence_score: number;
  reasoning: string[];
  expected_impact: {
    xp_gain: number;
    lifescore_change: number;
    time_required: string;
  };
}

export interface ScenarioPrediction {
  scenario_id: string;
  confidence_score: number;
  predictions: AIPredictions;
  alternative_scenarios?: string[];
}

export interface AvatarNudge {
  type: 'encouragement' | 'reminder' | 'celebration' | 'warning';
  message_en: string;
  message_ar: string;
  urgency: 'low' | 'medium' | 'high';
  action_required?: boolean;
  suggested_actions?: string[];
}

export interface CollaborativeDifficultyAdjustment {
  base_difficulty: MissionDifficulty;
  adjusted_difficulty: MissionDifficulty;
  adjustment_factors: {
    participant_count: number;
    skill_levels: number[];
    previous_collaborations: number;
    time_constraints: boolean;
  };
  recommended_changes: string[];
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

export interface ThemeState {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface NavigationState {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isMobile: boolean;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface LifeScoreCardProps {
  lifescore: number;
  maxLifescore?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export interface XPProgressBarProps {
  currentXP: number;
  level: number;
  showLevel?: boolean;
  animated?: boolean;
}

export interface MissionCardProps {
  mission: Mission;
  userProgress?: UserMission;
  onStart?: (missionId: string) => void;
  onComplete?: (missionId: string) => void;
  isCollaborative?: boolean;
}

export interface SkillTreeNodeProps {
  node: SkillNode;
  isUnlocked: boolean;
  progress: number;
  onUnlock?: (nodeId: string) => void;
  onHover?: (node: SkillNode) => void;
}

export interface AIAvatarProps {
  isActive: boolean;
  onToggle: () => void;
  currentNudge?: AvatarNudge;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: any;
  timestamp: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// CONSTANTS
// ============================================================================

export const XP_PER_LEVEL = 100;
export const MAX_LIFESCORE = 1000;
export const MAX_STREAK_DAYS = 365;

export const MISSION_CATEGORIES = Object.values(MissionCategory);
export const DIFFICULTY_LEVELS = Object.values(MissionDifficulty);
export const REWARD_TYPES = Object.values(RewardType);
export const BADGE_RARITIES = Object.values(BadgeRarity);
export const SUPPORTED_LANGUAGES = Object.values(Language);
export const THEMES = Object.values(Theme);

export const DEFAULT_USER: Partial<User> = {
  lifescore: 0,
  xp: 0,
  level: 1,
  streak_days: 0,
  coins: 0,
  language_preference: Language.ENGLISH,
  theme_preference: Theme.LIGHT,
  avatar_config: {}
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skin_tone: 'medium',
  hair_color: 'brown',
  eye_color: 'brown',
  accessories: [],
  background: 'default'
};
