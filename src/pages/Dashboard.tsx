import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { mockData } from '@/data/mockData';
import { missionsAPI, aiAPI } from '@/lib/api';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import CoinCounter from '@/components/gamification/CoinCounter';
import LevelIndicator from '@/components/gamification/LevelIndicator';
import MissionCard from '@/components/missions/MissionCard';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Brain, 
  Star,
  ArrowRight,
  Plus,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateXP, updateLifeScore, updateCoins } = useUser();
  const [activeMissions, setActiveMissions] = useState<string[]>(['mission-safe-driving-1']);
  const [completedMissions, setCompletedMissions] = useState<string[]>(['mission-health-2']);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(mockData.aiRecommendations);
  const [recommendedMissions, setRecommendedMissions] = useState(mockData.missions.slice(0, 3));

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load AI recommendations
      const aiResponse = await aiAPI.getRecommendations();
      setAiRecommendations(aiResponse.data.data.recommendations || []);
      
      // Load recommended missions
      const missionsResponse = await missionsAPI.getAll({ limit: 3 });
      setRecommendedMissions(missionsResponse.data.data.missions || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  // Get active missions data
  const activeMissionsData = mockData.missions.filter(mission => 
    activeMissions.includes(mission.id)
  );

  // Get completed missions data
  const completedMissionsData = mockData.missions.filter(mission => 
    completedMissions.includes(mission.id)
  );

  // API function to start a mission
  const handleStartMission = async (missionId: string) => {
    try {
      setIsLoading(true);
      const response = await missionsAPI.start(missionId);
      
      if (response.data.success) {
        setActiveMissions(prev => [...prev, missionId]);
        // Update user stats from response
        const { xpResult, lifescoreResult, coinsResult } = response.data.data.rewards;
        updateXP(xpResult?.xpGained || 0);
        updateLifeScore(lifescoreResult?.change || 0);
        updateCoins(coinsResult?.coinsGained || 0);
      }
    } catch (error) {
      console.error('Error starting mission:', error);
      // Fallback to mock behavior
      setActiveMissions(prev => [...prev, missionId]);
      updateXP(10);
      updateLifeScore(5);
    } finally {
      setIsLoading(false);
    }
  };

  // API function to complete a mission
  const handleCompleteMission = async (missionId: string) => {
    try {
      setIsLoading(true);
      const response = await missionsAPI.complete(missionId);
      
      if (response.data.success) {
        setActiveMissions(prev => prev.filter(id => id !== missionId));
        setCompletedMissions(prev => [...prev, missionId]);
        
        // Update user stats from response
        const { xpResult, lifescoreResult, coinsResult } = response.data.data.rewards;
        updateXP(xpResult?.xpGained || 0);
        updateLifeScore(lifescoreResult?.change || 0);
        updateCoins(coinsResult?.coinsGained || 0);
      }
    } catch (error) {
      console.error('Error completing mission:', error);
      // Fallback to mock behavior
      const mission = mockData.missions.find(m => m.id === missionId);
      if (mission) {
        setActiveMissions(prev => prev.filter(id => id !== missionId));
        setCompletedMissions(prev => [...prev, missionId]);
        updateXP(mission.xp_reward);
        updateLifeScore(mission.lifescore_impact);
        updateCoins(mission.xp_reward / 2);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (profile: any) => {
    setIsOnboardingOpen(false);
    // Reload dashboard data with new profile
    loadDashboardData();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qic-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  // Check if user needs onboarding (simplified check)
  const needsOnboarding = !user.username || user.lifescore === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-qic-primary/10 via-qic-secondary/5 to-qic-accent/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('welcome_back')}, {user.username}!
              </h1>
              <p className="text-muted-foreground">
                {t('dashboard_subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/missions'}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('new_mission')}
              </Button>
              <Button 
                size="sm" 
                className="bg-qic-primary hover:bg-qic-primary/90"
                onClick={() => loadDashboardData()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {t('ai_suggestions')}
              </Button>
              {needsOnboarding && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setIsOnboardingOpen(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LifeScoreCard />
            <XPProgressBar />
            <StreakDisplay />
            <CoinCounter />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{t('active_missions')}</span>
                  <Badge variant="outline">{activeMissionsData.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeMissionsData.length > 0 ? (
                  <div className="space-y-4">
                    {activeMissionsData.map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStart={handleStartMission}
                        onComplete={handleCompleteMission}
                        isActive={true}
                        progress={Math.floor(Math.random() * 100)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('no_active_missions')}</h3>
                    <p className="text-muted-foreground mb-4">{t('start_new_mission')}</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('browse_missions')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>{t('recommended_missions')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onStart={handleStartMission}
                      onComplete={handleCompleteMission}
                      isActive={activeMissions.includes(mission.id)}
                      isCompleted={completedMissions.includes(mission.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level & Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{t('progress')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LevelIndicator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('xp_to_next_level')}</span>
                    <span>{100 - (user.xp % 100)} XP</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-qic-xp h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(user.xp % 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>{t('ai_suggestions')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 rounded-full bg-qic-primary/10">
                        <Zap className="h-4 w-4 text-qic-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">
                          {t('language') === 'ar' ? recommendation.title_ar : recommendation.title_en}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('language') === 'ar' ? recommendation.description_ar : recommendation.description_en}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          {t('view')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quick_actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  {t('social_quests')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  {t('scenario_simulator')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  {t('skill_tree')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  {t('all_missions')}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>{t('recent_achievements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedMissionsData.slice(0, 3).map((mission) => (
                    <div key={mission.id} className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-200">
                      <div className="p-1 rounded-full bg-green-100">
                        <Star className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {t('language') === 'ar' ? mission.title_ar : mission.title_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          +{mission.xp_reward} XP, +{mission.lifescore_impact} LifeScore
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Dashboard;
