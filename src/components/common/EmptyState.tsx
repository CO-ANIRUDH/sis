import { LucideIcon } from "lucide-react";
import { GradientButton } from "./GradientButton";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn("text-center py-16", className)}>
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto mb-6">
        <Icon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      </div>
      <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <GradientButton 
          onClick={action.onClick}
          icon={action.icon}
          size="lg"
        >
          {action.label}
        </GradientButton>
      )}
    </div>
  );
};