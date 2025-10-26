import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ShoppingBag } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  category: string;
  coinCost: number;
  availability: string;
  terms?: string;
}

interface RewardCardProps {
  reward: Reward;
  userCoins: number;
  onRedeem?: (id: string) => void;
}

export const RewardCard = ({ reward, userCoins, onRedeem }: RewardCardProps) => {
  const canAfford = userCoins >= reward.coinCost;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-card-hover">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">{reward.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="capitalize">
            {reward.category}
          </Badge>
          <Badge variant="outline">{reward.availability}</Badge>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-gold">
              <Coins className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reward.coinCost}</p>
              <p className="text-xs text-muted-foreground">coins</p>
            </div>
          </div>

          <Button 
            onClick={() => onRedeem?.(reward.id)}
            disabled={!canAfford}
            variant={canAfford ? "default" : "outline"}
          >
            {canAfford ? "Redeem" : "Not Enough Coins"}
          </Button>
        </div>

        {reward.terms && (
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            {reward.terms}
          </p>
        )}
      </div>
    </Card>
  );
};
