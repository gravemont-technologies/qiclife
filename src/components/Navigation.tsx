import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, Gift, Award, Users } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/missions", label: "Missions", icon: Target },
  { path: "/rewards", label: "Rewards", icon: Gift },
  { path: "/skills", label: "Skills", icon: Award },
  { path: "/leaderboard", label: "Leaderboard", icon: Users },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">Q</span>
            </div>
            <span className="text-xl font-bold">QIC Life</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
