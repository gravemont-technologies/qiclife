import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "gold" | "xp" | "success" | "level";
  subtitle?: string;
  progress?: number;
}

const variantStyles = {
  default: "bg-gradient-primary text-primary-foreground",
  gold: "bg-gradient-gold text-accent-foreground",
  xp: "bg-gradient-xp text-xp-foreground",
  success: "bg-gradient-success text-success-foreground",
  level: "bg-gradient-level text-level-foreground",
};

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  subtitle,
  progress 
}: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", variantStyles[variant])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500 rounded-full", variantStyles[variant])}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
