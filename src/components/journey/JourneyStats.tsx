import { Card, CardContent } from '@/components/ui/card';

interface JourneyStatsProps {
  completeDays: number;
  partialDays: number;
  incompleteDays: number;
}

const JourneyStats = ({ completeDays, partialDays, incompleteDays }: JourneyStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completeDays}</div>
          <div className="text-xs text-green-700">Perfect Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{partialDays}</div>
          <div className="text-xs text-yellow-700">Partial Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{incompleteDays}</div>
          <div className="text-xs text-red-700">Missed Days</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyStats;