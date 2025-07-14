import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface DayDetailsModalProps {
  selectedDay: DayProgress;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete': return 'bg-green-500 border-green-600 shadow-green-200';
    case 'partial': return 'bg-yellow-500 border-yellow-600 shadow-yellow-200';
    default: return 'bg-red-500 border-red-600 shadow-red-200';
  }
};

const DayDetailsModal = ({ selectedDay, onClose }: DayDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Day {selectedDay.day} Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">{selectedDay.date}</div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Tasks Completed: {selectedDay.tasksCompleted}/3
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  selectedDay.tasksCompleted === 3 ? 'bg-green-500' :
                  selectedDay.tasksCompleted > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(selectedDay.tasksCompleted / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">💊 All Medications Taken</span>
              <span className={`text-sm font-medium ${selectedDay.medicationsCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {selectedDay.medicationsCompleted ? '✓ Yes' : '× No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">📊 Health Metrics Logged</span>
              <span className={`text-sm font-medium ${selectedDay.healthMetricsLogged ? 'text-green-600' : 'text-red-600'}`}>
                {selectedDay.healthMetricsLogged ? '✓ Yes' : '× No'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">📚 Education Completed</span>
              <span className={`text-sm font-medium ${selectedDay.educationCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {selectedDay.educationCompleted ? '✓ Yes' : '× No'}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${getStatusColor(selectedDay.status)}`}></div>
              <span className="text-sm font-medium capitalize">{selectedDay.status} Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailsModal;