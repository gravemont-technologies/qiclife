// QIC Gamified Insurance App - Mock AI Service
// This file provides mock AI functionality with placeholder functions
// Ready for integration with Lovable.dev or other AI services

import type {
  User,
  Mission,
  MissionRecommendation,
  ScenarioPrediction,
  AvatarNudge,
  CollaborativeDifficultyAdjustment,
  AIResponse,
  ScenarioInputParams,
  AIPredictions
} from '@/types';

// Mock AI Service Class
export class MockAIService {
  private baseDelay = 1000; // Base delay for mock responses

  // Generate mission recommendations based on user profile
  async generateMissionRecommendations(
    userId: string,
    context: {
      currentLevel: number;
      lifescore: number;
      recentMissions: string[];
      preferences: string[];
    }
  ): Promise<AIResponse<MissionRecommendation[]>> {
    await this.simulateDelay();

    // Mock logic for mission recommendations
    const recommendations: MissionRecommendation[] = [
      {
        mission_id: 'mission_001',
        confidence_score: 0.85,
        reasoning: [
          'Matches your current skill level',
          'High LifeScore improvement potential',
          'Aligns with your recent activity patterns'
        ],
        expected_impact: {
          xp_gain: 50,
          lifescore_change: 15,
          time_required: '2-3 days'
        }
      },
      {
        mission_id: 'mission_002',
        confidence_score: 0.72,
        reasoning: [
          'Builds on your completed missions',
          'Good for skill development',
          'Social collaboration opportunity'
        ],
        expected_impact: {
          xp_gain: 75,
          lifescore_change: 20,
          time_required: '1 week'
        }
      }
    ];

    return {
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    };
  }

  // Predict scenario outcomes
  async predictScenarioOutcome(
    inputs: ScenarioInputParams
  ): Promise<AIResponse<ScenarioPrediction>> {
    await this.simulateDelay();

    // Mock scenario prediction logic
    const prediction: ScenarioPrediction = {
      scenario_id: 'scenario_001',
      confidence_score: 0.78,
      predictions: {
        risk_assessment: {
          level: this.calculateRiskLevel(inputs),
          factors: this.identifyRiskFactors(inputs),
          recommendations: this.generateRiskRecommendations(inputs)
        },
        lifescore_impact: {
          current: 750,
          predicted: this.calculatePredictedLifeScore(inputs),
          change: this.calculateLifeScoreChange(inputs)
        },
        xp_potential: {
          min: 25,
          max: 100,
          factors: ['scenario_complexity', 'user_engagement', 'outcome_quality']
        },
        cost_analysis: {
          premium_change: this.calculatePremiumChange(inputs),
          savings_potential: this.calculateSavingsPotential(inputs),
          roi_timeline: '6-12 months'
        }
      },
      alternative_scenarios: [
        'Conservative approach with lower risk',
        'Aggressive approach with higher potential rewards',
        'Balanced approach with moderate risk'
      ]
    };

    return {
      success: true,
      data: prediction,
      timestamp: new Date().toISOString()
    };
  }

  // Generate avatar nudges based on user state
  async generateAvatarNudge(
    userState: {
      lifescore: number;
      streak_days: number;
      recent_activity: string[];
      current_missions: string[];
    }
  ): Promise<AIResponse<AvatarNudge>> {
    await this.simulateDelay();

    const nudge = this.selectNudgeType(userState);
    
    const avatarNudge: AvatarNudge = {
      type: nudge.type,
      message_en: nudge.message_en,
      message_ar: nudge.message_ar,
      urgency: nudge.urgency,
      action_required: nudge.action_required,
      suggested_actions: nudge.suggested_actions
    };

    return {
      success: true,
      data: avatarNudge,
      timestamp: new Date().toISOString()
    };
  }

  // Adjust collaborative mission difficulty
  async adjustCollaborativeDifficulty(
    participants: {
      user_ids: string[];
      skill_levels: number[];
      previous_collaborations: number;
      time_availability: boolean[];
    }
  ): Promise<AIResponse<CollaborativeDifficultyAdjustment>> {
    await this.simulateDelay();

    const adjustment: CollaborativeDifficultyAdjustment = {
      base_difficulty: 'medium',
      adjusted_difficulty: this.calculateAdjustedDifficulty(participants),
      adjustment_factors: {
        participant_count: participants.user_ids.length,
        skill_levels: participants.skill_levels,
        previous_collaborations: participants.previous_collaborations,
        time_constraints: participants.time_availability.some(available => !available)
      },
      recommended_changes: this.generateDifficultyRecommendations(participants)
    };

    return {
      success: true,
      data: adjustment,
      timestamp: new Date().toISOString()
    };
  }

