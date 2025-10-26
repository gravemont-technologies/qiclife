// QIC Gamified Insurance App - XP Progress Bar Component
// Displays user's XP progress with level indicator and animated progress bar

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useXP, getXPToNextLevel, getLevelProgress } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
  showLevel?: boolean;
  animated?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  showLevel = true,
  animated = true,
  className,
  variant = 'default'
}) => {
  const { xp, level, updateXP } = useXP();
  const { t } = useTranslation();
  const [displayXP, setDisplayXP] = useState(xp);
  const [isAnimating, setIsAnimating] = useState(false);

  const xpToNextLevel = getXPToNextLevel(displayXP);
  const levelProgress = getLevelProgress(displayXP);
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;

  // Animate XP change
  useEffect(() => {
    if (animated && xp !== displayXP) {
      setIsAnimating(true);
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startXP = displayXP;
      const targetXP = xp;
      const difference = targetXP - startXP;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentXP = Math.round(startXP + (difference * easeOut));
        
        setDisplayXP(currentXP);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayXP(targetXP);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayXP(xp);
    }
  }, [xp, animated, displayXP]);

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {showLevel && (
          <Badge variant="outline" className="text-xs">
            Lv. {level}
          </Badge>
        )}
        <div className="flex-1 min-w-0">
          <Progress 
            value={levelProgress} 
            className="h-2"
            style={{
              '--progress-background': 'hsl(var(--qic-xp))'
            } as React.CSSProperties}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {displayXP - currentLevelXP}/{nextLevelXP - currentLevelXP} XP
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {t('gamification.xp')} & {t('gamification.level')}
            </CardTitle>
            {showLevel && (
              <Badge variant="secondary" className="text-xs">
                Level {level}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span className={cn('font-medium', isAnimating && 'animate-pulse')}>
                {displayXP - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
              </span>
            </div>
            <Progress 
              value={levelProgress} 
              className="h-3"
              style={{
                '--progress-background': 'hsl(var(--qic-xp))'
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
          </div>

          {/* XP Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total XP</div>
              <div className="font-medium">{displayXP.toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">XP to Next Level</div>
              <div className="font-medium">{xpToNextLevel}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => updateXP(50)}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              +50 XP
            </button>
            <button
              onClick={() => updateXP(100)}
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              +100 XP
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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{t('gamification.xp')}</span>
            {showLevel && (
              <Badge variant="outline" className="text-xs">
                Lv. {level}
              </Badge>
            )}
          </div>
          <span className={cn('text-sm text-muted-foreground', isAnimating && 'animate-pulse')}>
            {displayXP.toLocaleString()} XP
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {level}</span>
            <span>{xpToNextLevel} to next level</span>
          </div>
          <Progress 
            value={levelProgress} 
            className="h-2"
            style={{
              '--progress-background': 'hsl(var(--qic-xp))'
            } as React.CSSProperties}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default XPProgressBar;
