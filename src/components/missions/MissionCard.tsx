import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Zap
} from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onStart?: (missionId: string) => void;
  onComplete?: (missionId: string) => void;
  isActive?: boolean;
  isCompleted?: boolean;
  progress?: number;
  className?: string;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onStart,
  onComplete,
  isActive = false,
  isCompleted = false,
  progress = 0,
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

  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-lg",
      isActive && "ring-2 ring-qic-primary",
      isCompleted && "opacity-75",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-qic-primary/10 text-qic-primary">
              {getCategoryIcon(mission.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {t(`mission_categories.${mission.category}`)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {mission.duration_days} {t('days')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getDifficultyColor(mission.difficulty)}>
              {t(`mission_difficulty.${mission.difficulty}`)}
            </Badge>
            {mission.is_collaborative && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {t('collaborative')}
              </Badge>
            )}
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

        {isActive && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('progress')}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              {getRewardIcon()}
              <span className="font-medium">{mission.xp_reward} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-qic-accent" />
              <span className="font-medium text-qic-accent">
                +{mission.lifescore_impact}
              </span>
            </div>
            {mission.is_collaborative && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-qic-secondary" />
                <span className="text-qic-secondary">
                  {mission.max_participants} {t('participants')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Trophy className="h-3 w-3 mr-1" />
                {t('completed')}
              </Badge>
            ) : isActive ? (
              <Button 
                size="sm" 
                onClick={() => onComplete?.(mission.id)}
                className="bg-qic-accent hover:bg-qic-accent/90"
              >
                {t('complete')}
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={() => onStart?.(mission.id)}
                className="bg-qic-primary hover:bg-qic-primary/90"
              >
                {t('start')}
              </Button>
            )}
          </div>
        </div>

        {mission.requirements && Object.keys(mission.requirements).length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">{t('requirements')}:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(mission.requirements).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
