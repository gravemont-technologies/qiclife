// QIC Gamified Insurance App - Level Indicator Component
// Displays user's current level with progress and next level preview

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useXP, getXPToNextLevel, getLevelProgress } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LevelIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showNextLevel?: boolean;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  size = 'md',
  showProgress = true,
  animated = true,
  className,
  variant = 'default',
  showNextLevel = false
}) => {
  const { xp, level, updateXP } = useXP();
  const { t } = useTranslation();
  const [displayLevel, setDisplayLevel] = useState(level);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const xpToNextLevel = getXPToNextLevel(xp);
  const levelProgress = getLevelProgress(xp);
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;

  // Animate level change
  useEffect(() => {
    if (animated && level !== displayLevel) {
      setIsAnimating(true);
      setShowLevelUp(true);
      
      // Show level up celebration
      setTimeout(() => setShowLevelUp(false), 2000);
      
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startLevel = displayLevel;
      const targetLevel = level;
      const difference = targetLevel - startLevel;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentLevel = Math.round(startLevel + (difference * easeOut));
        
        setDisplayLevel(currentLevel);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayLevel(targetLevel);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayLevel(level);
    }
  }, [level, animated, displayLevel]);

  const getLevelColor = (level: number): string => {
    if (level >= 50) return 'hsl(var(--qic-badge-legendary))';
    if (level >= 25) return 'hsl(var(--qic-badge-epic))';
    if (level >= 10) return 'hsl(var(--qic-badge-rare))';
    return 'hsl(var(--qic-badge-common))';
  };

  const getLevelTitle = (level: number): string => {
    if (level >= 50) return 'Master';
    if (level >= 25) return 'Expert';
    if (level >= 10) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    return 'Beginner';
  };

  const getLevelIcon = (level: number): string => {
    if (level >= 50) return '👑';
    if (level >= 25) return '⭐';
    if (level >= 10) return '🌟';
    if (level >= 5) return '⭐';
    return '🌱';
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <span className={cn(
          sizeClasses[size],
          isAnimating && 'animate-bounce',
          showLevelUp && 'animate-pulse text-yellow-500'
        )}>
          {getLevelIcon(displayLevel)}
        </span>
        <div className="flex items-center space-x-1">
          <span className={cn(
            'font-bold',
            isAnimating && 'animate-pulse',
            showLevelUp && 'text-yellow-500'
          )}>
            {displayLevel}
          </span>
          {showProgress && (
            <span className="text-xs text-muted-foreground">
              ({Math.round(levelProgress)}%)
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t('gamification.level')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level Display */}
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              'relative',
              sizeClasses[size],
              isAnimating && 'animate-bounce',
              showLevelUp && 'animate-pulse text-yellow-500'
            )}>
              {getLevelIcon(displayLevel)}
              {showLevelUp && (
                <div className="absolute -top-2 -right-2 text-lg animate-ping text-yellow-500">
                  ⬆️
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={cn(
                'text-2xl font-bold',
                isAnimating && 'animate-pulse',
                showLevelUp && 'text-yellow-500'
              )}>
                Level {displayLevel}
              </div>
              <div className="text-xs text-muted-foreground">
                {getLevelTitle(displayLevel)}
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: getLevelColor(displayLevel), 
                color: 'white' 
              }}
            >
              {getLevelTitle(displayLevel)}
            </Badge>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {displayLevel + 1}</span>
                <span className={cn('font-medium', isAnimating && 'animate-pulse')}>
                  {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
                </span>
              </div>
              <Progress 
                value={levelProgress} 
                className="h-3"
                style={{
                  '--progress-background': getLevelColor(displayLevel)
                } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level {displayLevel}</span>
                <span>Level {displayLevel + 1}</span>
              </div>
            </div>
          )}

          {/* Level Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total XP</div>
              <div className="font-medium">{xp.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">XP to Next Level</div>
              <div className="font-medium">{xpToNextLevel}</div>
            </div>
          </div>

          {/* Next Level Preview */}
          {showNextLevel && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Next Level Preview</div>
              <div className="text-sm font-medium">
                Level {displayLevel + 1} - {getLevelTitle(displayLevel + 1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {getLevelIcon(displayLevel + 1)} {getLevelTitle(displayLevel + 1)}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => updateXP(100)}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              +100 XP
            </button>
            <button
              onClick={() => updateXP(500)}
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              +500 XP
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
              showLevelUp && 'animate-pulse text-yellow-500'
            )}>
              {getLevelIcon(displayLevel)}
            </span>
            <div>
              <div className={cn(
                'text-lg font-bold',
                isAnimating && 'animate-pulse',
                showLevelUp && 'text-yellow-500'
              )}>
                Level {displayLevel}
              </div>
              <div className="text-xs text-muted-foreground">
                {getLevelTitle(displayLevel)}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge 
              variant="outline" 
              className="text-xs mb-1"
              style={{ 
                borderColor: getLevelColor(displayLevel),
                color: getLevelColor(displayLevel)
              }}
            >
              {getLevelTitle(displayLevel)}
            </Badge>
            {showProgress && (
              <div className="text-xs text-muted-foreground">
                {Math.round(levelProgress)}% to next
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelIndicator;
