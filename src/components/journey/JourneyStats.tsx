import { Card, CardContent } from '@/components/ui/card';

interface JourneyStatsProps {
  completeDays: number;
  partialDays: number;
  incompleteDays: number;
}

const JourneyStats = ({ completeDays, partialDays, incompleteDays }: JourneyStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="bg-secondary border-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{completeDays}</div>
          <div className="text-xs text-foreground">Perfect Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-accent border-border">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-accent-foreground">{partialDays}</div>
          <div className="text-xs text-accent-foreground/80">Partial Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{incompleteDays}</div>
          <div className="text-xs text-destructive/80">Missed Days</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyStats;