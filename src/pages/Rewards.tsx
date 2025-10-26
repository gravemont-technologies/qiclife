import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { rewardsAPI } from '@/lib/api';
import { mockData } from '@/data/mockData';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import CoinCounter from '@/components/gamification/CoinCounter';
import { 
  Gift, 
  Trophy, 
  Star, 
  Coins,
  ShoppingBag,
  Award,
  Crown,
  Zap,
  Target,
  Loader2,
  Search,
  Filter
} from 'lucide-react';

const Rewards: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateCoins } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rewards, setRewards] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [partnerOffers, setPartnerOffers] = useState<any[]>([]);
  const [userRewards, setUserRewards] = useState<any[]>([]);

  // Load rewards data on mount
  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    try {
      setIsLoading(true);
      const [rewardsResponse, badgesResponse, offersResponse, userRewardsResponse] = await Promise.all([
        rewardsAPI.getAll(),
        rewardsAPI.getBadges(),
        rewardsAPI.getPartnerOffers(),
        rewardsAPI.getUserRewards()
      ]);

      if (rewardsResponse.data.success) {
        setRewards(rewardsResponse.data.data.rewards || []);
      }
      if (badgesResponse.data.success) {
        setBadges(badgesResponse.data.data.badges || []);
      }
      if (offersResponse.data.success) {
        setPartnerOffers(offersResponse.data.data.offers || []);
      }
      if (userRewardsResponse.data.success) {
        setUserRewards(userRewardsResponse.data.data.rewards || []);
      }
    } catch (error) {
      console.error('Error loading rewards data:', error);
      // Fallback to mock data
      setRewards(mockData.rewards || []);
      setBadges(mockData.badges || []);
      setPartnerOffers(mockData.partnerOffers || []);
      setUserRewards(mockData.userRewards || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await rewardsAPI.redeem(rewardId);
      if (response.data.success) {
        // Update user coins
        if (response.data.data.coins_deducted) {
          updateCoins(-response.data.data.coins_deducted);
        }
        // Update rewards list
        setRewards(prev => prev.map(reward => 
          reward.id === rewardId 
            ? { ...reward, isRedeemed: true, available: false }
            : reward
        ));
        // Add to user rewards
        setUserRewards(prev => [...prev, response.data.data.reward]);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return { variant: 'outline' as const, text: 'Common' };
      case 'rare': return { variant: 'secondary' as const, text: 'Rare' };
      case 'epic': return { variant: 'default' as const, text: 'Epic' };
      case 'legendary': return { variant: 'destructive' as const, text: 'Legendary' };
      default: return { variant: 'outline' as const, text: 'Common' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Gift className="h-8 w-8" />
                {t('rewards')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('redeem_your_coins_for_amazing_rewards')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <CoinCounter />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rewards">{t('rewards')}</TabsTrigger>
            <TabsTrigger value="badges">{t('badges')}</TabsTrigger>
            <TabsTrigger value="offers">{t('partner_offers')}</TabsTrigger>
            <TabsTrigger value="my-rewards">{t('my_rewards')}</TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {t('search_rewards')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder={t('search_rewards')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('all')}
                    >
                      {t('all')}
                    </Button>
                    <Button
                      variant={selectedCategory === 'digital' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('digital')}
                    >
                      {t('digital')}
                    </Button>
                    <Button
                      variant={selectedCategory === 'physical' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('physical')}
                    >
                      {t('physical')}
                    </Button>
                    <Button
                      variant={selectedCategory === 'experiences' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('experiences')}
                    >
                      {t('experiences')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-qic-primary" />
                </div>
              ) : (
                filteredRewards.map((reward) => (
                  <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-qic-gold/10">
                            <Gift className="h-6 w-6 text-qic-gold" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{reward.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        <Badge {...getRarityBadge(reward.rarity)}>
                          {getRarityBadge(reward.rarity).text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-qic-gold" />
                          <span className="font-medium">{reward.coin_cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-qic-primary" />
                          <span className="text-sm">+{reward.xp_reward} XP</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{reward.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {reward.available ? `${reward.stock} left` : 'Out of stock'}
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!reward.available || reward.isRedeemed || user.coins < reward.coin_cost}
                      >
                        {reward.isRedeemed ? (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            {t('redeemed')}
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {t('redeem')}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-4 rounded-full bg-qic-gold/10 w-16 h-16 flex items-center justify-center mb-2">
                      <Award className="h-8 w-8 text-qic-gold" />
                    </div>
                    <CardTitle className="text-lg">{badge.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge {...getRarityBadge(badge.rarity)} className="mb-2">
                      {getRarityBadge(badge.rarity).text}
                    </Badge>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4" />
                      +{badge.xp_reward} XP
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Partner Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-qic-secondary/10">
                          <Crown className="h-6 w-6 text-qic-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{offer.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{offer.partner}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-qic-primary" />
                        <span className="font-medium">{offer.discount}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {offer.valid_until}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-qic-gold" />
                        <span className="text-sm">{offer.requirements}</span>
                      </div>
                      <Button size="sm">
                        {t('claim_offer')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Rewards Tab */}
          <TabsContent value="my-rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-green-100">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{reward.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {reward.redeemed_at}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('status')}</span>
                      <Badge variant="default" className="bg-green-600">
                        {t('redeemed')}
                      </Badge>
                    </div>

                    <Button className="w-full" variant="outline">
                      {t('view_details')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rewards;
