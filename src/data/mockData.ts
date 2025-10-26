import { Mission, Skill, Reward, ScenarioSimulation, User, SocialConnection, Language, Theme, MissionCategory, MissionDifficulty, RewardType, BadgeRarity, LifeScoreStatus } from '../types';

// Mock User Data (stored in localStorage)
export const mockUser: User = {
  id: "mock-user-123",
  clerk_id: "local-user-abc",
  username: "QICExplorer",
  email: "user@qiclife.com",
  avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=QICExplorer",
  lifescore: 1250,
  xp: 750,
  level: 5,
  current_streak: 7,
  longest_streak: 12,
  coins: 250,
  language: Language.English,
  theme: Theme.Light,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock Missions Data
export const mockMissions: Mission[] = [
  // Safe Driving Missions
  {
    id: "mission-safe-driving-1",
    category: MissionCategory.SafeDriving,
    title_en: "7-Day Safe Driving Challenge",
    title_ar: "تحدي القيادة الآمنة لمدة 7 أيام",
    description_en: "Maintain safe driving practices for 7 consecutive days. Track your speed, braking, and acceleration patterns.",
    description_ar: "حافظ على ممارسات القيادة الآمنة لمدة 7 أيام متتالية. تتبع سرعتك وأنماط الكبح والتسارع.",
    difficulty: MissionDifficulty.Medium,
    xp_reward: 100,
    lifescore_impact: 15,
    requirements: {
      duration_days: 7,
      safe_braking_score: 85,
      speed_compliance: 90
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "mission-safe-driving-2",
    category: MissionCategory.SafeDriving,
    title_en: "Defensive Driving Master",
    title_ar: "سيد القيادة الدفاعية",
    description_en: "Complete advanced defensive driving techniques and maintain safe following distances.",
    description_ar: "أكمل تقنيات القيادة الدفاعية المتقدمة وحافظ على مسافات المتابعة الآمنة.",
    difficulty: MissionDifficulty.Hard,
    xp_reward: 200,
    lifescore_impact: 25,
    requirements: {
      defensive_maneuvers: 10,
      safe_distance_maintained: 95,
      hazard_awareness: 90
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 14,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "mission-safe-driving-3",
    category: MissionCategory.SafeDriving,
    title_en: "Family Road Trip Safety",
    title_ar: "سلامة رحلة الطريق العائلية",
    description_en: "Plan and execute a safe family road trip with proper safety checks and emergency preparedness.",
    description_ar: "خطط ونفذ رحلة طريق عائلية آمنة مع فحوصات السلامة المناسبة والاستعداد للطوارئ.",
    difficulty: MissionDifficulty.Epic,
    xp_reward: 300,
    lifescore_impact: 35,
    requirements: {
      pre_trip_inspection: true,
      emergency_kit: true,
      route_planning: true,
      family_safety_briefing: true
    },
    is_collaborative: true,
    max_participants: 4,
    duration_days: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Health Missions
  {
    id: "mission-health-1",
    category: MissionCategory.Health,
    title_en: "30-Day Fitness Challenge",
    title_ar: "تحدي اللياقة البدنية لمدة 30 يوم",
    description_en: "Complete daily fitness activities and maintain a healthy lifestyle for 30 days.",
    description_ar: "أكمل أنشطة اللياقة البدنية اليومية وحافظ على نمط حياة صحي لمدة 30 يوم.",
    difficulty: MissionDifficulty.Medium,
    xp_reward: 150,
    lifescore_impact: 20,
    requirements: {
      daily_steps: 10000,
      workout_sessions: 20,
      healthy_meals: 25
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "mission-health-2",
    category: MissionCategory.Health,
    title_en: "Mental Wellness Journey",
    title_ar: "رحلة العافية العقلية",
    description_en: "Practice mindfulness, meditation, and stress management techniques for improved mental health.",
    description_ar: "مارس اليقظة والتأمل وتقنيات إدارة الإجهاد لتحسين الصحة العقلية.",
    difficulty: MissionDifficulty.Easy,
    xp_reward: 80,
    lifescore_impact: 15,
    requirements: {
      meditation_sessions: 14,
      stress_tracking: 7,
      mindfulness_exercises: 10
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 14,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Financial Guardian Missions
  {
    id: "mission-financial-1",
    category: MissionCategory.FinancialGuardian,
    title_en: "Emergency Fund Builder",
    title_ar: "باني صندوق الطوارئ",
    description_en: "Build a 3-month emergency fund by setting aside money and tracking expenses.",
    description_ar: "ابني صندوق طوارئ لمدة 3 أشهر من خلال تخصيص المال وتتبع النفقات.",
    difficulty: MissionDifficulty.Hard,
    xp_reward: 250,
    lifescore_impact: 30,
    requirements: {
      emergency_fund_target: 3000,
      monthly_savings: 500,
      expense_tracking: 30
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 90,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "mission-financial-2",
    category: MissionCategory.FinancialGuardian,
    title_en: "Insurance Review Expert",
    title_ar: "خبير مراجعة التأمين",
    description_en: "Review and optimize your insurance coverage to ensure adequate protection.",
    description_ar: "راجع وحسن تغطية التأمين الخاصة بك لضمان الحماية الكافية.",
    difficulty: MissionDifficulty.Medium,
    xp_reward: 120,
    lifescore_impact: 18,
    requirements: {
      policy_review: true,
      coverage_analysis: true,
      premium_optimization: true
    },
    is_collaborative: false,
    max_participants: 1,
    duration_days: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Skills Data
export const mockSkills: Skill[] = [
  {
    id: "skill-safe-driving-1",
    category: MissionCategory.SafeDriving,
    title_en: "Defensive Driving",
    title_ar: "القيادة الدفاعية",
    description_en: "Master defensive driving techniques to anticipate and avoid potential hazards.",
    description_ar: "أتقن تقنيات القيادة الدفاعية للتنبؤ بتجنب المخاطر المحتملة.",
    nodes: [
      {
        id: "defensive-driving-basic",
        title: "Basic Defensive Driving",
        unlocked: true,
        progress: 100,
        children: ["hazard-recognition", "safe-following"]
      },
      {
        id: "hazard-recognition",
        title: "Hazard Recognition",
        unlocked: true,
        progress: 75,
        children: ["weather-adaptation"]
      },
      {
        id: "safe-following",
        title: "Safe Following Distance",
        unlocked: true,
        progress: 60,
        children: ["speed-control"]
      },
      {
        id: "weather-adaptation",
        title: "Weather Adaptation",
        unlocked: false,
        progress: 0,
        children: []
      },
      {
        id: "speed-control",
        title: "Speed Control",
        unlocked: false,
        progress: 0,
        children: []
      }
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "skill-health-1",
    category: MissionCategory.Health,
    title_en: "Physical Wellness",
    title_ar: "العافية البدنية",
    description_en: "Develop healthy habits for physical fitness and overall wellness.",
    description_ar: "طور عادات صحية لللياقة البدنية والعافية العامة.",
    nodes: [
      {
        id: "fitness-basics",
        title: "Fitness Basics",
        unlocked: true,
        progress: 100,
        children: ["cardio-training", "strength-training"]
      },
      {
        id: "cardio-training",
        title: "Cardio Training",
        unlocked: true,
        progress: 80,
        children: ["endurance-building"]
      },
      {
        id: "strength-training",
        title: "Strength Training",
        unlocked: true,
        progress: 60,
        children: ["muscle-building"]
      },
      {
        id: "endurance-building",
        title: "Endurance Building",
        unlocked: false,
        progress: 0,
        children: []
      },
      {
        id: "muscle-building",
        title: "Muscle Building",
        unlocked: false,
        progress: 0,
        children: []
      }
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Rewards Data
export const mockRewards: Reward[] = [
  {
    id: "reward-badge-1",
    type: RewardType.Badge,
    title_en: "Safe Driver",
    title_ar: "سائق آمن",
    description_en: "Earned for completing 7 days of safe driving",
    description_ar: "تم الحصول عليه لإكمال 7 أيام من القيادة الآمنة",
    coins_cost: 0,
    badge_icon: "shield",
    badge_rarity: BadgeRarity.Rare,
    partner_offer: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "reward-badge-2",
    type: RewardType.Badge,
    title_en: "Health Champion",
    title_ar: "بطل الصحة",
    description_en: "Achieved for maintaining 30 days of healthy habits",
    description_ar: "تم تحقيقه للحفاظ على 30 يوم من العادات الصحية",
    coins_cost: 0,
    badge_icon: "heart",
    badge_rarity: BadgeRarity.Epic,
    partner_offer: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "reward-coin-boost-1",
    type: RewardType.CoinBoost,
    title_en: "Daily Streak Bonus",
    title_ar: "مكافأة السلسلة اليومية",
    description_en: "Earn 50 bonus coins for maintaining a 7-day streak",
    description_ar: "احصل على 50 عملة إضافية للحفاظ على سلسلة 7 أيام",
    coins_cost: 0,
    badge_icon: "coins",
    badge_rarity: BadgeRarity.Common,
    partner_offer: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "reward-partner-1",
    type: RewardType.PartnerOffer,
    title_en: "QIC Premium Discount",
    title_ar: "خصم QIC المميز",
    description_en: "Get 15% off your next QIC premium payment",
    description_ar: "احصل على خصم 15% من دفعة QIC المميزة التالية",
    coins_cost: 100,
    badge_icon: "discount",
    badge_rarity: BadgeRarity.Epic,
    partner_offer: {
      discount_percentage: 15,
      valid_until: "2024-12-31",
      terms: "Valid for new premium payments only"
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Scenarios Data
export const mockScenarios: ScenarioSimulation[] = [
  {
    id: "scenario-1",
    user_id: "mock-user-123",
    input_data: {
      scenario_type: "lifestyle_change",
      current_risk_level: "medium",
      proposed_changes: {
        exercise_frequency: "daily",
        diet_improvement: true,
        stress_management: true
      }
    },
    predicted_outcome: "Significant improvement in LifeScore (+50 points) and reduced health risks",
    predicted_risk_level: "low",
    predicted_lifescore_impact: 50,
    predicted_xp_gain: 100,
    recommended_skill_ids: ["skill-health-1"],
    created_at: new Date().toISOString()
  },
  {
    id: "scenario-2",
    user_id: "mock-user-123",
    input_data: {
      scenario_type: "travel_planning",
      destination: "Europe",
      duration: "2 weeks",
      activities: ["city_tours", "hiking", "cultural_sites"]
    },
    predicted_outcome: "Moderate risk increase due to travel activities, but manageable with proper preparation",
    predicted_risk_level: "medium",
    predicted_lifescore_impact: -10,
    predicted_xp_gain: 75,
    recommended_skill_ids: ["skill-safe-driving-1"],
    created_at: new Date().toISOString()
  }
];

// Mock Social Connections
export const mockSocialConnections: SocialConnection[] = [
  {
    id: "connection-1",
    user_id: "mock-user-123",
    friend_id: "friend-1",
    relationship_type: "family",
    status: "accepted",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "connection-2",
    user_id: "mock-user-123",
    friend_id: "friend-2",
    relationship_type: "friend",
    status: "accepted",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Friends Data
export const mockFriends = [
  {
    id: "friend-1",
    name: "Ahmed Al-Rashid",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmed",
    relationship_type: "family",
    lifescore: 1100,
    level: 4,
    current_streak: 5,
    is_active: true
  },
  {
    id: "friend-2",
    name: "Sarah Johnson",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
    relationship_type: "friend",
    lifescore: 1350,
    level: 6,
    current_streak: 12,
    is_active: true
  },
  {
    id: "friend-3",
    name: "Mohammed Hassan",
    avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohammed",
    relationship_type: "colleague",
    lifescore: 950,
    level: 3,
    current_streak: 2,
    is_active: true
  }
];

// Mock AI Recommendations
export const mockAIRecommendations = [
  {
    id: "ai-rec-1",
    user_id: "mock-user-123",
    type: "mission",
    title_en: "Complete Health Check",
    title_ar: "إكمال الفحص الصحي",
    description_en: "Based on your current LifeScore, consider completing a health check mission to boost your score.",
    description_ar: "بناءً على نقاط الحياة الحالية، فكر في إكمال مهمة فحص صحي لتعزيز نقاطك.",
    priority: 1,
    context: {
      lifescore_impact: 20,
      xp_reward: 50,
      estimated_duration: "1 day"
    },
    is_active: true,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: "ai-rec-2",
    user_id: "mock-user-123",
    type: "skill",
    title_en: "Unlock Weather Adaptation",
    title_ar: "فتح تكيف الطقس",
    description_en: "You're close to unlocking the Weather Adaptation skill. Complete 2 more defensive driving missions.",
    description_ar: "أنت قريب من فتح مهارة تكيف الطقس. أكمل مهمتين إضافيتين للقيادة الدفاعية.",
    priority: 2,
    context: {
      skill_id: "skill-safe-driving-1",
      progress_needed: 2,
      missions_required: ["mission-safe-driving-1", "mission-safe-driving-2"]
    },
    is_active: true,
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  }
];

// Export all mock data
export const mockData = {
  user: mockUser,
  missions: mockMissions,
  skills: mockSkills,
  rewards: mockRewards,
  scenarios: mockScenarios,
  socialConnections: mockSocialConnections,
  friends: mockFriends,
  aiRecommendations: mockAIRecommendations
};

export default mockData;
