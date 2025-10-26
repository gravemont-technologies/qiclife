import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/contexts/LanguageContext';
import { Mission, MissionDifficulty, MissionCategory } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Car, 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  Star,
  Trophy,
  Zap,
  UserPlus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CollaborativeMissionCardProps {
  mission: Mission;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
    progress: number;
    isLeader?: boolean;
  }>;
  onJoin?: (missionId: string) => void;
  onLeave?: (missionId: string) => void;
  onInvite?: (missionId: string) => void;
  isJoined?: boolean;
  isLeader?: boolean;
  overallProgress?: number;
  className?: string;
}

const CollaborativeMissionCard: React.FC<CollaborativeMissionCardProps> = ({
  mission,
  participants = [],
  onJoin,
  onLeave,
  onInvite,
  isJoined = false,
  isLeader = false,
  overallProgress = 0,
  className
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (category: MissionCategory) => {
    switch (category) {
      case MissionCategory.SafeDriving:
        return <Car className="h-5 w-5" />;
      case MissionCategory.Health:
        return <Heart className="h-5 w-5" />;
      case MissionCategory.FinancialGuardian:
        return <Shield className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    switch (difficulty) {
      case MissionDifficulty.Easy:
        return 'bg-green-100 text-green-800 border-green-200';
      case MissionDifficulty.Medium:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case MissionDifficulty.Hard:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case MissionDifficulty.Epic:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRewardIcon = () => {
    if (mission.xp_reward >= 200) return <Trophy className="h-4 w-4" />;
    if (mission.xp_reward >= 100) return <Star className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const availableSlots = mission.max_participants - participants.length;
  const isFull = availableSlots <= 0;

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-lg",
      isJoined && "ring-2 ring-qic-primary",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-qic-primary/10 text-qic-primary">
              {getCategoryIcon(mission.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {t(`mission_categories.${mission.category}`)}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getDifficultyColor(mission.difficulty)}>
                  {t(`mission_difficulty.${mission.difficulty}`)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {t('collaborative')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{mission.duration_days} {t('days')}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {participants.length}/{mission.max_participants} {t('participants')}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-2">
            {t('language') === 'ar' ? mission.title_ar : mission.title_en}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('language') === 'ar' ? mission.description_ar : mission.description_en}
          </p>
        </div>

        {/* Participants Section */}
        {participants.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{t('participants')}</h4>
              <span className="text-xs text-muted-foreground">
                {overallProgress}% {t('complete')}
              </span>
            </div>
            
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>
                      {participant.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate">
                        {participant.name}
                      </span>
                      {participant.isLeader && (
                        <Badge variant="outline" className="text-xs">
                          {t('leader')}
                        </Badge>
                      )}
                    </div>
                    <Progress value={participant.progress} className="h-1 mt-1" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {participant.progress}%
                  </span>
                </div>
              ))}
            </div>

            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* Rewards Section */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {getRewardIcon()}
              <span className="text-sm font-medium">{mission.xp_reward} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-qic-accent" />
              <span className="text-sm font-medium text-qic-accent">
                +{mission.lifescore_impact}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {t('per_participant')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isJoined ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                {t('joined')}
              </Badge>
            ) : (
              <Badge variant="outline">
                {t('available')}
              </Badge>
            )}
            
            {isLeader && (
              <Badge className="bg-qic-primary text-white">
                {t('leader')}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isJoined ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onLeave?.(mission.id)}
                className="text-red-600 hover:text-red-700"
              >
                {t('leave')}
              </Button>
            ) : isFull ? (
              <Button 
                size="sm" 
                disabled
                className="opacity-50"
              >
                {t('full')}
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={() => onJoin?.(mission.id)}
                className="bg-qic-primary hover:bg-qic-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {t('join')}
              </Button>
            )}

            {isLeader && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onInvite?.(mission.id)}
              >
                <Users className="h-4 w-4 mr-1" />
                {t('invite')}
              </Button>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {isFull && !isJoined && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                {t('mission_full_message')}
              </p>
            </div>
          </div>
        )}

        {availableSlots > 0 && availableSlots <= 2 && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">
                {t('limited_spots_message', { count: availableSlots })}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaborativeMissionCard;
