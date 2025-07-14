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
    case 'complete': return 'bg-primary border-primary shadow-primary/20';
    case 'partial': return 'bg-accent-foreground border-accent-foreground shadow-accent/20';
    default: return 'bg-destructive border-destructive shadow-destructive/20';
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
            <div className="text-xs text-muted-foreground font-medium">Day {day.day}</div>
            <div className="text-xs text-muted-foreground/70">{day.date}</div>
          </div>
        )}
        
        <div
          className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center text-primary-foreground font-bold text-sm transition-all hover:scale-110 cursor-pointer shadow-lg ${getStatusColor(day.status)}`}
          onClick={() => onDayClick(day)}
        >
          <span className="text-lg">{getStatusIcon(day.status)}</span>
          
          {/* Progress indicator */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            day.status === 'complete' ? 'bg-primary text-primary-foreground' : 
            day.status === 'partial' ? 'bg-accent-foreground text-primary-foreground' : 
            'bg-destructive text-destructive-foreground'
          }`}>
            {day.tasksCompleted}
          </div>
        </div>
        
        {index % 2 === 0 && (
          <div className="text-left">
            <div className="text-xs text-muted-foreground font-medium">Day {day.day}</div>
            <div className="text-xs text-muted-foreground/70">{day.date}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCircle;