// QIC Gamified Insurance App - Coin Counter Component
// Displays user's coin balance with animated counter and spending options

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCoins } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CoinCounterProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
}

export const CoinCounter: React.FC<CoinCounterProps> = ({
  size = 'md',
  showLabel = true,
  animated = true,
  className,
  variant = 'default',
  showActions = false
}) => {
  const { coins, updateCoins } = useCoins();
  const { t } = useTranslation();
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGain, setShowGain] = useState(false);
  const [showSpend, setShowSpend] = useState(false);

  // Animate coin change
  useEffect(() => {
    if (animated && coins !== displayCoins) {
      setIsAnimating(true);
      
      // Show gain/spend animation
      if (coins > displayCoins) {
        setShowGain(true);
        setTimeout(() => setShowGain(false), 1000);
      } else if (coins < displayCoins) {
        setShowSpend(true);
        setTimeout(() => setShowSpend(false), 1000);
      }
      
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startCoins = displayCoins;
      const targetCoins = coins;
      const difference = targetCoins - startCoins;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCoins = Math.round(startCoins + (difference * easeOut));
        
        setDisplayCoins(currentCoins);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayCoins(targetCoins);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayCoins(coins);
    }
  }, [coins, animated, displayCoins]);

  const getCoinEmoji = (amount: number): string => {
    if (amount >= 1000) return '💰';
    if (amount >= 500) return '🪙';
    if (amount >= 100) return '🪙';
    return '🪙';
  };

  const getCoinColor = (amount: number): string => {
    if (amount >= 1000) return 'hsl(var(--qic-badge-legendary))';
    if (amount >= 500) return 'hsl(var(--qic-badge-epic))';
    if (amount >= 100) return 'hsl(var(--qic-badge-rare))';
    return 'hsl(var(--qic-badge-common))';
  };

  const getCoinLabel = (amount: number): string => {
    if (amount >= 1000) return 'Rich';
    if (amount >= 500) return 'Wealthy';
    if (amount >= 100) return 'Comfortable';
    if (amount >= 50) return 'Getting There';
    return 'Starting Out';
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
          showGain && 'animate-pulse text-green-600',
          showSpend && 'animate-pulse text-red-600'
        )}>
          {getCoinEmoji(displayCoins)}
        </span>
        <span className={cn(
          'font-bold',
          isAnimating && 'animate-pulse',
          showGain && 'text-green-600',
          showSpend && 'text-red-600'
        )}>
          {displayCoins.toLocaleString()}
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">
            {t('gamification.coins')}
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
            {t('gamification.coins')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coin Display */}
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              'relative',
              sizeClasses[size],
              isAnimating && 'animate-bounce',
              showGain && 'animate-pulse text-green-600',
              showSpend && 'animate-pulse text-red-600'
            )}>
              {getCoinEmoji(displayCoins)}
              {showGain && (
                <div className="absolute -top-2 -right-2 text-lg animate-ping text-green-600">
                  +{coins - displayCoins}
                </div>
              )}
              {showSpend && (
                <div className="absolute -top-2 -right-2 text-lg animate-ping text-red-600">
                  -{displayCoins - coins}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={cn(
                'text-2xl font-bold',
                isAnimating && 'animate-pulse',
                showGain && 'text-green-600',
                showSpend && 'text-red-600'
              )}>
                {displayCoins.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('gamification.coins')}
              </div>
            </div>
          </div>

          {/* Coin Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: getCoinColor(displayCoins), 
                color: 'white' 
              }}
            >
              {getCoinLabel(displayCoins)}
            </Badge>
          </div>

          {/* Coin Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Earned</div>
              <div className="font-medium">{(displayCoins * 1.5).toLocaleString()}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Spent</div>
              <div className="font-medium">{(displayCoins * 0.5).toLocaleString()}</div>
            </div>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => updateCoins(50)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                +50 Coins
              </Button>
              <Button
                onClick={() => updateCoins(-50)}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={displayCoins < 50}
              >
                -50 Coins
              </Button>
            </div>
          )}
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
              showGain && 'animate-pulse text-green-600',
              showSpend && 'animate-pulse text-red-600'
            )}>
              {getCoinEmoji(displayCoins)}
            </span>
            <div>
              <div className={cn(
                'text-lg font-bold',
                isAnimating && 'animate-pulse',
                showGain && 'text-green-600',
                showSpend && 'text-red-600'
              )}>
                {displayCoins.toLocaleString()}
              </div>
              {showLabel && (
                <div className="text-xs text-muted-foreground">
                  {t('gamification.coins')}
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              borderColor: getCoinColor(displayCoins),
              color: getCoinColor(displayCoins)
            }}
          >
            {getCoinLabel(displayCoins)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCounter;
