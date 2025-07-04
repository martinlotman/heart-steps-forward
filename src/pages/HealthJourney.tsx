
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

interface DayProgress {
  day: number;
  date: string;
  medicationsTaken: number;
  totalMedications: number;
  stepsLogged: boolean;
  vitalsLogged: boolean;
  status: 'complete' | 'partial' | 'incomplete';
}

const HealthJourney = () => {
  // Mock data for 45 days since MI
  const [journeyData] = useState<DayProgress[]>(() => {
    const data: DayProgress[] = [];
    const today = new Date();
    
    for (let i = 44; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Mock some realistic progress data
      const medicationsTaken = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      const totalMedications = 4;
      const stepsLogged = Math.random() > 0.4;
      const vitalsLogged = Math.random() > 0.5;
      
      let status: 'complete' | 'partial' | 'incomplete' = 'incomplete';
      if (medicationsTaken === totalMedications && stepsLogged && vitalsLogged) {
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
        status
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
                  title={`Day ${day.day} (${day.date}): ${day.medicationsTaken}/${day.totalMedications} meds, Steps: ${day.stepsLogged ? 'Yes' : 'No'}, Vitals: ${day.vitalsLogged ? 'Yes' : 'No'}`}
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

      <Navigation />
    </div>
  );
};

export default HealthJourney;
