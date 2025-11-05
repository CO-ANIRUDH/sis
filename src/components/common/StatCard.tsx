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
  style?: React.CSSProperties;
}

const colorVariants = {
  blue: "border-blue-200/50 hover:border-blue-300 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-blue-800/30 hover:shadow-blue-200/50",
  yellow: "border-yellow-200/50 hover:border-yellow-300 bg-gradient-to-br from-white via-yellow-50/30 to-yellow-100/50 dark:from-gray-800 dark:via-yellow-900/20 dark:to-yellow-800/30 hover:shadow-yellow-200/50",
  green: "border-green-200/50 hover:border-green-300 bg-gradient-to-br from-white via-green-50/30 to-green-100/50 dark:from-gray-800 dark:via-green-900/20 dark:to-green-800/30 hover:shadow-green-200/50",
  orange: "border-orange-200/50 hover:border-orange-300 bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 dark:from-gray-800 dark:via-orange-900/20 dark:to-orange-800/30 hover:shadow-orange-200/50",
  purple: "border-purple-200/50 hover:border-purple-300 bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50 dark:from-gray-800 dark:via-purple-900/20 dark:to-purple-800/30 hover:shadow-purple-200/50",
};

const iconColors = {
  blue: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 dark:from-blue-900 dark:to-blue-800 dark:text-blue-400",
  yellow: "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 group-hover:from-yellow-200 group-hover:to-yellow-300 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-400",
  green: "bg-gradient-to-br from-green-100 to-green-200 text-green-600 group-hover:from-green-200 group-hover:to-green-300 dark:from-green-900 dark:to-green-800 dark:text-green-400",
  orange: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 group-hover:from-orange-200 group-hover:to-orange-300 dark:from-orange-900 dark:to-orange-800 dark:text-orange-400",
  purple: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 dark:from-purple-900 dark:to-purple-800 dark:text-purple-400",
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
      "p-6 lg:p-8 border-2 group cursor-pointer backdrop-blur-sm relative overflow-hidden",
      "hover:shadow-2xl transition-all duration-500 ease-out",
      "hover:-translate-y-2 active:scale-95",
      colorVariants[color],
      className
    )}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={cn(
            "p-4 rounded-2xl transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110",
            iconColors[color]
          )}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="text-right flex-1 ml-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 tracking-wide uppercase">
              {title}
            </p>
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-105">
              {value}
            </p>
          </div>
        </div>
        
        {subtitle && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            <span className="transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {subtitle}
            </span>
          </div>
        )}
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
                  "before:animate-pulse",
                  {
                    "bg-gradient-to-r from-blue-400 to-blue-600": color === "blue",
                    "bg-gradient-to-r from-yellow-400 to-yellow-600": color === "yellow",
                    "bg-gradient-to-r from-green-400 to-green-600": color === "green",
                    "bg-gradient-to-r from-orange-400 to-orange-600": color === "orange",
                    "bg-gradient-to-r from-purple-400 to-purple-600": color === "purple",
                  }
                )}
                style={{ 
                  width: `${Math.min(progress, 100)}%`,
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};