import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { RewardCard } from "@/components/RewardCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { Coins } from "lucide-react";

const Rewards = () => {
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data.data;
    },
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const res = await apiClient.getRewards();
      return res.data.data.rewards;
    },
  });

  const { data: redemptions, refetch: refetchRedemptions } = useQuery({
    queryKey: ["redemptions"],
    queryFn: async () => {
      const res = await apiClient.getRedemptions();
      return res.data.data.redemptions;
    },
  });

  const handleRedeem = async (id: string) => {
    try {
      await apiClient.redeemReward(id);
      toast.success("Reward redeemed successfully!");
      refetchProfile();
      refetchRedemptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to redeem reward");
    }
  };

  const categories = rewards ? [...new Set(rewards.map((r: any) => r.category))] : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rewards Marketplace</h1>
          <p className="text-muted-foreground">Redeem your coins for amazing rewards</p>
        </div>

        <div className="max-w-sm mb-8">
          <StatCard
            title="Available Coins"
            value={profile?.coins || 0}
            icon={Coins}
            variant="gold"
            subtitle="Ready to spend"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Rewards</TabsTrigger>
            {categories.map((cat: string) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
            <TabsTrigger value="history">Redemption History</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards?.map((reward: any) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userCoins={profile?.coins || 0}
                  onRedeem={handleRedeem}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map((cat: string) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards
                  ?.filter((r: any) => r.category === cat)
                  .map((reward: any) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userCoins={profile?.coins || 0}
                      onRedeem={handleRedeem}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="history">
            {redemptions && redemptions.length > 0 ? (
              <div className="space-y-4">
                {redemptions.map((redemption: any) => (
                  <div
                    key={redemption.id}
                    className="p-6 bg-card rounded-xl border border-border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{redemption.rewardName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Status: <span className="font-medium capitalize">{redemption.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{redemption.coinCost}</p>
                        <p className="text-xs text-muted-foreground">coins</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No redemption history yet. Start redeeming rewards to see them here!
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rewards;
