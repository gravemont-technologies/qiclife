// QIC Gamified Insurance App - Rewards Service
// Handles all rewards, badges, and achievements operations with mock data

import type {
  Reward,
  UserReward,
  RewardType,
  BadgeRarity,
  RewardContext
} from '@/types';

// Mock rewards data
const mockRewards: Reward[] = [
  {
    id: 'reward_001',
    type: 'badge',
    title_en: 'Safe Driver',
    title_ar: 'سائق آمن',
    description_en: 'Earned for completing 7 days of safe driving',
    description_ar: 'مكتسب لإكمال 7 أيام من القيادة الآمنة',
    coins_cost: 0,
    badge_icon: 'shield',
    badge_rarity: 'rare',
    partner_offer: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reward_002',
    type: 'badge',
    title_en: 'Health Champion',
    title_ar: 'بطل الصحة',
    description_en: 'Earned for maintaining 30 days of health tracking',
    description_ar: 'مكتسب للحفاظ على 30 يوماً من تتبع الصحة',
    coins_cost: 0,
    badge_icon: 'heart',
    badge_rarity: 'epic',
    partner_offer: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reward_003',
    type: 'coin_boost',
    title_en: 'XP Multiplier',
    title_ar: 'مضاعف نقاط الخبرة',
    description_en: 'Double XP for the next 7 days',
    description_ar: 'مضاعفة نقاط الخبرة للـ 7 أيام القادمة',
    coins_cost: 100,
    badge_icon: 'zap',
    badge_rarity: 'common',
    partner_offer: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reward_004',
    type: 'partner_offer',
    title_en: 'Fitness Center Discount',
    title_ar: 'خصم مركز اللياقة البدنية',
    description_en: '20% discount at partner fitness centers',
    description_ar: 'خصم 20% في مراكز اللياقة البدنية الشريكة',
    coins_cost: 50,
    badge_icon: 'gift',
    badge_rarity: 'rare',
    partner_offer: {
      partner_name: 'FitLife Centers',
      discount_percentage: 20,
      offer_code: 'QICFIT20',
      valid_until: '2024-12-31T23:59:59Z',
      terms_conditions: 'Valid for new members only',
      category: 'fitness'
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reward_005',
    type: 'streak_bonus',
    title_en: 'Streak Master',
    title_ar: 'سيد السلسلة',
    description_en: 'Bonus coins for maintaining a 30-day streak',
    description_ar: 'عملات إضافية للحفاظ على سلسلة 30 يوماً',
    coins_cost: 0,
    badge_icon: 'flame',
    badge_rarity: 'legendary',
    partner_offer: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reward_006',
    type: 'achievement',
    title_en: 'Level 10 Master',
    title_ar: 'سيد المستوى 10',
    description_en: 'Reached level 10 in the gamification system',
    description_ar: 'وصل إلى المستوى 10 في نظام اللعب',
    coins_cost: 0,
    badge_icon: 'star',
    badge_rarity: 'epic',
    partner_offer: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock user rewards data
const mockUserRewards: UserReward[] = [
  {
    id: 'user_reward_001',
    user_id: 'user_001',
    reward_id: 'reward_001',
    earned_at: '2024-01-15T00:00:00Z',
    context: {
      mission_id: 'mission_001',
      achievement_type: 'mission_completion'
    },
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_reward_002',
    user_id: 'user_001',
    reward_id: 'reward_002',
    earned_at: '2024-01-20T00:00:00Z',
    context: {
      skill_id: 'skill_tree_002',
      achievement_type: 'skill_mastery'
    },
    created_at: '2024-01-20T00:00:00Z'
  }
];

// Rewards Service Class
export class RewardsService {
  // Get all available rewards
  async getAllRewards(filters?: {
    type?: RewardType;
    rarity?: BadgeRarity;
    is_active?: boolean;
  }): Promise<Reward[]> {
    await this.simulateDelay();
    
    let filteredRewards = [...mockRewards];
    
    if (filters?.type) {
      filteredRewards = filteredRewards.filter(reward => reward.type === filters.type);
    }
    
    if (filters?.rarity) {
      filteredRewards = filteredRewards.filter(reward => reward.badge_rarity === filters.rarity);
    }
    
    if (filters?.is_active !== undefined) {
      filteredRewards = filteredRewards.filter(reward => reward.is_active === filters.is_active);
    }
    
    return filteredRewards;
  }

  // Get reward by ID
  async getRewardById(rewardId: string): Promise<Reward | null> {
    await this.simulateDelay();
    return mockRewards.find(reward => reward.id === rewardId) || null;
  }

  // Get user's earned rewards
  async getUserRewards(userId: string): Promise<UserReward[]> {
    await this.simulateDelay();
    return mockUserRewards.filter(userReward => userReward.user_id === userId);
  }

  // Get user's badge collection
  async getUserBadges(userId: string): Promise<Reward[]> {
    await this.simulateDelay();
    
    const userRewards = await this.getUserRewards(userId);
    const badgeRewardIds = userRewards
      .filter(userReward => {
        const reward = mockRewards.find(r => r.id === userReward.reward_id);
        return reward?.type === 'badge';
      })
      .map(userReward => userReward.reward_id);
    
    return mockRewards.filter(reward => badgeRewardIds.includes(reward.id));
  }

  // Earn a reward
  async earnReward(
    userId: string,
    rewardId: string,
    context: RewardContext
  ): Promise<UserReward> {
    await this.simulateDelay();
    
    const reward = await this.getRewardById(rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }
    
    // Check if user already has this reward
    const existingUserReward = mockUserRewards.find(
      ur => ur.user_id === userId && ur.reward_id === rewardId
    );
    
    if (existingUserReward) {
      throw new Error('Reward already earned');
    }
    
    const userReward: UserReward = {
      id: `user_reward_${Date.now()}`,
      user_id: userId,
      reward_id: rewardId,
      earned_at: new Date().toISOString(),
      context,
      created_at: new Date().toISOString()
    };
    
    mockUserRewards.push(userReward);
    return userReward;
  }

  // Purchase a reward with coins
  async purchaseReward(
    userId: string,
    rewardId: string,
    userCoins: number
  ): Promise<UserReward> {
    await this.simulateDelay();
    
    const reward = await this.getRewardById(rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }
    
    if (reward.coins_cost > userCoins) {
      throw new Error('Insufficient coins');
    }
    
    if (reward.coins_cost === 0) {
      throw new Error('Reward cannot be purchased with coins');
    }
    
    // Check if user already has this reward
    const existingUserReward = mockUserRewards.find(
      ur => ur.user_id === userId && ur.reward_id === rewardId
    );
    
    if (existingUserReward) {
      throw new Error('Reward already owned');
    }
    
    const userReward: UserReward = {
      id: `user_reward_${Date.now()}`,
      user_id: userId,
      reward_id: rewardId,
      earned_at: new Date().toISOString(),
      context: {
        achievement_type: 'purchase'
      },
      created_at: new Date().toISOString()
    };
    
    mockUserRewards.push(userReward);
    return userReward;
  }

  // Get partner offers
  async getPartnerOffers(): Promise<Reward[]> {
    await this.simulateDelay();
    return mockRewards.filter(reward => reward.type === 'partner_offer' && reward.is_active);
  }

  // Get rewards by type
  async getRewardsByType(type: RewardType): Promise<Reward[]> {
    return this.getAllRewards({ type });
  }

  // Get rewards by rarity
  async getRewardsByRarity(rarity: BadgeRarity): Promise<Reward[]> {
    return this.getAllRewards({ rarity });
  }

  // Get user's reward statistics
  async getRewardStats(userId: string): Promise<{
    total_rewards: number;
    badges_earned: number;
    coins_spent: number;
    partner_offers_used: number;
    rarity_distribution: Record<BadgeRarity, number>;
    recent_rewards: UserReward[];
  }> {
    await this.simulateDelay();
    
    const userRewards = await this.getUserRewards(userId);
    const badges = await this.getUserBadges(userId);
    
    const coinsSpent = userRewards.reduce((total, userReward) => {
      const reward = mockRewards.find(r => r.id === userReward.reward_id);
      return total + (reward?.coins_cost || 0);
    }, 0);
    
    const partnerOffersUsed = userRewards.filter(userReward => {
      const reward = mockRewards.find(r => r.id === userReward.reward_id);
      return reward?.type === 'partner_offer';
    }).length;
    
    const rarityDistribution: Record<BadgeRarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };
    
    badges.forEach(badge => {
      rarityDistribution[badge.badge_rarity]++;
    });
    
    const recentRewards = userRewards
      .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
      .slice(0, 5);
    
    return {
      total_rewards: userRewards.length,
      badges_earned: badges.length,
      coins_spent: coinsSpent,
      partner_offers_used: partnerOffersUsed,
      rarity_distribution: rarityDistribution,
      recent_rewards: recentRewards
    };
  }

  // Check if user can earn a reward
  async canEarnReward(userId: string, rewardId: string): Promise<{
    canEarn: boolean;
    reason?: string;
    requirements?: string[];
  }> {
    await this.simulateDelay();
    
    const reward = await this.getRewardById(rewardId);
    if (!reward) {
      return { canEarn: false, reason: 'Reward not found' };
    }
    
    // Check if already earned
    const existingUserReward = mockUserRewards.find(
      ur => ur.user_id === userId && ur.reward_id === rewardId
    );
    
    if (existingUserReward) {
      return { canEarn: false, reason: 'Reward already earned' };
    }
    
    // Check if reward is active
    if (!reward.is_active) {
      return { canEarn: false, reason: 'Reward is not available' };
    }
    
    // Mock requirements check
    const requirements: string[] = [];
    
    if (reward.type === 'badge') {
      if (reward.id === 'reward_001') {
        requirements.push('Complete Safe Driver Challenge mission');
      } else if (reward.id === 'reward_002') {
        requirements.push('Maintain 30-day health tracking streak');
      }
    }
    
    return {
      canEarn: true,
      requirements
    };
  }

  // Get reward types
  getRewardTypes(): RewardType[] {
    return ['badge', 'coin_boost', 'partner_offer', 'streak_bonus', 'achievement'];
  }

  // Get badge rarities
  getBadgeRarities(): BadgeRarity[] {
    return ['common', 'rare', 'epic', 'legendary'];
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const rewardsService = new RewardsService();

// Export individual functions for easier use
export const getAllRewards = (filters?: any) => rewardsService.getAllRewards(filters);
export const getRewardById = (rewardId: string) => rewardsService.getRewardById(rewardId);
export const getUserRewards = (userId: string) => rewardsService.getUserRewards(userId);
export const getUserBadges = (userId: string) => rewardsService.getUserBadges(userId);
export const earnReward = (userId: string, rewardId: string, context: RewardContext) => rewardsService.earnReward(userId, rewardId, context);
export const purchaseReward = (userId: string, rewardId: string, userCoins: number) => rewardsService.purchaseReward(userId, rewardId, userCoins);
export const getPartnerOffers = () => rewardsService.getPartnerOffers();
export const getRewardsByType = (type: RewardType) => rewardsService.getRewardsByType(type);
export const getRewardsByRarity = (rarity: BadgeRarity) => rewardsService.getRewardsByRarity(rarity);
export const getRewardStats = (userId: string) => rewardsService.getRewardStats(userId);
export const canEarnReward = (userId: string, rewardId: string) => rewardsService.canEarnReward(userId, rewardId);
export const getRewardTypes = () => rewardsService.getRewardTypes();
export const getBadgeRarities = () => rewardsService.getBadgeRarities();
