
import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, Target, TrendingUp, Plus, Check, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

interface ActivityGoal {
  id: string;
  type: 'steps' | 'exercise' | 'duration';
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
      type: 'exercise',
      title: 'Weekly Cardio',
      target: 150,
      current: 90,
      unit: 'minutes',
      description: 'Get 150 minutes of moderate cardio exercise per week'
    },
    {
      id: '3',
      type: 'duration',
      title: 'Strength Training',
      target: 2,
      current: 1,
      unit: 'sessions/week',
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
            <h1 className="text-xl font-semibold text-gray-800">Physical Activity</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Today's Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 text-blue-600" size={20} />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">5,420</p>
                    <p className="text-xs text-gray-500">Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">25</p>
                    <p className="text-xs text-gray-500">Active min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">180</p>
                    <p className="text-xs text-gray-500">Calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-24 space-x-2">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-200 rounded-t"
                        style={{ 
                          height: `${Math.max((day.minutes / 40) * 100, 5)}%`,
                          backgroundColor: day.minutes > 0 ? '#3B82F6' : '#E5E7EB'
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">{day.day}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Total: {weeklyProgress.reduce((sum, day) => sum + day.minutes, 0)} minutes this week
                </p>
              </CardContent>
            </Card>

            {/* Quick Goals Summary */}
            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => (
                <Card key={goal.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(getProgressPercentage(goal.current, goal.target))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Activity Goals</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-1" />
                Add Goal
              </Button>
            </div>

            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <Target className="text-blue-600" size={20} />
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
