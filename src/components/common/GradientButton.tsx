import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface GradientButtonProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const variants = {
  primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-blue-500/25 hover:shadow-blue-500/40",
  secondary: "bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 hover:from-slate-700 hover:via-gray-700 hover:to-slate-800 shadow-gray-500/25 hover:shadow-gray-500/40",
  success: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-green-500/25 hover:shadow-green-500/40",
  warning: "bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 shadow-orange-500/25 hover:shadow-orange-500/40",
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
        "relative text-white font-semibold border-0 overflow-hidden group",
        "shadow-lg hover:shadow-2xl transition-all duration-300 ease-out",
        "transform hover:scale-105 active:scale-95",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0",
        "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center">
        {Icon && (
          <Icon className={cn(
            "transition-all duration-300 group-hover:rotate-12",
            children ? "w-4 h-4 mr-2" : "w-5 h-5"
          )} />
        )}
        {children}
      </div>
    </Button>
  );
};