  // Generate personalized content recommendations
  async generateContentRecommendations(
    userId: string,
    contentType: 'missions' | 'skills' | 'rewards' | 'scenarios'
  ): Promise<AIResponse<any[]>> {
    await this.simulateDelay();

    // Mock content recommendations based on type
    const recommendations = this.generateMockRecommendations(contentType);

    return {
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    };
  }

  // Analyze user behavior patterns
  async analyzeUserBehavior(
    userId: string,
    timeRange: { start: string; end: string }
  ): Promise<AIResponse<any>> {
    await this.simulateDelay();

    const analysis = {
      engagement_score: Math.random() * 100,
      preferred_mission_types: ['safe_driving', 'health'],
      optimal_activity_times: ['morning', 'evening'],
      social_interaction_level: 'high',
      improvement_areas: ['financial_guardian', 'lifestyle'],
      recommendations: [
        'Try more collaborative missions',
        'Focus on financial guardian skills',
        'Consider lifestyle improvements'
      ]
    };

    return {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    };
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = this.baseDelay + Math.random() * 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private calculateRiskLevel(inputs: ScenarioInputParams): 'low' | 'medium' | 'high' | 'critical' {
    // Mock risk calculation logic
    const riskFactors = this.countRiskFactors(inputs);
    if (riskFactors >= 5) return 'critical';
    if (riskFactors >= 3) return 'high';
    if (riskFactors >= 1) return 'medium';
    return 'low';
  }

  private identifyRiskFactors(inputs: ScenarioInputParams): string[] {
    const factors: string[] = [];
    
    if (inputs.lifestyle_factors?.age && inputs.lifestyle_factors.age > 65) {
      factors.push('Age-related risk');
    }
    
    if (inputs.travel_factors?.activities?.includes('extreme_sports')) {
      factors.push('High-risk activities');
    }
    
    if (inputs.policy_factors?.desired_coverage === 'comprehensive') {
      factors.push('High coverage requirements');
    }

    return factors;
  }

  private generateRiskRecommendations(inputs: ScenarioInputParams): string[] {
    return [
      'Consider additional safety measures',
      'Review current coverage gaps',
      'Explore premium optimization options',
      'Consult with insurance advisor'
    ];
  }

  private calculatePredictedLifeScore(inputs: ScenarioInputParams): number {
    // Mock LifeScore calculation
    let baseScore = 750;
    
    if (inputs.lifestyle_factors?.health_conditions?.length === 0) {
      baseScore += 50;
    }
    
    if (inputs.travel_factors?.activities?.includes('safe_activities')) {
      baseScore += 25;
    }
    
    return Math.min(baseScore, 1000);
  }

  private calculateLifeScoreChange(inputs: ScenarioInputParams): number {
    return this.calculatePredictedLifeScore(inputs) - 750;
  }

  private calculatePremiumChange(inputs: ScenarioInputParams): number {
    // Mock premium calculation
    return Math.random() * 200 - 100; // -100 to +100
  }

  private calculateSavingsPotential(inputs: ScenarioInputParams): number {
    // Mock savings calculation
    return Math.random() * 500; // 0 to 500
  }

  private countRiskFactors(inputs: ScenarioInputParams): number {
    let count = 0;
    
    if (inputs.lifestyle_factors?.age && inputs.lifestyle_factors.age > 65) count++;
    if (inputs.travel_factors?.activities?.includes('extreme_sports')) count++;
    if (inputs.policy_factors?.desired_coverage === 'comprehensive') count++;
    if (inputs.lifestyle_factors?.health_conditions?.length > 0) count++;
    if (inputs.travel_factors?.duration_days && inputs.travel_factors.duration_days > 30) count++;
    
    return count;
  }

  private selectNudgeType(userState: any): any {
    const nudges = [
      {
        type: 'encouragement' as const,
        message_en: 'Great job on your streak! Keep it up!',
        message_ar: 'عمل رائع في سلسلتك! استمر!',
        urgency: 'low' as const,
        action_required: false,
        suggested_actions: ['Continue current missions', 'Try a new challenge']
      },
      {
        type: 'reminder' as const,
        message_en: 'You have pending missions waiting for you!',
        message_ar: 'لديك مهام معلقة في انتظارك!',
        urgency: 'medium' as const,
        action_required: true,
        suggested_actions: ['Check your missions', 'Start a new mission']
      },
      {
        type: 'celebration' as const,
        message_en: 'Congratulations! You\'ve reached a new level!',
        message_ar: 'تهانينا! لقد وصلت إلى مستوى جديد!',
        urgency: 'low' as const,
        action_required: false,
        suggested_actions: ['View your rewards', 'Share your achievement']
      },
      {
        type: 'warning' as const,
        message_en: 'Your LifeScore could use some attention!',
        message_ar: 'نقاط حياتك تحتاج إلى بعض الاهتمام!',
        urgency: 'high' as const,
        action_required: true,
        suggested_actions: ['Complete health missions', 'Review your profile']
      }
    ];

    // Select nudge based on user state
    if (userState.lifescore < 500) return nudges[3]; // Warning
    if (userState.streak_days > 7) return nudges[2]; // Celebration
    if (userState.current_missions.length === 0) return nudges[1]; // Reminder
    return nudges[0]; // Encouragement
  }

  private calculateAdjustedDifficulty(participants: any): 'easy' | 'medium' | 'hard' | 'expert' {
    const avgSkillLevel = participants.skill_levels.reduce((a: number, b: number) => a + b, 0) / participants.skill_levels.length;
    const collaborationExperience = participants.previous_collaborations;
    
    if (avgSkillLevel < 3 && collaborationExperience < 2) return 'easy';
    if (avgSkillLevel < 5 && collaborationExperience < 5) return 'medium';
    if (avgSkillLevel < 8 && collaborationExperience < 10) return 'hard';
    return 'expert';
  }

  private generateDifficultyRecommendations(participants: any): string[] {
    return [
      'Consider adding more experienced participants',
      'Break down complex tasks into smaller steps',
      'Provide additional guidance for new collaborators',
      'Set clear milestones and checkpoints'
    ];
  }

  private generateMockRecommendations(contentType: string): any[] {
    const recommendations = {
      missions: [
        { id: 'rec_001', title: 'Daily Health Check', confidence: 0.9 },
        { id: 'rec_002', title: 'Safe Driving Challenge', confidence: 0.8 }
      ],
      skills: [
        { id: 'skill_001', title: 'Financial Planning', confidence: 0.85 },
        { id: 'skill_002', title: 'Risk Assessment', confidence: 0.75 }
      ],
      rewards: [
        { id: 'reward_001', title: 'Health Badge', confidence: 0.9 },
        { id: 'reward_002', title: 'Safety Champion', confidence: 0.8 }
      ],
      scenarios: [
        { id: 'scenario_001', title: 'Travel Insurance', confidence: 0.85 },
        { id: 'scenario_002', title: 'Life Event Planning', confidence: 0.7 }
      ]
    };

    return recommendations[contentType as keyof typeof recommendations] || [];
  }
}

// Create singleton instance
export const aiService = new MockAIService();

// Export individual functions for easier use
export const generateMissionRecommendations = (userId: string, context: any) =>
  aiService.generateMissionRecommendations(userId, context);

export const predictScenarioOutcome = (inputs: ScenarioInputParams) =>
  aiService.predictScenarioOutcome(inputs);

export const generateAvatarNudge = (userState: any) =>
  aiService.generateAvatarNudge(userState);

export const adjustCollaborativeDifficulty = (participants: any) =>
  aiService.adjustCollaborativeDifficulty(participants);

export const generateContentRecommendations = (userId: string, contentType: string) =>
  aiService.generateContentRecommendations(userId, contentType);

export const analyzeUserBehavior = (userId: string, timeRange: any) =>
  aiService.analyzeUserBehavior(userId, timeRange);

// Integration points for real AI services
export const AI_INTEGRATION_POINTS = {
  LOVABLE_DEV: {
    endpoint: 'https://api.lovable.dev/v1/',
    apiKey: 'VITE_LOVABLE_API_KEY',
    models: {
      recommendations: 'gpt-4',
      predictions: 'gpt-4',
      nudges: 'gpt-3.5-turbo'
    }
  },
  OPENAI: {
    endpoint: 'https://api.openai.com/v1/',
    apiKey: 'VITE_OPENAI_API_KEY',
    models: {
      recommendations: 'gpt-4',
      predictions: 'gpt-4',
      nudges: 'gpt-3.5-turbo'
    }
  },
  ANTHROPIC: {
    endpoint: 'https://api.anthropic.com/v1/',
    apiKey: 'VITE_ANTHROPIC_API_KEY',
    models: {
      recommendations: 'claude-3-sonnet',
      predictions: 'claude-3-sonnet',
      nudges: 'claude-3-haiku'
    }
  }
};

// Helper function to switch to real AI service
export const switchToRealAI = (provider: 'LOVABLE_DEV' | 'OPENAI' | 'ANTHROPIC') => {
  console.log(`Switching to ${provider} AI service`);
  // Implementation would replace mock functions with real API calls
  // This is a placeholder for future integration
};
