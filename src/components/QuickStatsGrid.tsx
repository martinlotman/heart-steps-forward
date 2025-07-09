
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
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <stat.icon className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <stat.icon className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        )
      ))}
    </div>
  );
};

export default QuickStatsGrid;
