// QIC Gamified Insurance App - Badge Icon Component
// Displays individual badges with rarity indicators and animations

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { BadgeRarity } from '@/types';

interface BadgeIconProps {
  icon: string;
  title: string;
  description?: string;
  rarity: BadgeRarity;
  earned?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTooltip?: boolean;
  onClick?: () => void;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  icon,
  title,
  description,
  rarity,
  earned = false,
  animated = true,
  size = 'md',
  className,
  showTooltip = true,
  onClick
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const getRarityColor = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common':
        return 'hsl(var(--qic-badge-common))';
      case 'rare':
        return 'hsl(var(--qic-badge-rare))';
      case 'epic':
        return 'hsl(var(--qic-badge-epic))';
      case 'legendary':
        return 'hsl(var(--qic-badge-legendary))';
      default:
        return 'hsl(var(--qic-badge-common))';
    }
  };

  const getRarityGlow = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common':
        return 'shadow-sm';
      case 'rare':
        return 'shadow-md shadow-blue-500/20';
      case 'epic':
        return 'shadow-lg shadow-purple-500/30';
      case 'legendary':
        return 'shadow-xl shadow-orange-500/40';
      default:
        return 'shadow-sm';
    }
  };

  const getRarityAnimation = (rarity: BadgeRarity): string => {
    if (!animated) return '';
    
    switch (rarity) {
      case 'rare':
        return 'animate-pulse';
      case 'epic':
        return 'animate-bounce';
      case 'legendary':
        return 'animate-ping';
      default:
        return '';
    }
  };

  const getRarityIcon = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common':
        return '🥉';
      case 'rare':
        return '🥈';
      case 'epic':
        return '🥇';
      case 'legendary':
        return '💎';
      default:
        return '🏆';
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const badgeContent = (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer',
        sizeClasses[size],
        earned ? 'opacity-100' : 'opacity-50',
        earned && getRarityGlow(rarity),
        earned && getRarityAnimation(rarity),
        isHovered && 'scale-110',
        onClick && 'hover:scale-105',
        className
      )}
      style={{
        backgroundColor: earned ? getRarityColor(rarity) : 'hsl(var(--muted))',
        borderColor: earned ? getRarityColor(rarity) : 'hsl(var(--border))',
        color: earned ? 'white' : 'hsl(var(--muted-foreground))'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Badge Icon */}
      <span className="text-center">
        {icon}
      </span>
      
      {/* Rarity Indicator */}
      {earned && (
        <div className="absolute -top-1 -right-1 text-xs">
          {getRarityIcon(rarity)}
        </div>
      )}
      
      {/* Lock Icon for unearned badges */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
          <span className="text-xs">🔒</span>
        </div>
      )}
    </div>
  );

  if (showTooltip && (earned || description)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="font-medium">{title}</div>
              {description && (
                <div className="text-xs text-muted-foreground">
                  {description}
                </div>
              )}
              <div className="flex items-center space-x-1">
                <span className="text-xs">{getRarityIcon(rarity)}</span>
                <span className="text-xs capitalize">{rarity}</span>
              </div>
              {!earned && (
                <div className="text-xs text-muted-foreground">
                  {t('gamification.locked')}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
};

// Badge Collection Component
interface BadgeCollectionProps {
  badges: Array<{
    id: string;
    icon: string;
    title: string;
    description?: string;
    rarity: BadgeRarity;
    earned: boolean;
  }>;
  onBadgeClick?: (badgeId: string) => void;
  className?: string;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  onBadgeClick,
  className
}) => {
  const { t } = useTranslation();

  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('gamification.badges')}</h3>
            <Badge variant="secondary" className="text-xs">
              {earnedBadges.length} / {badges.length}
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeIcon
                key={badge.id}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
                rarity={badge.rarity}
                earned={badge.earned}
                onClick={() => onBadgeClick?.(badge.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('gamification.locked')}
            </h3>
            <Badge variant="outline" className="text-xs">
              {lockedBadges.length}
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeIcon
                key={badge.id}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
                rarity={badge.rarity}
                earned={badge.earned}
                onClick={() => onBadgeClick?.(badge.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {badges.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-sm text-muted-foreground">
            {t('gamification.noBadges')}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeIcon;
