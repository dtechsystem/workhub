import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const MetricCard = ({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) => {
  return (
    <Card className="overflow-hidden border-border/50 shadow-card transition-all hover:shadow-glow hover:border-primary/50 animate-fade-in">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold truncate">{value}</p>
            {trend && (
              <p className={`mt-1 text-xs sm:text-sm ${trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </p>
            )}
          </div>
          <div className="rounded-lg sm:rounded-xl bg-gradient-primary p-2 sm:p-2.5 shadow-glow flex-shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
