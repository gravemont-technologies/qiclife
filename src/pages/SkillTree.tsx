import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { skillTreeAPI } from '@/lib/api';
import { mockData } from '@/data/mockData';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import { 
  TreePine, 
  Target, 
  Star, 
  Lock,
  CheckCircle,
  Zap,
  Shield,
  Heart,
  DollarSign,
  Car,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

const SkillTree: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateXP, updateLifeScore } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('safe_driving');
  const [skillTree, setSkillTree] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [showLocked, setShowLocked] = useState(false);

  // Load skill tree data on mount
  useEffect(() => {
    loadSkillTreeData();
  }, [selectedCategory]);

  const loadSkillTreeData = async () => {
    try {
      setIsLoading(true);
      const [treeResponse, skillsResponse] = await Promise.all([
        skillTreeAPI.getTree(selectedCategory),
        skillTreeAPI.getUserSkills()
      ]);

      if (treeResponse.data.success) {
        setSkillTree(treeResponse.data.data);
      }
      if (skillsResponse.data.success) {
        setUserSkills(skillsResponse.data.data.skills || []);
      }
    } catch (error) {
      console.error('Error loading skill tree data:', error);
      // Fallback to mock data
      setSkillTree(mockData.skillTrees?.[selectedCategory] || null);
      setUserSkills(mockData.userSkills || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockSkill = async (skillId: string) => {
    try {
      const response = await skillTreeAPI.unlockSkill(skillId);
      if (response.data.success) {
        // Update user stats
        if (response.data.data.xp_gained) {
          updateXP(response.data.data.xp_gained);
        }
        if (response.data.data.lifescore_impact) {
          updateLifeScore(response.data.data.lifescore_impact);
        }
        // Update skill tree
        setSkillTree(prev => ({
          ...prev,
          skills: prev.skills.map((skill: any) => 
            skill.id === skillId 
              ? { ...skill, isUnlocked: true, isCompleted: true }
              : skill
          )
        }));
        // Add to user skills
        setUserSkills(prev => [...prev, response.data.data.skill]);
      }
    } catch (error) {
      console.error('Error unlocking skill:', error);
    }
  };

  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'safe_driving': return <Car className="h-5 w-5" />;
      case 'health': return <Heart className="h-5 w-5" />;
      case 'financial_guardian': return <DollarSign className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getSkillStatus = (skill: any) => {
    if (skill.isCompleted) return 'completed';
    if (skill.isUnlocked) return 'unlocked';
    if (skill.requirements?.every((req: any) => 
      userSkills.some(userSkill => userSkill.id === req.skill_id && userSkill.isCompleted)
    )) return 'available';
    return 'locked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'unlocked': return 'text-blue-600 bg-blue-100';
      case 'available': return 'text-yellow-600 bg-yellow-100';
      case 'locked': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'unlocked': return <Zap className="h-5 w-5" />;
      case 'available': return <Target className="h-5 w-5" />;
      case 'locked': return <Lock className="h-5 w-5" />;
      default: return <Lock className="h-5 w-5" />;
    }
  };

  const categories = [
    { id: 'safe_driving', name: t('safe_driving'), icon: <Car className="h-5 w-5" /> },
    { id: 'health', name: t('health'), icon: <Heart className="h-5 w-5" /> },
    { id: 'financial_guardian', name: t('financial_guardian'), icon: <DollarSign className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <TreePine className="h-8 w-8" />
                {t('skill_tree')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('unlock_skills_and_improve_your_lifescore')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowLocked(!showLocked)}
              >
                {showLocked ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {t('hide_locked')}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('show_locked')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Skill Tree Visualization */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getSkillIcon(category.id)}
                        {category.name} {t('skill_tree')}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t('unlock_skills_to_improve_your_lifescore')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-qic-primary" />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Skill Tree Levels */}
                          {skillTree?.levels?.map((level: any, levelIndex: number) => (
                            <div key={level.id} className="space-y-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Level {level.level}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {level.description}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {level.skills?.map((skill: any) => {
                                  const status = getSkillStatus(skill);
                                  const isVisible = showLocked || status !== 'locked';
                                  
                                  if (!isVisible) return null;

                                  return (
                                    <div
                                      key={skill.id}
                                      className={`p-4 border rounded-lg transition-all ${
                                        status === 'completed' ? 'border-green-500 bg-green-50' :
                                        status === 'unlocked' ? 'border-blue-500 bg-blue-50' :
                                        status === 'available' ? 'border-yellow-500 bg-yellow-50' :
                                        'border-gray-300 bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                                            {getStatusIcon(status)}
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-sm">{skill.title}</h4>
                                            <p className="text-xs text-muted-foreground">
                                              {skill.category}
                                            </p>
                                          </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                          {skill.xp_cost} XP
                                        </Badge>
                                      </div>

                                      <p className="text-sm text-muted-foreground mb-3">
                                        {skill.description}
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                          <span>{t('lifescore_impact')}</span>
                                          <span className="font-medium">
                                            +{skill.lifescore_impact}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                          <span>{t('xp_reward')}</span>
                                          <span className="font-medium">
                                            +{skill.xp_reward}
                                          </span>
                                        </div>
                                      </div>

                                      {status === 'available' && (
                                        <Button
                                          size="sm"
                                          className="w-full mt-3"
                                          onClick={() => handleUnlockSkill(skill.id)}
                                        >
                                          <Zap className="h-4 w-4 mr-2" />
                                          {t('unlock')}
                                        </Button>
                                      )}

                                      {status === 'locked' && (
                                        <div className="text-xs text-muted-foreground mt-3">
                                          <p>{t('requirements')}:</p>
                                          <ul className="list-disc list-inside mt-1">
                                            {skill.requirements?.map((req: any, index: number) => (
                                              <li key={index}>{req.description}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        {t('your_progress')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <LifeScoreCard />
                      <XPProgressBar />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {t('category_stats')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">{t('skills_unlocked')}</span>
                        <Badge variant="outline">
                          {userSkills.filter(skill => skill.category === category.id).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('total_xp_gained')}</span>
                        <Badge variant="outline">
                          {userSkills
                            .filter(skill => skill.category === category.id)
                            .reduce((total, skill) => total + (skill.xp_reward || 0), 0)} XP
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('lifescore_boost')}</span>
                        <Badge variant="outline">
                          +{userSkills
                            .filter(skill => skill.category === category.id)
                            .reduce((total, skill) => total + (skill.lifescore_impact || 0), 0)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('next_skills')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {skillTree?.skills
                        ?.filter((skill: any) => getSkillStatus(skill) === 'available')
                        ?.slice(0, 3)
                        ?.map((skill: any) => (
                          <div key={skill.id} className="p-3 border rounded-lg bg-yellow-50">
                            <h4 className="font-medium text-sm">{skill.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {skill.xp_cost} XP • +{skill.lifescore_impact} LifeScore
                            </p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SkillTree;
