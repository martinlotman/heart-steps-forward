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

interface DayCircleProps {
  day: DayProgress;
  index: number;
  onDayClick: (day: DayProgress) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete': return 'bg-green-500 border-green-600 shadow-green-200';
    case 'partial': return 'bg-yellow-500 border-yellow-600 shadow-yellow-200';
    default: return 'bg-red-500 border-red-600 shadow-red-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'complete': return '✓';
    case 'partial': return '◐';
    default: return '○';
  }
};

const DayCircle = ({ day, index, onDayClick }: DayCircleProps) => {
  return (
    <div
      className={`flex items-center ${index % 2 === 0 ? 'justify-start pl-8' : 'justify-end pr-8'}`}
    >
      <div className="flex items-center space-x-3">
        {index % 2 !== 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-600 font-medium">Day {day.day}</div>
            <div className="text-xs text-gray-500">{day.date}</div>
          </div>
        )}
        
        <div
          className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center text-white font-bold text-sm transition-all hover:scale-110 cursor-pointer shadow-lg ${getStatusColor(day.status)}`}
          onClick={() => onDayClick(day)}
        >
          <span className="text-lg">{getStatusIcon(day.status)}</span>
          
          {/* Progress indicator */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            day.status === 'complete' ? 'bg-green-600 text-white' : 
            day.status === 'partial' ? 'bg-yellow-600 text-white' : 
            'bg-red-600 text-white'
          }`}>
            {day.tasksCompleted}
          </div>
        </div>
        
        {index % 2 === 0 && (
          <div className="text-left">
            <div className="text-xs text-gray-600 font-medium">Day {day.day}</div>
            <div className="text-xs text-gray-500">{day.date}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCircle;