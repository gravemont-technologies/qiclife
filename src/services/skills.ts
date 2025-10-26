// QIC Gamified Insurance App - Skills Service
// Handles all skill tree and skill-related operations with mock data

import type {
  SkillTree,
  UserSkill,
  SkillNode,
  MissionCategory,
  SkillRequirements
} from '@/types';

// Mock skill trees data
const mockSkillTrees: SkillTree[] = [
  {
    id: 'skill_tree_001',
    category: 'safe_driving',
    title_en: 'Safe Driving Mastery',
    title_ar: 'إتقان القيادة الآمنة',
    description_en: 'Master the art of safe driving through progressive skill development.',
    description_ar: 'أتقن فن القيادة الآمنة من خلال التطوير التدريجي للمهارات.',
    nodes: [
      {
        id: 'defensive_driving',
        title_en: 'Defensive Driving',
        title_ar: 'القيادة الدفاعية',
        description_en: 'Learn to anticipate and avoid potential hazards on the road.',
        description_ar: 'تعلم توقع وتجنب المخاطر المحتملة على الطريق.',
        icon: 'shield',
        xp_cost: 50,
        requirements: {
          min_level: 2
        },
        children: ['speed_control', 'distance_keeping'],
        position: { x: 100, y: 100 },
        unlocked: true,
        progress: 0
      },
      {
        id: 'speed_control',
        title_en: 'Speed Control',
        title_ar: 'التحكم في السرعة',
        description_en: 'Master maintaining appropriate speeds for different road conditions.',
        description_ar: 'أتقن الحفاظ على السرعات المناسبة لحالات الطريق المختلفة.',
        icon: 'speedometer',
        xp_cost: 30,
        requirements: {
          min_level: 1,
          required_skills: ['defensive_driving']
        },
        children: ['weather_adaptation'],
        position: { x: 50, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'distance_keeping',
        title_en: 'Safe Distance',
        title_ar: 'المسافة الآمنة',
        description_en: 'Learn to maintain safe following distances in all conditions.',
        description_ar: 'تعلم الحفاظ على مسافات متابعة آمنة في جميع الظروف.',
        icon: 'ruler',
        xp_cost: 30,
        requirements: {
          min_level: 1,
          required_skills: ['defensive_driving']
        },
        children: ['emergency_braking'],
        position: { x: 150, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'weather_adaptation',
        title_en: 'Weather Adaptation',
        title_ar: 'التكيف مع الطقس',
        description_en: 'Adapt driving techniques for various weather conditions.',
        description_ar: 'تكيف تقنيات القيادة مع ظروف الطقس المختلفة.',
        icon: 'cloud-rain',
        xp_cost: 40,
        requirements: {
          min_level: 3,
          required_skills: ['speed_control']
        },
        children: [],
        position: { x: 25, y: 300 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'emergency_braking',
        title_en: 'Emergency Braking',
        title_ar: 'الفرملة الطارئة',
        description_en: 'Master emergency braking techniques and collision avoidance.',
        description_ar: 'أتقن تقنيات الفرملة الطارئة وتجنب التصادم.',
        icon: 'zap',
        xp_cost: 40,
        requirements: {
          min_level: 3,
          required_skills: ['distance_keeping']
        },
        children: [],
        position: { x: 175, y: 300 },
        unlocked: false,
        progress: 0
      }
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'skill_tree_002',
    category: 'health',
    title_en: 'Health & Wellness',
    title_ar: 'الصحة والعافية',
    description_en: 'Develop comprehensive health and wellness skills for better life protection.',
    description_ar: 'طور مهارات شاملة للصحة والعافية لحماية أفضل للحياة.',
    nodes: [
      {
        id: 'fitness_tracking',
        title_en: 'Fitness Tracking',
        title_ar: 'تتبع اللياقة البدنية',
        description_en: 'Learn to monitor and track your physical fitness metrics.',
        description_ar: 'تعلم مراقبة وتتبع مقاييس لياقتك البدنية.',
        icon: 'activity',
        xp_cost: 25,
        requirements: {
          min_level: 1
        },
        children: ['nutrition_planning', 'sleep_optimization'],
        position: { x: 100, y: 100 },
        unlocked: true,
        progress: 0
      },
      {
        id: 'nutrition_planning',
        title_en: 'Nutrition Planning',
        title_ar: 'تخطيط التغذية',
        description_en: 'Plan and maintain a balanced nutritional diet.',
        description_ar: 'خطط وحافظ على نظام غذائي متوازن.',
        icon: 'apple',
        xp_cost: 35,
        requirements: {
          min_level: 2,
          required_skills: ['fitness_tracking']
        },
        children: ['meal_preparation'],
        position: { x: 50, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'sleep_optimization',
        title_en: 'Sleep Optimization',
        title_ar: 'تحسين النوم',
        description_en: 'Optimize your sleep patterns for better health and recovery.',
        description_ar: 'حسن أنماط نومك لصحة أفضل وتعافي.',
        icon: 'moon',
        xp_cost: 35,
        requirements: {
          min_level: 2,
          required_skills: ['fitness_tracking']
        },
        children: ['stress_management'],
        position: { x: 150, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'meal_preparation',
        title_en: 'Meal Preparation',
        title_ar: 'تحضير الوجبات',
        description_en: 'Master meal planning and preparation techniques.',
        description_ar: 'أتقن تقنيات تخطيط وتحضير الوجبات.',
        icon: 'chef-hat',
        xp_cost: 45,
        requirements: {
          min_level: 3,
          required_skills: ['nutrition_planning']
        },
        children: [],
        position: { x: 25, y: 300 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'stress_management',
        title_en: 'Stress Management',
        title_ar: 'إدارة الإجهاد',
        description_en: 'Develop effective stress management and relaxation techniques.',
        description_ar: 'طور تقنيات فعالة لإدارة الإجهاد والاسترخاء.',
        icon: 'heart',
        xp_cost: 45,
        requirements: {
          min_level: 3,
          required_skills: ['sleep_optimization']
        },
        children: [],
        position: { x: 175, y: 300 },
        unlocked: false,
        progress: 0
      }
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'skill_tree_003',
    category: 'financial_guardian',
    title_en: 'Financial Protection',
    title_ar: 'الحماية المالية',
    description_en: 'Build comprehensive financial protection and planning skills.',
    description_ar: 'ابني مهارات شاملة للحماية والتخطيط المالي.',
    nodes: [
      {
        id: 'budget_planning',
        title_en: 'Budget Planning',
        title_ar: 'تخطيط الميزانية',
        description_en: 'Learn to create and maintain effective budgets.',
        description_ar: 'تعلم إنشاء والحفاظ على ميزانيات فعالة.',
        icon: 'calculator',
        xp_cost: 40,
        requirements: {
          min_level: 2
        },
        children: ['expense_tracking', 'savings_strategy'],
        position: { x: 100, y: 100 },
        unlocked: true,
        progress: 0
      },
      {
        id: 'expense_tracking',
        title_en: 'Expense Tracking',
        title_ar: 'تتبع المصروفات',
        description_en: 'Master tracking and categorizing your expenses.',
        description_ar: 'أتقن تتبع وتصنيف مصروفاتك.',
        icon: 'receipt',
        xp_cost: 30,
        requirements: {
          min_level: 1,
          required_skills: ['budget_planning']
        },
        children: ['financial_analysis'],
        position: { x: 50, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'savings_strategy',
        title_en: 'Savings Strategy',
        title_ar: 'استراتيجية الادخار',
        description_en: 'Develop effective savings strategies and goals.',
        description_ar: 'طور استراتيجيات وأهداف ادخار فعالة.',
        icon: 'piggy-bank',
        xp_cost: 35,
        requirements: {
          min_level: 2,
          required_skills: ['budget_planning']
        },
        children: ['investment_basics'],
        position: { x: 150, y: 200 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'financial_analysis',
        title_en: 'Financial Analysis',
        title_ar: 'التحليل المالي',
        description_en: 'Learn to analyze your financial health and make informed decisions.',
        description_ar: 'تعلم تحليل صحتك المالية واتخاذ قرارات مدروسة.',
        icon: 'trending-up',
        xp_cost: 50,
        requirements: {
          min_level: 4,
          required_skills: ['expense_tracking']
        },
        children: [],
        position: { x: 25, y: 300 },
        unlocked: false,
        progress: 0
      },
      {
        id: 'investment_basics',
        title_en: 'Investment Basics',
        title_ar: 'أساسيات الاستثمار',
        description_en: 'Learn the fundamentals of investment and wealth building.',
        description_ar: 'تعلم أساسيات الاستثمار وبناء الثروة.',
        icon: 'chart-line',
        xp_cost: 60,
        requirements: {
          min_level: 5,
          required_skills: ['savings_strategy']
        },
        children: [],
        position: { x: 175, y: 300 },
        unlocked: false,
        progress: 0
      }
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock user skills data
const mockUserSkills: UserSkill[] = [
  {
    id: 'user_skill_001',
    user_id: 'user_001',
    skill_id: 'skill_tree_001',
    skill_node_id: 'defensive_driving',
    unlocked: true,
    progress: 75,
    unlocked_at: '2024-01-10T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_skill_002',
    user_id: 'user_001',
    skill_id: 'skill_tree_002',
    skill_node_id: 'fitness_tracking',
    unlocked: true,
    progress: 100,
    unlocked_at: '2024-01-05T00:00:00Z',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
];

// Skills Service Class
export class SkillsService {
  // Get all skill trees
  async getAllSkillTrees(): Promise<SkillTree[]> {
    await this.simulateDelay();
    return mockSkillTrees.filter(tree => tree.is_active);
  }

  // Get skill tree by ID
  async getSkillTreeById(skillTreeId: string): Promise<SkillTree | null> {
    await this.simulateDelay();
    return mockSkillTrees.find(tree => tree.id === skillTreeId) || null;
  }

  // Get skill trees by category
  async getSkillTreesByCategory(category: MissionCategory): Promise<SkillTree[]> {
    await this.simulateDelay();
    return mockSkillTrees.filter(tree => tree.category === category && tree.is_active);
  }

  // Get user's skills
  async getUserSkills(userId: string): Promise<UserSkill[]> {
    await this.simulateDelay();
    return mockUserSkills.filter(skill => skill.user_id === userId);
  }

  // Get user's skill progress for a specific skill tree
  async getUserSkillProgress(userId: string, skillTreeId: string): Promise<{
    skillTree: SkillTree;
    userSkills: UserSkill[];
    progress: number;
    unlockedNodes: string[];
    lockedNodes: string[];
  }> {
    await this.simulateDelay();
    
    const skillTree = await this.getSkillTreeById(skillTreeId);
    if (!skillTree) {
      throw new Error('Skill tree not found');
    }
    
    const userSkills = mockUserSkills.filter(
      skill => skill.user_id === userId && skill.skill_id === skillTreeId
    );
    
    const unlockedNodes = userSkills
      .filter(skill => skill.unlocked)
      .map(skill => skill.skill_node_id);
    
    const lockedNodes = skillTree.nodes
      .filter(node => !unlockedNodes.includes(node.id))
      .map(node => node.id);
    
    const totalProgress = userSkills.reduce((sum, skill) => sum + skill.progress, 0);
    const maxProgress = skillTree.nodes.length * 100;
    const progress = maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0;
    
    return {
      skillTree,
      userSkills,
      progress,
      unlockedNodes,
      lockedNodes
    };
  }

  // Unlock a skill node
  async unlockSkillNode(
    userId: string,
    skillTreeId: string,
    nodeId: string
  ): Promise<UserSkill> {
    await this.simulateDelay();
    
    const skillTree = await this.getSkillTreeById(skillTreeId);
    if (!skillTree) {
      throw new Error('Skill tree not found');
    }
    
    const node = skillTree.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error('Skill node not found');
    }
    
    // Check if already unlocked
    const existingSkill = mockUserSkills.find(
      skill => skill.user_id === userId && 
               skill.skill_id === skillTreeId && 
               skill.skill_node_id === nodeId
    );
    
    if (existingSkill && existingSkill.unlocked) {
      throw new Error('Skill node already unlocked');
    }
    
    // Check requirements
    const canUnlock = await this.checkSkillRequirements(userId, skillTreeId, node.requirements);
    if (!canUnlock) {
      throw new Error('Skill requirements not met');
    }
    
    const userSkill: UserSkill = {
      id: `user_skill_${Date.now()}`,
      user_id: userId,
      skill_id: skillTreeId,
      skill_node_id: nodeId,
      unlocked: true,
      progress: 0,
      unlocked_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockUserSkills.push(userSkill);
    return userSkill;
  }

  // Update skill progress
  async updateSkillProgress(
    userSkillId: string,
    progress: number
  ): Promise<UserSkill> {
    await this.simulateDelay();
    
    const userSkill = mockUserSkills.find(skill => skill.id === userSkillId);
    if (!userSkill) {
      throw new Error('User skill not found');
    }
    
    userSkill.progress = Math.min(Math.max(progress, 0), 100);
    userSkill.updated_at = new Date().toISOString();
    
    return userSkill;
  }

  // Check if user can unlock a skill node
  async checkSkillRequirements(
    userId: string,
    skillTreeId: string,
    requirements: SkillRequirements
  ): Promise<boolean> {
    await this.simulateDelay();
    
    // Check minimum level requirement
    if (requirements.min_level) {
      // This would typically check user's current level
      // For mock purposes, assume user level is 3
      const userLevel = 3;
      if (userLevel < requirements.min_level) {
        return false;
      }
    }
    
    // Check required skills
    if (requirements.required_skills && requirements.required_skills.length > 0) {
      const userSkills = mockUserSkills.filter(
        skill => skill.user_id === userId && skill.skill_id === skillTreeId
      );
      
      const unlockedSkills = userSkills
        .filter(skill => skill.unlocked)
        .map(skill => skill.skill_node_id);
      
      const hasAllRequiredSkills = requirements.required_skills.every(
        requiredSkill => unlockedSkills.includes(requiredSkill)
      );
      
      if (!hasAllRequiredSkills) {
        return false;
      }
    }
    
    // Check missions completed requirement
    if (requirements.missions_completed && requirements.missions_completed.length > 0) {
      // This would typically check completed missions
      // For mock purposes, assume all missions are completed
      return true;
    }
    
    // Check XP requirement
    if (requirements.xp_required) {
      // This would typically check user's current XP
      // For mock purposes, assume user has enough XP
      return true;
    }
    
    // Check LifeScore threshold
    if (requirements.lifescore_threshold) {
      // This would typically check user's current LifeScore
      // For mock purposes, assume user meets threshold
      return true;
    }
    
    return true;
  }

  // Get skill tree categories
  getSkillTreeCategories(): MissionCategory[] {
    return ['safe_driving', 'health', 'financial_guardian', 'family_protection', 'lifestyle'];
  }

  // Get skill statistics for user
  async getSkillStats(userId: string): Promise<{
    total_skills: number;
    unlocked_skills: number;
    in_progress_skills: number;
    completed_skills: number;
    total_progress: number;
    category_progress: Record<string, number>;
  }> {
    await this.simulateDelay();
    
    const userSkills = mockUserSkills.filter(skill => skill.user_id === userId);
    const unlockedSkills = userSkills.filter(skill => skill.unlocked);
    const inProgressSkills = unlockedSkills.filter(skill => skill.progress > 0 && skill.progress < 100);
    const completedSkills = unlockedSkills.filter(skill => skill.progress === 100);
    
    const totalProgress = unlockedSkills.reduce((sum, skill) => sum + skill.progress, 0);
    const maxProgress = unlockedSkills.length * 100;
    const overallProgress = maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0;
    
    // Calculate category progress
    const categoryProgress: Record<string, number> = {};
    for (const skillTree of mockSkillTrees) {
      const treeSkills = userSkills.filter(skill => skill.skill_id === skillTree.id);
      const treeUnlockedSkills = treeSkills.filter(skill => skill.unlocked);
      const treeProgress = treeUnlockedSkills.reduce((sum, skill) => sum + skill.progress, 0);
      const treeMaxProgress = treeUnlockedSkills.length * 100;
      categoryProgress[skillTree.category] = treeMaxProgress > 0 ? (treeProgress / treeMaxProgress) * 100 : 0;
    }
    
    return {
      total_skills: userSkills.length,
      unlocked_skills: unlockedSkills.length,
      in_progress_skills: inProgressSkills.length,
      completed_skills: completedSkills.length,
      total_progress: overallProgress,
      category_progress: categoryProgress
    };
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const skillsService = new SkillsService();

// Export individual functions for easier use
export const getAllSkillTrees = () => skillsService.getAllSkillTrees();
export const getSkillTreeById = (skillTreeId: string) => skillsService.getSkillTreeById(skillTreeId);
export const getSkillTreesByCategory = (category: MissionCategory) => skillsService.getSkillTreesByCategory(category);
export const getUserSkills = (userId: string) => skillsService.getUserSkills(userId);
export const getUserSkillProgress = (userId: string, skillTreeId: string) => skillsService.getUserSkillProgress(userId, skillTreeId);
export const unlockSkillNode = (userId: string, skillTreeId: string, nodeId: string) => skillsService.unlockSkillNode(userId, skillTreeId, nodeId);
export const updateSkillProgress = (userSkillId: string, progress: number) => skillsService.updateSkillProgress(userSkillId, progress);
export const checkSkillRequirements = (userId: string, skillTreeId: string, requirements: SkillRequirements) => skillsService.checkSkillRequirements(userId, skillTreeId, requirements);
export const getSkillTreeCategories = () => skillsService.getSkillTreeCategories();
export const getSkillStats = (userId: string) => skillsService.getSkillStats(userId);
