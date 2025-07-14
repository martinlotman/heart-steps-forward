import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface JourneyHeaderProps {
  overallProgress: number;
  daysSinceMI: number;
}

const JourneyHeader = ({ overallProgress, daysSinceMI }: JourneyHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <Link to="/" className="mr-4">
            <ArrowLeft className="text-white" size={24} />
          </Link>
          <h1 className="text-xl font-bold">My Health Journey</h1>
        </div>
        
        {/* Progress Summary */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">Overall Progress</span>
            <span className="text-lg font-bold">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-white/20" />
          <div className="mt-2 text-sm text-white/80">
            {daysSinceMI} days since your heart event
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyHeader;