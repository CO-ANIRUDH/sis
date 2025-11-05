import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const variants = {
  primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
  secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
  success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
  warning: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
};

export const GradientButton = ({ 
  children, 
  icon: Icon, 
  variant = "primary", 
  size = "md",
  onClick,
  className,
  disabled 
}: GradientButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      className={cn(
        "text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};