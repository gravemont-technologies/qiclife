import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MissionCard } from "@/components/MissionCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Missions = () => {
  const { data: missions, refetch } = useQuery({
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
      refetch();
    } catch (error) {
      toast.error("Failed to start mission");
    }
  };

  const handleCompleteMission = async (id: string) => {
    try {
      const res = await apiClient.completeMission(id);
      toast.success(`Mission completed! +${res.data.data.xpEarned} XP, +${res.data.data.coinsEarned} Coins`);
      refetch();
    } catch (error) {
      toast.error("Failed to complete mission");
    }
  };

  const activeMissions = missions?.filter((m: any) => m.isActive) || [];
  const availableMissions = missions?.filter((m: any) => !m.isActive && !m.isCompleted) || [];
  const completedMissions = missions?.filter((m: any) => m.isCompleted) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Missions</h1>
          <p className="text-muted-foreground">Complete missions to earn XP, coins, and improve your LifeScore</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active ({activeMissions.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({availableMissions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedMissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMissions.map((mission: any) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onComplete={handleCompleteMission}
                />
              ))}
              {activeMissions.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  No active missions. Start a mission from the Available tab!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableMissions.map((mission: any) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onStart={handleStartMission}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMissions.map((mission: any) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                />
              ))}
              {completedMissions.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  No completed missions yet. Start completing missions to see them here!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Missions;
