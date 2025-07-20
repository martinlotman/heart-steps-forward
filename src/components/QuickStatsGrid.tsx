
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickStat {
  label: string;
  value: string;
  icon: LucideIcon;
  link?: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
}

const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, index) => (
        stat.link ? (
          <Link key={index} to={stat.link}>
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-24">
              <CardContent className="p-3 h-full flex flex-col justify-center">
                <stat.icon className="mx-auto mb-1 text-primary" size={20} />
                <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card key={index} className="text-center h-24">
            <CardContent className="p-3 h-full flex flex-col justify-center">
              <stat.icon className="mx-auto mb-1 text-primary" size={20} />
              <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
            </CardContent>
          </Card>
        )
      ))}
    </div>
  );
};

export default QuickStatsGrid;
