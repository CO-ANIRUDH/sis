import { cn } from "../../lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const Loading = ({ size = "md", text, className }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16", 
    lg: "w-20 h-20"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <div className={cn(
          "border-4 border-blue-200 rounded-full animate-spin",
          sizeClasses[size]
        )}></div>
        <div className={cn(
          "border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0",
          sizeClasses[size]
        )}></div>
      </div>
      {text && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {text}
          </h3>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};