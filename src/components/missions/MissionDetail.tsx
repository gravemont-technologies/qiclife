import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Target,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MissionDetailProps {
  mission: Mission;
  onStart?: (missionId: string) => void;
  onComplete?: (missionId: string) => void;
  isActive?: boolean;
  isCompleted?: boolean;
  progress?: number;
  className?: string;
}

const MissionDetail: React.FC<MissionDetailProps> = ({
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
        return <Car className="h-6 w-6" />;
      case MissionCategory.Health:
        return <Heart className="h-6 w-6" />;
      case MissionCategory.FinancialGuardian:
        return <Shield className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
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
    if (mission.xp_reward >= 200) return <Trophy className="h-5 w-5" />;
    if (mission.xp_reward >= 100) return <Star className="h-5 w-5" />;
    return <Zap className="h-5 w-5" />;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Mission Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-qic-primary/10 text-qic-primary">
                {getCategoryIcon(mission.category)}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {t('language') === 'ar' ? mission.title_ar : mission.title_en}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getDifficultyColor(mission.difficulty)}>
                    {t(`mission_difficulty.${mission.difficulty}`)}
                  </Badge>
                  {mission.is_collaborative && (
                    <Badge variant="outline" className="text-sm">
                      <Users className="h-3 w-3 mr-1" />
                      {t('collaborative')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-lg font-semibold text-qic-accent">
                <Heart className="h-5 w-5" />
                <span>+{mission.lifescore_impact}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{mission.duration_days} {t('days')}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t('language') === 'ar' ? mission.description_ar : mission.description_en}
          </p>
        </CardContent>
      </Card>

      {/* Progress Section */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>{t('progress')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{t('completion')}</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('started')}</span>
                <span>{t('target_completion')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>{t('rewards')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-qic-xp/10">
              {getRewardIcon()}
              <div>
                <p className="font-semibold">{mission.xp_reward} XP</p>
                <p className="text-sm text-muted-foreground">{t('experience_points')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-qic-accent/10">
              <Heart className="h-5 w-5 text-qic-accent" />
              <div>
                <p className="font-semibold text-qic-accent">+{mission.lifescore_impact}</p>
                <p className="text-sm text-muted-foreground">{t('lifescore_boost')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Section */}
      {mission.requirements && Object.keys(mission.requirements).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{t('requirements')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mission.requirements).map(([key, value], index) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold",
                      typeof value === 'boolean' && value 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {typeof value === 'boolean' ? (value ? '✓' : '○') : index + 1}
                    </div>
                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {typeof value === 'boolean' ? (value ? t('completed') : t('pending')) : value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collaborative Info */}
      {mission.is_collaborative && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{t('collaborative_mission')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{t('max_participants')}: {mission.max_participants}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{t('duration')}: {mission.duration_days} {t('days')}</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {t('collaborative_mission_info')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {isCompleted ? (
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-base">
            <Trophy className="h-4 w-4 mr-2" />
            {t('mission_completed')}
          </Badge>
        ) : isActive ? (
          <Button 
            size="lg" 
            onClick={() => onComplete?.(mission.id)}
            className="bg-qic-accent hover:bg-qic-accent/90 px-8"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {t('complete_mission')}
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={() => onStart?.(mission.id)}
            className="bg-qic-primary hover:bg-qic-primary/90 px-8"
          >
            <Star className="h-5 w-5 mr-2" />
            {t('start_mission')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionDetail;
