import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Target, TrendingUp, Plus, Check, Clock, Smartphone, RefreshCw, CalendarIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import StepsTracker from '@/components/StepsTracker';
import ActivityChart from '@/components/ActivityChart';
import GoalSettingDialog from '@/components/GoalSettingDialog';
import { useHealthSync } from '@/hooks/useHealthSync';
import { useAuth } from '@/hooks/useAuth';
import { goalService } from '@/services/goalService';

interface ActivityGoal {
  id: string;
  type: 'steps' | 'cardio' | 'strength';
  title: string;
  target: number;
  current: number;
  unit: string;
  description: string;
}

interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  intensity: 'Low' | 'Moderate' | 'High';
  type: 'Cardio' | 'Strength' | 'Flexibility' | 'Balance';
}

const PhysicalActivity = () => {
  const { currentUserId } = useAuth();
  const { 
    isConnected, 
    isLoading, 
    lastSync, 
    connectHealthData, 
    syncHealthData, 
    getTodaysSteps, 
    getTodaysCalories 
  } = useHealthSync();

  const [goals, setGoals] = useState<ActivityGoal[]>([
    {
      id: '1',
      type: 'steps',
      title: 'Daily Steps',
      target: 8000,
      current: 5420,
      unit: 'steps',
      description: 'Aim for 8,000 steps per day to improve cardiovascular health'
    },
    {
      id: '2',
      type: 'cardio',
      title: 'Weekly Cardio',
      target: 150,
      current: 90,
      unit: 'minutes',
      description: 'Get 150 minutes of moderate cardio exercise per week'
    },
    {
      id: '3',
      type: 'strength',
      title: 'Strength Training',
      target: 2,
      current: 1,
      unit: 'sessions',
      description: 'Complete 2 strength training sessions per week'
    }
  ]);

  const [recommendations] = useState<ActivityRecommendation[]>([
    {
      id: '1',
      title: 'Walking Program',
      description: 'Start with 10-minute walks after meals. Gradually increase duration as tolerated.',
      duration: '10-30 min',
      intensity: 'Low',
      type: 'Cardio'
    },
    {
      id: '2',
      title: 'Seated Exercises',
      description: 'Chair-based exercises to improve circulation and muscle strength.',
      duration: '15-20 min',
      intensity: 'Low',
      type: 'Strength'
    },
    {
      id: '3',
      title: 'Light Stretching',
      description: 'Gentle stretching routine to improve flexibility and reduce stiffness.',
      duration: '10-15 min',
      intensity: 'Low',
      type: 'Flexibility'
    },
    {
      id: '4',
      title: 'Stationary Cycling',
      description: 'Low-impact cardio exercise that is gentle on joints.',
      duration: '15-30 min',
      intensity: 'Moderate',
      type: 'Cardio'
    }
  ]);

  const [weeklyProgress] = useState([
    { day: 'Mon', minutes: 25 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 20 },
    { day: 'Fri', minutes: 35 },
    { day: 'Sat', minutes: 15 },
    { day: 'Sun', minutes: 0 }
  ]);

  // Rehabilitation visit state
  const [nextVisitDate, setNextVisitDate] = useState<Date | undefined>(undefined);

  // Load user goals from database
  const loadUserGoals = async () => {
    if (!currentUserId) return;
    
    try {
      const userGoals = await goalService.getUserGoals(currentUserId);
      
      setGoals(prev => prev.map(goal => {
        const userGoal = userGoals.find(ug => ug.goal_type === goal.type);
        if (userGoal) {
          return { ...goal, target: userGoal.target_value };
        }
        return goal;
      }));
    } catch (error) {
      console.error('Error loading user goals:', error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadUserGoals();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (isConnected) {
      const healthSteps = getTodaysSteps();
      const healthCalories = getTodaysCalories();
      
      setGoals(prev => prev.map(goal => {
        if (goal.type === 'steps') {
          return { ...goal, current: healthSteps };
        }
        return goal;
      }));
    }
  }, [isConnected, getTodaysSteps, getTodaysCalories]);

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, current: Math.min(newValue, goal.target) } : goal
    ));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Cardio': return '❤️';
      case 'Strength': return '💪';
      case 'Flexibility': return '🤸';
      case 'Balance': return '⚖️';
      default: return '🏃';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Rehabilitation and Physical Activity</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Health Data Connection Card */}
        {!isConnected && (
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="mr-3 text-blue-600" size={20} />
                  <div>
                    <h3 className="font-medium text-blue-800">Connect Health Data</h3>
                    <p className="text-sm text-blue-600">Sync with Google Fit or Apple Health</p>
                  </div>
                </div>
                <Button 
                  onClick={connectHealthData}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Data Status */}
        {isConnected && (
          <Card className="mb-4 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="mr-2 text-green-600" size={16} />
                  <span className="text-sm font-medium text-green-800">Health data connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  {lastSync && (
                    <Badge variant="outline" className="text-xs">
                      Last sync: {lastSync.toLocaleTimeString()}
                    </Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={syncHealthData}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} size={12} />
                    Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Rehabilitation</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Today's Activity Overview */}
            <div className="grid grid-cols-1 gap-4">
              {/* Daily Steps Tracker */}
              <StepsTracker 
                goal={goals.find(g => g.type === 'steps')?.target || 8000}
                onStepsUpdate={(steps) => updateGoalProgress('1', steps)}
              />
              
              {/* Weekly Activity Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActivityChart 
                  activityType="cardio" 
                  title="Weekly Cardio"
                />
                
                <ActivityChart 
                  activityType="strength" 
                  title="Strength Training"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            {/* Rehabilitation Visit Section */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 text-blue-600" size={20} />
                    <h3 className="font-medium text-gray-800">Next Rehabilitation Visit</h3>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {nextVisitDate ? (
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">
                            {format(nextVisitDate, 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-xs text-blue-600 flex items-center mt-1">
                            <Clock size={12} className="mr-1" />
                            {Math.ceil((nextVisitDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin size={16} />
                        <span className="text-sm">No visit scheduled</span>
                      </div>
                    )}
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "ml-3",
                          !nextVisitDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-1" size={14} />
                        {nextVisitDate ? "Change" : "Schedule"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={nextVisitDate}
                        onSelect={setNextVisitDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Activity Goals</h2>
              <p className="text-sm text-gray-600 mt-1">Set your goals together with your rehabilitation specialist</p>
            </div>

            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GoalSettingDialog 
                        goalType={goal.type}
                        onGoalUpdated={loadUserGoals}
                      >
                        <Button size="sm" variant="outline">
                          <Plus size={14} className="mr-1" />
                          Set Goal
                        </Button>
                      </GoalSettingDialog>
                      <Target className="text-blue-600" size={20} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(getProgressPercentage(goal.current, goal.target))}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateGoalProgress(goal.id, goal.current + (goal.type === 'steps' ? 500 : 5))}
                          disabled={goal.current >= goal.target}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {goal.current >= goal.target && (
                    <div className="flex items-center mt-3 p-2 bg-green-50 rounded-lg">
                      <Check className="text-green-600 mr-2" size={16} />
                      <span className="text-sm text-green-800 font-medium">Goal achieved!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Activity Recommendations</h2>
              <p className="text-sm text-gray-600">
                These activities are designed specifically for heart health recovery
              </p>
            </div>

            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(rec.type)}</span>
                      <div>
                        <h3 className="font-medium text-gray-800">{rec.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(rec.intensity)}`}>
                            {rec.intensity}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {rec.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                      Start Activity
                    </Button>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default PhysicalActivity;
