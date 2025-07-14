
import { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { dailyTasksService } from '@/services/dailyTasksService';
import { healthMetricsService } from '@/services/healthMetricsService';
import { supabase } from '@/integrations/supabase/client';

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

const HealthJourney = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const [journeyData, setJourneyData] = useState<DayProgress[]>([]);
  const [miDate, setMiDate] = useState<Date | null>(null);
  const [daysSinceMI, setDaysSinceMI] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user profile to determine MI date
        const profile = await profileService.getUserProfile(user.id);
        let actualMiDate: Date;
        
        if (profile && profile.date_of_mi) {
          actualMiDate = new Date(profile.date_of_mi);
          const days = profileService.calculateDaysSinceMI(profile.date_of_mi);
          setDaysSinceMI(days);
        } else {
          // Fallback to localStorage
          const onboardingData = localStorage.getItem('onboardingData');
          if (onboardingData) {
            const data = JSON.parse(onboardingData);
            if (data.dateOfMI) {
              actualMiDate = new Date(data.dateOfMI);
              const days = profileService.calculateDaysSinceMI(data.dateOfMI);
              setDaysSinceMI(days);
            }
          }
        }

        if (actualMiDate) {
          setMiDate(actualMiDate);
          await generateJourneyData(actualMiDate, user.id);
        }
      } catch (error) {
        console.error('Error fetching journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, [user]);

  const generateJourneyData = async (miDate: Date, userId: string) => {
    const data: DayProgress[] = [];
    const today = new Date();
    const totalDays = Math.ceil((today.getTime() - miDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Fetch all daily tasks from Supabase
    const { data: dailyTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId);

    // Fetch all health metrics to check if user logged metrics on specific days
    const healthMetrics = await healthMetricsService.getHealthMetrics(userId);
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(miDate);
      currentDate.setDate(miDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Find tasks for this specific date
      const dayTasks = dailyTasks?.find(task => task.task_date === dateKey);
      
      // Check if health metrics were logged on this day
      const dayHealthMetrics = healthMetrics?.filter(metric => {
        const metricDate = new Date(metric.recorded_at).toISOString().split('T')[0];
        return metricDate === dateKey;
      });
      
      const medicationsCompleted = dayTasks?.medications || false;
      const healthMetricsLogged = (dayHealthMetrics && dayHealthMetrics.length > 0) || false;
      const educationCompleted = dayTasks?.education || false;
      
      const tasksCompleted = [medicationsCompleted, healthMetricsLogged, educationCompleted].filter(Boolean).length;
      
      let status: 'complete' | 'partial' | 'incomplete' = 'incomplete';
      if (tasksCompleted === 3) {
        status = 'complete';
      } else if (tasksCompleted > 0) {
        status = 'partial';
      }
      
      data.push({
        day: i + 1,
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateKey,
        medicationsCompleted,
        healthMetricsLogged,
        educationCompleted,
        tasksCompleted,
        status
      });
    }
    
    setJourneyData(data);
  };

  const completeDays = journeyData.filter(day => day.status === 'complete').length;
  const partialDays = journeyData.filter(day => day.status === 'partial').length;
  const incompleteDays = journeyData.filter(day => day.status === 'incomplete').length;
  const overallProgress = journeyData.length > 0 ? (completeDays / journeyData.length) * 100 : 0;

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

  const handleDayClick = (day: DayProgress) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center mb-4">
              <Link to="/" className="mr-4">
                <ArrowLeft className="text-white" size={24} />
              </Link>
              <h1 className="text-xl font-bold">My Health Journey</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your health journey...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

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
            <div className="mt-2 text-sm text-white/80">
              {daysSinceMI} days since your heart event
            </div>
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
                  <div
                    key={day.day}
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
                        onClick={() => handleDayClick(day)}
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Daily Tasks</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center text-white text-xs font-bold mr-3">3</div>
                <span>All 3 tasks completed (Medications + Health metrics + Education)</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-white text-xs font-bold mr-3">1-2</div>
                <span>Some tasks completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-red-600 flex items-center justify-center text-white text-xs font-bold mr-3">0</div>
                <span>No tasks completed</span>
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
      )}

      <Navigation />
    </div>
  );
};

export default HealthJourney;
