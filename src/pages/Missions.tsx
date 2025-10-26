import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { mockData } from '@/data/mockData';
import { missionsAPI, aiAPI } from '@/lib/api';
import MissionList from '@/components/missions/MissionList';
import MissionDetail from '@/components/missions/MissionDetail';
import CollaborativeMissionCard from '@/components/missions/CollaborativeMissionCard';
import { 
  Target, 
  Users, 
  Star, 
  Filter,
  Search,
  Plus,
  Brain,
  TrendingUp,
  Loader2
} from 'lucide-react';

const Missions: React.FC = () => {
  const { t } = useTranslation();
  const { updateXP, updateLifeScore, updateCoins } = useUser();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [activeMissions, setActiveMissions] = useState<string[]>(['mission-safe-driving-1']);
  const [completedMissions, setCompletedMissions] = useState<string[]>(['mission-health-2']);
  const [missions, setMissions] = useState(mockData.missions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);

  // Load missions and AI recommendations on mount
  useEffect(() => {
    loadMissions();
    loadAIRecommendations();
  }, []);

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      const response = await missionsAPI.getAll({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        limit: 50
      });
      
      if (response.data.success) {
        setMissions(response.data.data.missions || []);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
      // Fallback to mock data
      setMissions(mockData.missions);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAIRecommendations = async () => {
    try {
      const response = await aiAPI.getRecommendations('mission');
      if (response.data.success) {
        setAiRecommendations(response.data.data.recommendations || []);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      setAiRecommendations(mockData.aiRecommendations);
    }
  };

  // Get missions by category
  const safeDrivingMissions = missions.filter(m => m.category === 'safe_driving');
  const healthMissions = missions.filter(m => m.category === 'health');
  const financialMissions = missions.filter(m => m.category === 'financial_guardian');
  const collaborativeMissions = missions.filter(m => m.is_collaborative);

  // Filter missions based on search and filters
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = searchTerm === '' || 
      mission.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.title_ar.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || mission.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || mission.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // API function to start a mission
  const handleStartMission = async (missionId: string) => {
    try {
      setIsLoading(true);
      const response = await missionsAPI.start(missionId);
      
      if (response.data.success) {
        setActiveMissions(prev => [...prev, missionId]);
        // Update user stats from response
        const { xpResult, lifescoreResult, coinsResult } = response.data.data.rewards || {};
        updateXP(xpResult?.xpGained || 10);
        updateLifeScore(lifescoreResult?.change || 5);
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
        const { xpResult, lifescoreResult, coinsResult } = response.data.data.rewards || {};
        updateXP(xpResult?.xpGained || 0);
        updateLifeScore(lifescoreResult?.change || 0);
        updateCoins(coinsResult?.coinsGained || 0);
      }
    } catch (error) {
      console.error('Error completing mission:', error);
      // Fallback to mock behavior
      const mission = missions.find(m => m.id === missionId);
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

  // API function to join collaborative mission
  const handleJoinMission = async (missionId: string) => {
    try {
      setIsLoading(true);
      const response = await missionsAPI.join(missionId);
      
      if (response.data.success) {
        setActiveMissions(prev => [...prev, missionId]);
        // Update user stats from response
        const { xpResult, lifescoreResult, coinsResult } = response.data.data.rewards || {};
        updateXP(xpResult?.xpGained || 0);
        updateLifeScore(lifescoreResult?.change || 0);
        updateCoins(coinsResult?.coinsGained || 0);
      }
    } catch (error) {
      console.error('Error joining mission:', error);
      // Fallback to mock behavior
      setActiveMissions(prev => [...prev, missionId]);
      updateXP(10);
      updateLifeScore(5);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to join collaborative mission
  const handleJoinCollaborative = (missionId: string) => {
    setActiveMissions(prev => [...prev, missionId]);
    updateXP(15);
    updateLifeScore(8);
  };

  // Mock function to leave collaborative mission
  const handleLeaveCollaborative = (missionId: string) => {
    setActiveMissions(prev => prev.filter(id => id !== missionId));
  };

  // Mock function to invite to collaborative mission
  const handleInviteCollaborative = (missionId: string) => {
    // In real app, this would open an invite modal
    console.log('Inviting to mission:', missionId);
  };

  // Mock participants data
  const mockParticipants = [
    {
      id: 'user-1',
      name: 'Ahmed Al-Rashid',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmed',
      progress: 75,
      isLeader: true
    },
    {
      id: 'user-2',
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
      progress: 60,
      isLeader: false
    }
  ];

  const selectedMissionData = selectedMission 
    ? mockData.missions.find(m => m.id === selectedMission)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('missions')}
              </h1>
              <p className="text-muted-foreground">
                {t('missions_subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filters')}
              </Button>
              <Button size="sm" className="bg-qic-primary hover:bg-qic-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('new_mission')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('search_missions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search" className="mb-2 block">{t('search_missions')}</Label>
                <Input
                  id="search"
                  placeholder={t('search_missions')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category" className="mb-2 block">{t('category')}</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('all_categories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_categories')}</SelectItem>
                    <SelectItem value="safe_driving">{t('safe_driving')}</SelectItem>
                    <SelectItem value="health">{t('health')}</SelectItem>
                    <SelectItem value="financial_guardian">{t('financial_guardian')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty" className="mb-2 block">{t('difficulty')}</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder={t('all_difficulties')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_difficulties')}</SelectItem>
                    <SelectItem value="easy">{t('mission_difficulty.easy')}</SelectItem>
                    <SelectItem value="medium">{t('mission_difficulty.medium')}</SelectItem>
                    <SelectItem value="hard">{t('mission_difficulty.hard')}</SelectItem>
                    <SelectItem value="expert">{t('mission_difficulty.epic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {filteredMissions.length} {t('missions_found')}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                >
                  {t('clear_filters')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadMissions}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {t('refresh')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {aiRecommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-qic-primary" />
                {t('ai_recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-qic-primary/10">
                        <Star className="h-4 w-4 text-qic-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            +{rec.xp_reward} XP
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{rec.lifescore_impact} LifeScore
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMissionData ? (
          // Mission Detail View
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMission(null)}
              >
                ← {t('back_to_missions')}
              </Button>
              <h2 className="text-2xl font-bold">
                {t('language') === 'ar' ? selectedMissionData.title_ar : selectedMissionData.title_en}
              </h2>
            </div>
            <MissionDetail
              mission={selectedMissionData}
              onStart={handleStartMission}
              onComplete={handleCompleteMission}
              isActive={activeMissions.includes(selectedMissionData.id)}
              isCompleted={completedMissions.includes(selectedMissionData.id)}
              progress={activeMissions.includes(selectedMissionData.id) ? Math.floor(Math.random() * 100) : 0}
            />
          </div>
        ) : (
          // Missions List View
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">{t('all_missions')}</TabsTrigger>
              <TabsTrigger value="safe_driving">{t('safe_driving')}</TabsTrigger>
              <TabsTrigger value="health">{t('health')}</TabsTrigger>
              <TabsTrigger value="financial">{t('financial_guardian')}</TabsTrigger>
              <TabsTrigger value="collaborative">{t('collaborative')}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-qic-primary" />
                    </div>
                  ) : (
                    <MissionList
                      missions={filteredMissions}
                      onStartMission={handleStartMission}
                      onCompleteMission={handleCompleteMission}
                      activeMissions={activeMissions}
                      completedMissions={completedMissions}
                    />
                  )}
                </div>
                <div className="space-y-6">
                  {/* AI Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5" />
                        <span>{t('ai_recommendations')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockData.aiRecommendations.slice(0, 3).map((recommendation) => (
                        <div key={recommendation.id} className="p-3 rounded-lg border bg-muted/50">
                          <h4 className="font-medium text-sm mb-1">
                            {t('language') === 'ar' ? recommendation.title_ar : recommendation.title_en}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {t('language') === 'ar' ? recommendation.description_ar : recommendation.description_en}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>{t('quick_stats')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">{t('active_missions')}</span>
                        <Badge variant="outline">{activeMissions.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('completed_missions')}</span>
                        <Badge variant="outline">{completedMissions.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('total_missions')}</span>
                        <Badge variant="outline">{mockData.missions.length}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="safe_driving">
              <MissionList
                missions={safeDrivingMissions}
                onStartMission={handleStartMission}
                onCompleteMission={handleCompleteMission}
                activeMissions={activeMissions}
                completedMissions={completedMissions}
              />
            </TabsContent>

            <TabsContent value="health">
              <MissionList
                missions={healthMissions}
                onStartMission={handleStartMission}
                onCompleteMission={handleCompleteMission}
                activeMissions={activeMissions}
                completedMissions={completedMissions}
              />
            </TabsContent>

            <TabsContent value="financial">
              <MissionList
                missions={financialMissions}
                onStartMission={handleStartMission}
                onCompleteMission={handleCompleteMission}
                activeMissions={activeMissions}
                completedMissions={completedMissions}
              />
            </TabsContent>

            <TabsContent value="collaborative">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collaborativeMissions.map((mission) => (
                    <CollaborativeMissionCard
                      key={mission.id}
                      mission={mission}
                      participants={mockParticipants}
                      onJoin={handleJoinMission}
                      onLeave={handleLeaveCollaborative}
                      onInvite={handleInviteCollaborative}
                      isJoined={activeMissions.includes(mission.id)}
                      isLeader={false}
                      overallProgress={Math.floor(Math.random() * 100)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Missions;
