// QIC Gamified Insurance App - Scenarios Service
// Handles all scenario simulation and AI prediction operations with mock data

import type {
  Scenario,
  UserScenario,
  ScenarioCategory,
  ScenarioInputParams,
  AIPredictions
} from '@/types';
import { aiService } from './ai';

// Mock scenarios data
const mockScenarios: Scenario[] = [
  {
    id: 'scenario_001',
    title_en: 'Travel Insurance Planning',
    title_ar: 'تخطيط تأمين السفر',
    description_en: 'Plan your travel insurance coverage for an upcoming trip',
    description_ar: 'خطط تغطية تأمين السفر لرحلتك القادمة',
    category: 'travel',
    input_params: {
      travel_factors: {
        destination: 'string',
        duration_days: 'number',
        activities: 'array',
        accommodation_type: 'string'
      }
    },
    ai_predictions: {
      risk_assessment: {
        level: 'medium',
        factors: ['destination_risk', 'activity_risk', 'duration_risk'],
        recommendations: ['Consider comprehensive coverage', 'Review activity exclusions']
      },
      lifescore_impact: {
        current: 750,
        predicted: 780,
        change: 30
      },
      xp_potential: {
        min: 25,
        max: 75,
        factors: ['scenario_complexity', 'user_engagement']
      }
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'scenario_002',
    title_en: 'Lifestyle Change Impact',
    title_ar: 'تأثير تغيير نمط الحياة',
    description_en: 'Analyze how lifestyle changes affect your insurance needs',
    description_ar: 'حلل كيف تؤثر تغييرات نمط الحياة على احتياجاتك التأمينية',
    category: 'lifestyle',
    input_params: {
      lifestyle_factors: {
        age: 'number',
        occupation: 'string',
        income_level: 'string',
        family_status: 'string',
        health_conditions: 'array'
      }
    },
    ai_predictions: {
      risk_assessment: {
        level: 'low',
        factors: ['age_factor', 'occupation_risk', 'health_status'],
        recommendations: ['Maintain current coverage', 'Consider life insurance']
      },
      lifescore_impact: {
        current: 750,
        predicted: 800,
        change: 50
      },
      xp_potential: {
        min: 30,
        max: 60,
        factors: ['lifestyle_improvement', 'health_factors']
      }
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'scenario_003',
    title_en: 'Policy Upgrade Analysis',
    title_ar: 'تحليل ترقية السياسة',
    description_en: 'Evaluate the benefits of upgrading your insurance policy',
    description_ar: 'قيم فوائد ترقية سياسة التأمين الخاصة بك',
    category: 'policy_change',
    input_params: {
      policy_factors: {
        current_coverage: 'string',
        desired_coverage: 'string',
        budget_range: 'array',
        beneficiaries: 'number'
      }
    },
    ai_predictions: {
      risk_assessment: {
        level: 'high',
        factors: ['coverage_gap', 'budget_constraints', 'beneficiary_needs'],
        recommendations: ['Consider gradual upgrade', 'Review budget allocation']
      },
      lifescore_impact: {
        current: 750,
        predicted: 850,
        change: 100
      },
      xp_potential: {
        min: 40,
        max: 100,
        factors: ['policy_complexity', 'financial_planning']
      },
      cost_analysis: {
        premium_change: 150,
        savings_potential: 500,
        roi_timeline: '12-18 months'
      }
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'scenario_004',
    title_en: 'Life Event Planning',
    title_ar: 'تخطيط أحداث الحياة',
    description_en: 'Plan insurance coverage for major life events',
    description_ar: 'خطط تغطية التأمين للأحداث المهمة في الحياة',
    category: 'life_event',
    input_params: {
      lifestyle_factors: {
        age: 'number',
        family_status: 'string',
        health_conditions: 'array'
      },
      policy_factors: {
        current_coverage: 'string',
        desired_coverage: 'string',
        budget_range: 'array'
      }
    },
    ai_predictions: {
      risk_assessment: {
        level: 'medium',
        factors: ['life_event_risk', 'coverage_adequacy', 'timing_factor'],
        recommendations: ['Increase coverage before event', 'Review beneficiary designations']
      },
      lifescore_impact: {
        current: 750,
        predicted: 820,
        change: 70
      },
      xp_potential: {
        min: 35,
        max: 80,
        factors: ['event_importance', 'planning_complexity']
      }
    },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock user scenarios data
const mockUserScenarios: UserScenario[] = [
  {
    id: 'user_scenario_001',
    user_id: 'user_001',
    scenario_id: 'scenario_001',
    inputs: {
      travel_factors: {
        destination: 'Japan',
        duration_days: 14,
        activities: ['sightseeing', 'hiking', 'cultural_tours'],
        accommodation_type: 'hotel'
      }
    },
    results: {
      risk_assessment: {
        level: 'medium',
        factors: ['destination_risk', 'activity_risk'],
        recommendations: ['Consider adventure sports coverage', 'Review medical coverage limits']
      },
      lifescore_impact: {
        current: 750,
        predicted: 780,
        change: 30
      },
      xp_potential: {
        min: 25,
        max: 75,
        factors: ['scenario_complexity', 'user_engagement']
      }
    },
    lifescore_impact: 30,
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_scenario_002',
    user_id: 'user_001',
    scenario_id: 'scenario_002',
    inputs: {
      lifestyle_factors: {
        age: 35,
        occupation: 'software_engineer',
        income_level: 'high',
        family_status: 'married',
        health_conditions: []
      }
    },
    results: {
      risk_assessment: {
        level: 'low',
        factors: ['age_factor', 'occupation_risk'],
        recommendations: ['Maintain current coverage', 'Consider disability insurance']
      },
      lifescore_impact: {
        current: 750,
        predicted: 800,
        change: 50
      },
      xp_potential: {
        min: 30,
        max: 60,
        factors: ['lifestyle_improvement', 'health_factors']
      }
    },
    lifescore_impact: 50,
    created_at: '2024-01-16T00:00:00Z'
  }
];

// Scenarios Service Class
export class ScenariosService {
  // Get all available scenarios
  async getAllScenarios(filters?: {
    category?: ScenarioCategory;
    is_active?: boolean;
  }): Promise<Scenario[]> {
    await this.simulateDelay();
    
    let filteredScenarios = [...mockScenarios];
    
    if (filters?.category) {
      filteredScenarios = filteredScenarios.filter(scenario => scenario.category === filters.category);
    }
    
    if (filters?.is_active !== undefined) {
      filteredScenarios = filteredScenarios.filter(scenario => scenario.is_active === filters.is_active);
    }
    
    return filteredScenarios;
  }

  // Get scenario by ID
  async getScenarioById(scenarioId: string): Promise<Scenario | null> {
    await this.simulateDelay();
    return mockScenarios.find(scenario => scenario.id === scenarioId) || null;
  }

  // Get scenarios by category
  async getScenariosByCategory(category: ScenarioCategory): Promise<Scenario[]> {
    return this.getAllScenarios({ category });
  }

  // Get user's scenario history
  async getUserScenarios(userId: string): Promise<UserScenario[]> {
    await this.simulateDelay();
    return mockUserScenarios.filter(scenario => scenario.user_id === userId);
  }

  // Run a scenario simulation
  async runScenario(
    userId: string,
    scenarioId: string,
    inputs: ScenarioInputParams
  ): Promise<UserScenario> {
    await this.simulateDelay();
    
    const scenario = await this.getScenarioById(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }
    
    // Get AI predictions
    const aiResponse = await aiService.predictScenarioOutcome(inputs);
    const predictions = aiResponse.data?.predictions;
    
    if (!predictions) {
      throw new Error('Failed to get AI predictions');
    }
    
    const userScenario: UserScenario = {
      id: `user_scenario_${Date.now()}`,
      user_id: userId,
      scenario_id: scenarioId,
      inputs,
      results: predictions,
      lifescore_impact: predictions.lifescore_impact.change,
      created_at: new Date().toISOString()
    };
    
    mockUserScenarios.push(userScenario);
    return userScenario;
  }

  // Get scenario categories
  getScenarioCategories(): ScenarioCategory[] {
    return ['lifestyle', 'travel', 'policy_change', 'life_event'];
  }

  // Get scenario statistics for user
  async getScenarioStats(userId: string): Promise<{
    total_scenarios: number;
    scenarios_by_category: Record<ScenarioCategory, number>;
    average_lifescore_impact: number;
    total_lifescore_impact: number;
    recent_scenarios: UserScenario[];
    risk_distribution: Record<string, number>;
  }> {
    await this.simulateDelay();
    
    const userScenarios = await this.getUserScenarios(userId);
    const scenariosByCategory: Record<ScenarioCategory, number> = {
      lifestyle: 0,
      travel: 0,
      policy_change: 0,
      life_event: 0
    };
    
    const riskDistribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    for (const userScenario of userScenarios) {
      const scenario = await this.getScenarioById(userScenario.scenario_id);
      if (scenario) {
        scenariosByCategory[scenario.category]++;
      }
      
      const riskLevel = userScenario.results.risk_assessment.level;
      riskDistribution[riskLevel]++;
    }
    
    const totalLifeScoreImpact = userScenarios.reduce((sum, scenario) => sum + scenario.lifescore_impact, 0);
    const averageLifeScoreImpact = userScenarios.length > 0 ? totalLifeScoreImpact / userScenarios.length : 0;
    
    const recentScenarios = userScenarios
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    return {
      total_scenarios: userScenarios.length,
      scenarios_by_category: scenariosByCategory,
      average_lifescore_impact: averageLifeScoreImpact,
      total_lifescore_impact: totalLifeScoreImpact,
      recent_scenarios: recentScenarios,
      risk_distribution: riskDistribution
    };
  }

  // Compare scenarios
  async compareScenarios(scenarioIds: string[]): Promise<{
    scenarios: Scenario[];
    comparison: {
      risk_levels: Record<string, string>;
      lifescore_impacts: Record<string, number>;
      xp_potentials: Record<string, { min: number; max: number }>;
      recommendations: Record<string, string[]>;
    };
  }> {
    await this.simulateDelay();
    
    const scenarios = await Promise.all(
      scenarioIds.map(id => this.getScenarioById(id))
    );
    
    const validScenarios = scenarios.filter(scenario => scenario !== null) as Scenario[];
    
    const comparison = {
      risk_levels: {} as Record<string, string>,
      lifescore_impacts: {} as Record<string, number>,
      xp_potentials: {} as Record<string, { min: number; max: number }>,
      recommendations: {} as Record<string, string[]>
    };
    
    for (const scenario of validScenarios) {
      comparison.risk_levels[scenario.id] = scenario.ai_predictions.risk_assessment.level;
      comparison.lifescore_impacts[scenario.id] = scenario.ai_predictions.lifescore_impact.change;
      comparison.xp_potentials[scenario.id] = scenario.ai_predictions.xp_potential;
      comparison.recommendations[scenario.id] = scenario.ai_predictions.risk_assessment.recommendations;
    }
    
    return {
      scenarios: validScenarios,
      comparison
    };
  }

  // Get scenario recommendations based on user profile
  async getScenarioRecommendations(
    userId: string,
    userProfile: {
      lifescore: number;
      level: number;
      recent_activities: string[];
      preferences: string[];
    }
  ): Promise<Scenario[]> {
    await this.simulateDelay();
    
    // Mock recommendation logic based on user profile
    let recommendedScenarios = [...mockScenarios];
    
    // Filter by user level
    if (userProfile.level < 3) {
      recommendedScenarios = recommendedScenarios.filter(scenario => 
        scenario.category === 'lifestyle' || scenario.category === 'travel'
      );
    }
    
    // Filter by LifeScore
    if (userProfile.lifescore < 600) {
      recommendedScenarios = recommendedScenarios.filter(scenario =>
        scenario.ai_predictions.lifescore_impact.change > 0
      );
    }
    
    // Sort by potential impact
    recommendedScenarios.sort((a, b) => 
      b.ai_predictions.lifescore_impact.change - a.ai_predictions.lifescore_impact.change
    );
    
    return recommendedScenarios.slice(0, 5);
  }

  // Save scenario as favorite
  async saveScenarioAsFavorite(userId: string, scenarioId: string): Promise<void> {
    await this.simulateDelay();
    
    const scenario = await this.getScenarioById(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }
    
    // This would typically save to a favorites table
    console.log(`Scenario ${scenarioId} saved as favorite for user ${userId}`);
  }

  // Get saved scenarios
  async getSavedScenarios(userId: string): Promise<Scenario[]> {
    await this.simulateDelay();
    
    // Mock saved scenarios - in real implementation, this would query a favorites table
    const savedScenarioIds = ['scenario_001', 'scenario_002'];
    const savedScenarios = await Promise.all(
      savedScenarioIds.map(id => this.getScenarioById(id))
    );
    
    return savedScenarios.filter(scenario => scenario !== null) as Scenario[];
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const scenariosService = new ScenariosService();

// Export individual functions for easier use
export const getAllScenarios = (filters?: any) => scenariosService.getAllScenarios(filters);
export const getScenarioById = (scenarioId: string) => scenariosService.getScenarioById(scenarioId);
export const getScenariosByCategory = (category: ScenarioCategory) => scenariosService.getScenariosByCategory(category);
export const getUserScenarios = (userId: string) => scenariosService.getUserScenarios(userId);
export const runScenario = (userId: string, scenarioId: string, inputs: ScenarioInputParams) => scenariosService.runScenario(userId, scenarioId, inputs);
export const getScenarioCategories = () => scenariosService.getScenarioCategories();
export const getScenarioStats = (userId: string) => scenariosService.getScenarioStats(userId);
export const compareScenarios = (scenarioIds: string[]) => scenariosService.compareScenarios(scenarioIds);
export const getScenarioRecommendations = (userId: string, userProfile: any) => scenariosService.getScenarioRecommendations(userId, userProfile);
export const saveScenarioAsFavorite = (userId: string, scenarioId: string) => scenariosService.saveScenarioAsFavorite(userId, scenarioId);
export const getSavedScenarios = (userId: string) => scenariosService.getSavedScenarios(userId);
