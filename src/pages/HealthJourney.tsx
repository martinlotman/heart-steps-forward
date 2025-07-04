import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

interface DayProgress {
  day: number;
  date: string;
  medicationsTaken: number;
  totalMedications: number;
  stepsLogged: boolean;
  vitalsLogged: boolean;
  status: 'complete' | 'partial' | 'incomplete';
  dailyTasksCompleted?: boolean;
}

const HealthJourney = () => {
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  
  const [journeyData] = useState<DayProgress[]>(() => {
    const data: DayProgress[] = [];
    const today = new Date();
    
    for (let i = 44; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      
      // Check if this day had all daily tasks completed
      const dailyTasksCompleted = localStorage.getItem(`healthJourney_${dateString}`) === 'complete';
      
      // Mock some realistic progress data
      const medicationsTaken = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      const totalMedications = 4;
      const stepsLogged = Math.random() > 0.4;
      const vitalsLogged = Math.random() > 0.5;
      
      let status: 'complete' | 'partial' | 'incomplete' = 'incomplete';
      
      // If daily tasks were completed, mark as complete
      if (dailyTasksCompleted) {
        status = 'complete';
      } else if (medicationsTaken === totalMedications && stepsLogged && vitalsLogged) {
        status = 'complete';
      } else if (medicationsTaken > 0 || stepsLogged || vitalsLogged) {
        status = 'partial';
      }
      
      data.push({
        day: 45 - i,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        medicationsTaken,
        totalMedications,
        stepsLogged,
        vitalsLogged,
        status,
        dailyTasksCompleted
      });
    }
    
    return data;
  });

  const completeDays = journeyData.filter(day => day.status === 'complete').length;
  const partialDays = journeyData.filter(day => day.status === 'partial').length;
  const incompleteDays = journeyData.filter(day => day.status === 'incomplete').length;
  const overallProgress = (completeDays / journeyData.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-400 border-green-500';
      case 'partial': return 'bg-yellow-400 border-yellow-500';
      default: return 'bg-red-400 border-red-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return '✓';
      case 'partial': return '○';
      default: return '×';
    }
  };

  const handleDayClick = (day: DayProgress) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
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
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Stats Cards */}
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

        {/* Journey Timeline */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">45-Day Recovery Journey</h2>
            
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {journeyData.map((day) => (
                <div
                  key={day.day}
                  className={`relative aspect-square rounded-full border-2 flex items-center justify-center text-white font-bold text-xs transition-all hover:scale-110 cursor-pointer ${getStatusColor(day.status)}`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="text-xs">{getStatusIcon(day.status)}</span>
                  <div className="absolute -bottom-6 text-xs text-gray-600 font-normal">
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-green-500 flex items-center justify-center text-white text-xs font-bold mr-3">✓</div>
                <span className="text-sm">Perfect day - All tasks completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center text-white text-xs font-bold mr-3">○</div>
                <span className="text-sm">Partial day - Some tasks completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-red-500 flex items-center justify-center text-white text-xs font-bold mr-3">×</div>
                <span className="text-sm">Missed day - No tasks completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal for Day Details */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Day {selectedDay.day} Details</h3>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">{selectedDay.date}</div>
              
              {selectedDay.dailyTasksCompleted && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center text-green-700">
                    <span className="text-sm font-medium">✓ All daily tasks completed!</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medications Taken</span>
                  <span className={`text-sm font-medium ${selectedDay.medicationsTaken === selectedDay.totalMedications ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDay.medicationsTaken}/{selectedDay.totalMedications}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Steps Logged</span>
                  <span className={`text-sm font-medium ${selectedDay.stepsLogged ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDay.stepsLogged ? '✓ Yes' : '× No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vitals Logged</span>
                  <span className={`text-sm font-medium ${selectedDay.vitalsLogged ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDay.vitalsLogged ? '✓ Yes' : '× No'}
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
      )}

      <Navigation />
    </div>
  );
};

export default HealthJourney;
