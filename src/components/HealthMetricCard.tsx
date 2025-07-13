
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  normal: boolean;
}

const HealthMetricCard = ({ title, value, unit, trend, normal }: HealthMetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className={`${normal ? 'text-green-600' : 'text-destructive'}`} size={20} />;
      case 'down':
        return <TrendingDown className={`${normal ? 'text-green-600' : 'text-destructive'}`} size={20} />;
      case 'stable':
        return <Minus className="text-muted-foreground" size={20} />;
    }
  };

  return (
    <Card className={`${normal ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground ml-1">{unit}</span>
          </div>
          {getTrendIcon()}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
