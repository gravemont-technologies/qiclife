import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import { MissionCard } from "@/components/MissionCard";
import { Heart, Trophy, Coins, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await apiClient.getStats();
      return res.data.data;
    },
  });

  const { data: missions, refetch: refetchMissions } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const res = await apiClient.getMissions();
      return res.data.data.missions;
    },
  });

  const handleStartMission = async (id: string) => {
    try {
      await apiClient.startMission(id);
      toast.success("Mission started!");
      refetchMissions();
    } catch (error) {
      toast.error("Failed to start mission");
    }
  };

  const handleCompleteMission = async (id: string) => {
    try {
      const res = await apiClient.completeMission(id);
      toast.success(`Mission completed! +${res.data.data.xpEarned} XP, +${res.data.data.coinsEarned} Coins`);
      refetchMissions();
      refetchProfile();
    } catch (error) {
      toast.error("Failed to complete mission");
    }
  };

  const activeMissions = missions?.filter((m: any) => m.isActive) || [];
  const availableMissions = missions?.filter((m: any) => !m.isActive && !m.isCompleted).slice(0, 3) || [];

  const xpToNextLevel = ((profile?.level || 0) + 1) * 100;
  const xpProgress = ((profile?.totalXP || 0) % 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.name || "User"}!</h1>
          <p className="text-muted-foreground">Your wellness journey continues</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="LifeScore"
            value={profile?.lifescore || 0}
            icon={Heart}
            variant="success"
            subtitle="out of 1000"
            progress={(profile?.lifescore || 0) / 10}
          />
          <StatCard
            title="Level"
            value={profile?.level || 1}
            icon={TrendingUp}
            variant="level"
            subtitle={`${xpProgress}/${xpToNextLevel} XP to next level`}
            progress={xpProgress}
          />
          <StatCard
            title="Total XP"
            value={profile?.totalXP || 0}
            icon={Trophy}
            variant="xp"
            subtitle={`${stats?.missionsCompleted || 0} missions completed`}
          />
          <StatCard
            title="Coins"
            value={profile?.coins || 0}
            icon={Coins}
            variant="gold"
            subtitle="Ready to redeem"
          />
        </div>

        {/* Active Missions */}
        {activeMissions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Missions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMissions.map((mission: any) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onComplete={handleCompleteMission}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Missions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Available Missions</h2>
            <Button variant="outline" onClick={() => navigate("/missions")}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableMissions.map((mission: any) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onStart={handleStartMission}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate("/rewards")}
          >
            <Coins className="w-6 h-6 mr-2" />
            Browse Rewards
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate("/skills")}
          >
            <Trophy className="w-6 h-6 mr-2" />
            Unlock Skills
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate("/leaderboard")}
          >
            <TrendingUp className="w-6 h-6 mr-2" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
