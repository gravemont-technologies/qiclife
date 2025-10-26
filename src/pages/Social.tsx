import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { socialAPI } from '@/lib/api';
import { mockData } from '@/data/mockData';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import { 
  Users, 
  Trophy, 
  Star, 
  Search,
  UserPlus,
  MessageCircle,
  Share2,
  Crown,
  Flame,
  Target,
  Loader2
} from 'lucide-react';

const Social: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [collaborativeMissions, setCollaborativeMissions] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  // Load social data on mount
  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setIsLoading(true);
      const [friendsResponse, leaderboardResponse, missionsResponse] = await Promise.all([
        socialAPI.getFriends(),
        socialAPI.getLeaderboard(),
        socialAPI.getCollaborativeMissions()
      ]);

      if (friendsResponse.data.success) {
        setFriends(friendsResponse.data.data.friends || []);
      }
      if (leaderboardResponse.data.success) {
        setLeaderboard(leaderboardResponse.data.data.leaderboard || []);
      }
      if (missionsResponse.data.success) {
        setCollaborativeMissions(missionsResponse.data.data.missions || []);
      }
    } catch (error) {
      console.error('Error loading social data:', error);
      // Fallback to mock data
      setFriends(mockData.socialConnections || []);
      setLeaderboard(mockData.leaderboard || []);
      setCollaborativeMissions(mockData.collaborativeMissions || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteFriend = async (friendId: string) => {
    try {
      const response = await socialAPI.inviteFriend(friendId);
      if (response.data.success) {
        // Update UI to show invitation sent
        setFriends(prev => prev.map(friend => 
          friend.id === friendId 
            ? { ...friend, invitationSent: true }
            : friend
        ));
      }
    } catch (error) {
      console.error('Error inviting friend:', error);
    }
  };

  const handleJoinMission = async (missionId: string) => {
    try {
      const response = await socialAPI.joinMission(missionId);
      if (response.data.success) {
        // Update UI to show user joined
        setCollaborativeMissions(prev => prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, isJoined: true, participants: [...(mission.participants || []), user?.id] }
            : mission
        ));
      }
    } catch (error) {
      console.error('Error joining mission:', error);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8" />
                {t('social')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('connect_with_friends_and_compete')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search_friends')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('add_friends')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="friends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends">{t('friends')}</TabsTrigger>
            <TabsTrigger value="leaderboard">{t('leaderboard')}</TabsTrigger>
            <TabsTrigger value="missions">{t('collaborative_missions')}</TabsTrigger>
            <TabsTrigger value="activity">{t('activity')}</TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t('your_friends')} ({filteredFriends.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-qic-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredFriends.map((friend) => (
                          <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={friend.avatar_url} />
                                <AvatarFallback>
                                  {friend.username?.charAt(0)?.toUpperCase() || 'F'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{friend.username || friend.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Level {friend.level} • {friend.lifescore} LifeScore
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {friend.current_streak || 0} {t('day_streak')}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInviteFriend(friend.id)}
                                disabled={friend.invitationSent}
                              >
                                {friend.invitationSent ? (
                                  <>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    {t('invited')}
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    {t('invite')}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {t('your_stats')}
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
                      <Star className="h-5 w-5" />
                      {t('recent_achievements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockData.achievements?.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-qic-gold/10">
                          <Trophy className="h-4 w-4 text-qic-gold" />
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
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  {t('global_leaderboard')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      player.id === user?.id ? 'bg-qic-primary/10 border border-qic-primary/20' : 'bg-muted/50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-qic-primary text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={player.avatar_url} />
                          <AvatarFallback>
                            {player.username?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {player.username || player.name}
                            {index < 3 && <Crown className="h-4 w-4 text-qic-gold" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Level {player.level} • {player.lifescore} LifeScore
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{player.lifescore}</p>
                          <p className="text-sm text-muted-foreground">{t('lifescore')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{player.xp}</p>
                          <p className="text-sm text-muted-foreground">XP</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium flex items-center gap-1">
                            <Flame className="h-4 w-4 text-qic-streak" />
                            {player.current_streak || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('streak')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaborative Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collaborativeMissions.map((mission) => (
                <Card key={mission.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {mission.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{mission.difficulty}</Badge>
                      <Badge variant="secondary">
                        {mission.participants?.length || 0} {t('participants')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('progress')}</span>
                        <span>{mission.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-qic-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mission.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-qic-gold" />
                        <span className="text-sm">+{mission.xp_reward} XP</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinMission(mission.id)}
                        disabled={mission.isJoined}
                      >
                        {mission.isJoined ? (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {t('joined')}
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t('join')}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('recent_activity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.activityFeed?.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar_url} />
                        <AvatarFallback>
                          {activity.user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.username}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Share2 className="h-4 w-4" />
                      </Button>
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

export default Social;
