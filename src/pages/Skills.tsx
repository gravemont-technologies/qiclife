import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Skills = () => {
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data.data;
    },
  });

  const { data: skills, refetch: refetchSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await apiClient.getSkills();
      return res.data.data.skills;
    },
  });

  const handleUnlock = async (id: string) => {
    try {
      await apiClient.unlockSkill(id);
      toast.success("Skill unlocked!");
      refetchSkills();
      refetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unlock skill");
    }
  };

  const categories = skills ? [...new Set(skills.map((s: any) => s.category))] : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skill Tree</h1>
          <p className="text-muted-foreground">
            Unlock skills using XP to gain benefits and unlock new features
          </p>
        </div>

        <div className="mb-8 p-6 bg-gradient-xp rounded-xl text-xp-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Available XP</p>
              <p className="text-4xl font-bold">{profile?.totalXP || 0}</p>
            </div>
            <Trophy className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {categories.map((category: string) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills
                ?.filter((s: any) => s.category === category)
                .map((skill: any) => {
                  const canUnlock = !skill.isUnlocked && (profile?.totalXP || 0) >= skill.xpCost;
                  
                  return (
                    <Card
                      key={skill.id}
                      className={cn(
                        "overflow-hidden transition-all",
                        skill.isUnlocked && "bg-success/5 border-success/20",
                        !skill.isUnlocked && !canUnlock && "opacity-60"
                      )}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{skill.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {skill.description}
                            </p>
                          </div>
                          {skill.isUnlocked ? (
                            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 ml-2" />
                          ) : (
                            <Lock className="w-6 h-6 text-muted-foreground flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Benefits:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {skill.benefits.map((benefit: string, i: number) => (
                              <li key={i}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>

                        {skill.prerequisites && skill.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Prerequisites:</p>
                            <div className="flex flex-wrap gap-2">
                              {skill.prerequisites.map((prereq: string) => (
                                <Badge key={prereq} variant="outline" className="text-xs">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-xp">
                              <Trophy className="w-5 h-5 text-xp-foreground" />
                            </div>
                            <div>
                              <p className="text-xl font-bold">{skill.xpCost}</p>
                              <p className="text-xs text-muted-foreground">XP</p>
                            </div>
                          </div>

                          {!skill.isUnlocked && (
                            <Button
                              onClick={() => handleUnlock(skill.id)}
                              disabled={!canUnlock}
                              variant={canUnlock ? "default" : "outline"}
                            >
                              {canUnlock ? "Unlock" : "Not Enough XP"}
                            </Button>
                          )}
                          {skill.isUnlocked && (
                            <Badge className="bg-success text-success-foreground">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
