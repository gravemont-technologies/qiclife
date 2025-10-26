import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Coins, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  coinReward: number;
  lifescoreImpact: number;
  difficulty: string;
  estimatedTime: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

interface MissionCardProps {
  mission: Mission;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const difficultyColors = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-accent/10 text-accent-foreground border-accent/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export const MissionCard = ({ mission, onStart, onComplete }: MissionCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-card-hover",
      mission.isActive && "ring-2 ring-primary"
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{mission.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
          </div>
          {mission.isCompleted && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Completed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <Badge variant="outline" className={difficultyColors[mission.difficulty as keyof typeof difficultyColors] || difficultyColors.Medium}>
            {mission.difficulty}
          </Badge>
          <span className="text-muted-foreground">{mission.estimatedTime}</span>
          <span className="text-muted-foreground capitalize">{mission.category}</span>
        </div>

        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-xp">
              <Trophy className="w-4 h-4 text-xp-foreground" />
            </div>
            <span className="font-medium">{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-gold">
              <Coins className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-medium">{mission.coinReward} Coins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-success">
              <TrendingUp className="w-4 h-4 text-success-foreground" />
            </div>
            <span className="font-medium">+{mission.lifescoreImpact} LifeScore</span>
          </div>
        </div>

        {!mission.isCompleted && (
          <Button 
            onClick={() => mission.isActive ? onComplete?.(mission.id) : onStart?.(mission.id)}
            className="w-full"
            variant={mission.isActive ? "default" : "outline"}
          >
            {mission.isActive ? "Complete Mission" : "Start Mission"}
          </Button>
        )}
      </div>
    </Card>
  );
};
