// QIC Gamified Insurance App - Streak Display Component
// Displays user's current streak with fire icon and animated counter

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStreak } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  size = 'md',
  showLabel = true,
  animated = true,
  className,
  variant = 'default'
}) => {
  const { streak, updateStreak } = useStreak();
  const { t } = useTranslation();
  const [displayStreak, setDisplayStreak] = useState(streak);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animate streak change
  useEffect(() => {
    if (animated && streak !== displayStreak) {
      setIsAnimating(true);
      
      // Show celebration for milestone streaks
      if (streak > displayStreak && (streak === 7 || streak === 30 || streak === 100)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startStreak = displayStreak;
      const targetStreak = streak;
      const difference = targetStreak - startStreak;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentStreak = Math.round(startStreak + (difference * easeOut));
        
        setDisplayStreak(currentStreak);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayStreak(targetStreak);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayStreak(streak);
    }
  }, [streak, animated, displayStreak]);

  const getStreakColor = (streak: number): string => {
    if (streak >= 100) return 'hsl(var(--qic-badge-legendary))';
    if (streak >= 30) return 'hsl(var(--qic-badge-epic))';
    if (streak >= 7) return 'hsl(var(--qic-badge-rare))';
    return 'hsl(var(--qic-badge-common))';
  };

  const getStreakLabel = (streak: number): string => {
    if (streak >= 100) return 'Legendary';
    if (streak >= 30) return 'Epic';
    if (streak >= 7) return 'Hot Streak';
    if (streak >= 3) return 'Getting Started';
    return 'New';
  };

  const getFireEmoji = (streak: number): string => {
    if (streak >= 100) return '🔥🔥🔥';
    if (streak >= 30) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '💫';
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <span className={cn(sizeClasses[size], isAnimating && 'animate-bounce')}>
          {getFireEmoji(displayStreak)}
        </span>
        <span className={cn('font-bold', isAnimating && 'animate-pulse')}>
          {displayStreak}
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">
            {t('gamification.streak')}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t('gamification.streak')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Streak Display */}
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              'relative',
              sizeClasses[size],
              isAnimating && 'animate-bounce',
              showCelebration && 'animate-pulse'
            )}>
              {getFireEmoji(displayStreak)}
              {showCelebration && (
                <div className="absolute -top-2 -right-2 text-lg animate-ping">
                  ✨
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={cn(
                'text-2xl font-bold',
                isAnimating && 'animate-pulse'
              )}>
                {displayStreak}
              </div>
              <div className="text-xs text-muted-foreground">
                {displayStreak === 1 ? 'day' : 'days'} in a row
              </div>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: getStreakColor(displayStreak), 
                color: 'white' 
              }}
            >
              {getStreakLabel(displayStreak)}
            </Badge>
          </div>

          {/* Streak Milestones */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Next Milestones:</div>
            <div className="flex justify-between text-xs">
              <span className={displayStreak >= 7 ? 'text-green-600' : 'text-muted-foreground'}>
                7 days 🔥
              </span>
              <span className={displayStreak >= 30 ? 'text-green-600' : 'text-muted-foreground'}>
                30 days 🔥🔥
              </span>
              <span className={displayStreak >= 100 ? 'text-green-600' : 'text-muted-foreground'}>
                100 days 🔥🔥🔥
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => updateStreak(true)}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              +1 Day
            </button>
            <button
              onClick={() => updateStreak(false)}
              className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Reset
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn(
              sizeClasses[size],
              isAnimating && 'animate-bounce',
              showCelebration && 'animate-pulse'
            )}>
              {getFireEmoji(displayStreak)}
            </span>
            <div>
              <div className={cn(
                'text-lg font-bold',
                isAnimating && 'animate-pulse'
              )}>
                {displayStreak}
              </div>
              {showLabel && (
                <div className="text-xs text-muted-foreground">
                  {t('gamification.streak')}
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              borderColor: getStreakColor(displayStreak),
              color: getStreakColor(displayStreak)
            }}
          >
            {getStreakLabel(displayStreak)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
