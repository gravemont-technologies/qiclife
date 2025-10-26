import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { profileAPI } from '@/lib/api';
import { mockData } from '@/data/mockData';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import StreakDisplay from '@/components/gamification/StreakDisplay';
import CoinCounter from '@/components/gamification/CoinCounter';
import LevelIndicator from '@/components/gamification/LevelIndicator';
import { 
  User, 
  Settings, 
  Trophy, 
  Star, 
  Award,
  Edit,
  Save,
  Loader2,
  Camera,
  Palette,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const { language, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.get();
      
      if (response.data.success) {
        setProfileData(response.data.data.profile);
        setUserStats(response.data.data.stats);
        setAchievements(response.data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to mock data
      setProfileData({
        integrations: ['QIC Mobile App', 'QIC Health Portal', 'QIC Rewards Program'],
        preferences: {
          notifications: { missions: true, achievements: true, reminders: true },
          privacy: { showProgress: true, showAchievements: true }
        },
        settings: {
          language: 'en',
          theme: 'light'
        }
      });
      setUserStats({
        xp: user?.xp || 750,
        level: user?.level || 5,
        lifescore: user?.lifescore || 1250,
        coins: user?.coins || 250,
        currentStreak: user?.streak_days || 7,
        longestStreak: 14
      });
      setAchievements(mockData.achievements || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.update({
        username: user?.username,
        preferences: profileData?.preferences,
        settings: profileData?.settings
      });
      
      if (response.data.success) {
        setIsEditing(false);
        // Update user context
        updateUser({
          username: user?.username,
          language_preference: profileData?.settings?.language || 'en',
          theme_preference: profileData?.settings?.theme || 'light'
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage as any);
    setProfileData(prev => ({
      ...prev,
      settings: { ...prev?.settings, language: newLanguage }
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    setProfileData(prev => ({
      ...prev,
      settings: { ...prev?.settings, theme: newTheme }
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-lg">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {user.username || 'User'}
                </h1>
                <p className="text-muted-foreground">
                  Level {user.level} • {user.lifescore} LifeScore
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('save')}
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('edit')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="achievements">{t('achievements')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
            <TabsTrigger value="integrations">{t('integrations')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LifeScoreCard />
                  <LevelIndicator />
                </div>
                <XPProgressBar />
                <StreakDisplay />
                <CoinCounter />
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {t('recent_achievements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-qic-gold/10">
                          <Award className="h-4 w-4 text-qic-gold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.xp_reward} XP
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      {t('quick_stats')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('total_xp')}</span>
                      <Badge variant="outline">{userStats?.xp || user.xp}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('current_level')}</span>
                      <Badge variant="outline">{userStats?.level || user.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('total_coins')}</span>
                      <Badge variant="outline">{userStats?.coins || user.coins}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-qic-gold/10">
                        <Award className="h-6 w-6 text-qic-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">+{achievement.xp_reward} XP</Badge>
                      <Badge variant="secondary">{achievement.rarity}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('preferences')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('language')}</Label>
                    <Select
                      value={profileData?.settings?.language || language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            English
                          </div>
                        </SelectItem>
                        <SelectItem value="ar">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            العربية
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">{t('theme')}</Label>
                    <Select
                      value={profileData?.settings?.theme || theme}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            {t('light')}
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            {t('dark')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">{t('notifications')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mission-notifications">{t('mission_notifications')}</Label>
                      <input
                        id="mission-notifications"
                        type="checkbox"
                        checked={profileData?.preferences?.notifications?.missions || false}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev?.preferences,
                            notifications: {
                              ...prev?.preferences?.notifications,
                              missions: e.target.checked
                            }
                          }
                        }))}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="achievement-notifications">{t('achievement_notifications')}</Label>
                      <input
                        id="achievement-notifications"
                        type="checkbox"
                        checked={profileData?.preferences?.notifications?.achievements || false}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev?.preferences,
                            notifications: {
                              ...prev?.preferences?.notifications,
                              achievements: e.target.checked
                            }
                          }
                        }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {t('save_changes')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('qic_integrations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData?.integrations?.map((integration: string) => (
                    <div key={integration} className="flex items-center gap-3 p-4 border rounded-lg">
                      <div className="p-2 rounded-full bg-qic-primary/10">
                        <Star className="h-5 w-5 text-qic-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{integration}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('integration_connected')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {t('connected')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
