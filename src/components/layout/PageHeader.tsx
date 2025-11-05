import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  backButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  backButton,
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn(
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10",
      className
    )}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {backButton && (
              <Button variant="ghost" onClick={backButton.onClick} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                {backButton.label}
              </Button>
            )}
            {Icon && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};