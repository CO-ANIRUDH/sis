import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface ChartProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  data: Array<{ [key: string]: any }>;
  dataKey: string;
  xAxisKey: string;
  color?: string;
  height?: number;
  emptyState?: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
      icon?: LucideIcon;
    };
  };
  className?: string;
}

export const Chart = ({
  title,
  subtitle,
  icon: Icon,
  data,
  dataKey,
  xAxisKey,
  color = "#3b82f6",
  height = 300,
  emptyState,
  className
}: ChartProps) => {
  const hasData = data && data.length > 0;

  return (
    <Card className={`p-6 border-2 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>
      
      {hasData ? (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              className="dark:stroke-gray-400"
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              className="dark:stroke-gray-400"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                color: '#374151'
              }}
              labelStyle={{ color: '#374151' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={`url(#color-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        emptyState && (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.action}
          />
        )
      )}
    </Card>
  );
};