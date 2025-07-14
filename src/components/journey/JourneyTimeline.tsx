import { Card, CardContent } from '@/components/ui/card';
import DayCircle from './DayCircle';

interface DayProgress {
  day: number;
  date: string;
  dateKey: string;
  medicationsCompleted: boolean;
  healthMetricsLogged: boolean;
  educationCompleted: boolean;
  tasksCompleted: number;
  status: 'complete' | 'partial' | 'incomplete';
}

interface JourneyTimelineProps {
  journeyData: DayProgress[];
  onDayClick: (day: DayProgress) => void;
}

const JourneyTimeline = ({ journeyData, onDayClick }: JourneyTimelineProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-center">Your Recovery Journey</h2>
        
        {/* Journey Path - Duolingo Style */}
        <div className="relative">
          {/* Connecting Path */}
          <div className="absolute inset-0 flex flex-col items-center">
            <div className="w-1 bg-gray-200 h-full rounded-full"></div>
          </div>
          
          {/* Days Grid */}
          <div className="relative space-y-4">
            {journeyData.map((day, index) => (
              <DayCircle
                key={day.day}
                day={day}
                index={index}
                onDayClick={onDayClick}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyTimeline;