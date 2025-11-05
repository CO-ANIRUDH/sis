import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: "blue" | "yellow" | "green" | "orange" | "purple";
  progress?: number;
  className?: string;
}

const colorVariants = {
  blue: "hover:border-blue-300 bg-gradient-to-br from-white to-blue-50/30 group-hover:to-blue-100/50",
  yellow: "hover:border-yellow-300 bg-gradient-to-br from-white to-yellow-50/30 group-hover:to-yellow-100/50",
  green: "hover:border-green-300 bg-gradient-to-br from-white to-green-50/30 group-hover:to-green-100/50",
  orange: "hover:border-orange-300 bg-gradient-to-br from-white to-orange-50/30 group-hover:to-orange-100/50",
  purple: "hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30 group-hover:to-purple-100/50",
};

const iconColors = {
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
  yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200",
  green: "bg-green-100 text-green-600 group-hover:bg-green-200",
  orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200",
  purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
};

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  color = "blue", 
  progress,
  className 
}: StatCardProps) => {
  return (
    <Card className={cn(
      "p-6 hover:shadow-xl transition-all duration-300 border-2 group cursor-pointer transform hover:scale-105",
      colorVariants[color],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl transition-colors", iconColors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {subtitle && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{subtitle}</span>
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={cn("h-2 rounded-full transition-all duration-500", {
              "bg-blue-500": color === "blue",
              "bg-yellow-500": color === "yellow",
              "bg-green-500": color === "green",
              "bg-orange-500": color === "orange",
              "bg-purple-500": color === "purple",
            })}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
};