import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await apiClient.getLeaderboard(50);
      return res.data.data.leaderboard;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data.data;
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-accent" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Award className="w-6 h-6 text-level" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other members</p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="pt-12">
              <Card className="p-6 text-center bg-gradient-to-b from-muted to-card">
                <Medal className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-bold text-lg mb-1">{leaderboard[1]?.name}</p>
                <p className="text-sm text-muted-foreground mb-2">Level {leaderboard[1]?.level}</p>
                <p className="text-2xl font-bold">{leaderboard[1]?.lifescore}</p>
                <p className="text-xs text-muted-foreground">LifeScore</p>
              </Card>
            </div>

            {/* 1st Place */}
            <div>
              <Card className="p-6 text-center bg-gradient-gold relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent" />
                <div className="relative">
                  <Trophy className="w-16 h-16 mx-auto mb-3 text-accent-foreground" />
                  <p className="font-bold text-xl mb-1">{leaderboard[0]?.name}</p>
                  <p className="text-sm mb-2">Level {leaderboard[0]?.level}</p>
                  <p className="text-3xl font-bold">{leaderboard[0]?.lifescore}</p>
                  <p className="text-xs">LifeScore</p>
                </div>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="pt-12">
              <Card className="p-6 text-center bg-gradient-to-b from-muted to-card">
                <Award className="w-12 h-12 mx-auto mb-3 text-level" />
                <p className="font-bold text-lg mb-1">{leaderboard[2]?.name}</p>
                <p className="text-sm text-muted-foreground mb-2">Level {leaderboard[2]?.level}</p>
                <p className="text-2xl font-bold">{leaderboard[2]?.lifescore}</p>
                <p className="text-xs text-muted-foreground">LifeScore</p>
              </Card>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Full Rankings</h2>
            <div className="space-y-2">
              {leaderboard?.map((entry: any, index: number) => {
                const isCurrentUser = entry.sessionId === profile?.sessionId;
                return (
                  <div
                    key={entry.sessionId}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg transition-colors",
                      isCurrentUser && "bg-primary/5 ring-2 ring-primary",
                      !isCurrentUser && "hover:bg-muted/50"
                    )}
                  >
                    <div className="w-12 text-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary font-normal">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{entry.lifescore}</p>
                      <p className="text-xs text-muted-foreground">{entry.totalXP} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
