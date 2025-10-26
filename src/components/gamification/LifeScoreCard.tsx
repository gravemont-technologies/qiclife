// QIC Gamified Insurance App - LifeScore Card Component
// Displays user's LifeScore with circular progress and animated counter

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLifeScore, getLifeScoreColor, getLifeScoreLabel } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LifeScoreCardProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
}

export const LifeScoreCard: React.FC<LifeScoreCardProps> = ({
  size = 'md',
  showProgress = true,
  animated = true,
  className
}) => {
  const { lifescore, updateLifeScore } = useLifeScore();
  const { t } = useTranslation();
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate score change
  useEffect(() => {
    if (animated && lifescore !== displayScore) {
      setIsAnimating(true);
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startScore = displayScore;
      const targetScore = lifescore;
      const difference = targetScore - startScore;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScore = Math.round(startScore + (difference * easeOut));
        
        setDisplayScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(targetScore);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayScore(lifescore);
    }
  }, [lifescore, animated, displayScore]);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
    xl: 'w-56 h-56'
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  const progressPercentage = (displayScore / 1000) * 100;
  const color = getLifeScoreColor(displayScore);
  const label = getLifeScoreLabel(displayScore);

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t('gamification.lifescore')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {/* Circular Progress */}
        <div className={cn('relative', sizeClasses[size])}>
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
              className={cn(
                'transition-all duration-1000 ease-out',
                isAnimating && 'animate-pulse'
              )}
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`
              }}
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn('font-bold text-primary', textSizeClasses[size])}>
              {displayScore}
            </div>
            <div className="text-xs text-muted-foreground">
              / 1000
            </div>
          </div>
        </div>

        {/* Label and Badge */}
        <div className="flex flex-col items-center space-y-2">
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {label}
          </Badge>
          
          {showProgress && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                style={{
                  '--progress-background': color
                } as React.CSSProperties}
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => updateLifeScore(10)}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            +10
          </button>
          <button
            onClick={() => updateLifeScore(-10)}
            className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            -10
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeScoreCard;
