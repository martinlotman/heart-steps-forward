
import { useState, useEffect } from 'react';
import { Heart, Calendar, TrendingUp, BookOpen, Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmergencyButton from '@/components/EmergencyButton';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [nextMedication] = useState({
    name: 'Metoprolol',
    time: '2:00 PM',
    timeUntil: '1 hour'
  });

  // Daily task completion state
  const [dailyTasks, setDailyTasks] = useState({
    medications: false,
    health: false,
    education: false
  });

  // Load today's task completion from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = localStorage.getItem(`dailyTasks_${today}`);
    if (savedTasks) {
      setDailyTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save task completion to localStorage and update health journey
  const updateTaskCompletion = (taskType: 'medications' | 'health' | 'education', completed: boolean) => {
    const newTasks = { ...dailyTasks, [taskType]: completed };
    setDailyTasks(newTasks);
    
    const today = new Date().toDateString();
    localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(newTasks));
    
    // Check if all tasks are completed and update health journey
    const allCompleted = newTasks.medications && newTasks.health && newTasks.education;
    if (allCompleted) {
      localStorage.setItem(`healthJourney_${today}`, 'complete');
    }
  };

  const allTasksCompleted = dailyTasks.medications && dailyTasks.health && dailyTasks.education;

  const quickStats = [
    { label: 'Days since MI', value: '45', icon: Heart, link: '/health-journey' },
    { label: 'Medications today', value: '2/4', icon: Calendar },
    { label: 'Recovery score', value: '85%', icon: TrendingUp },
  ];

  const dailyTaskItems = [
    {
      to: "/medications",
      icon: Calendar,
      title: "Take Medications",
      description: "Mark your daily medications as taken",
      completed: dailyTasks.medications,
      taskType: "medications" as const
    },
    {
      to: "/health",
      icon: Heart,
      title: "Log Health Metrics",
      description: "Record BP, weight, and symptoms",
      completed: dailyTasks.health,
      taskType: "health" as const
    },
    {
      to: "/education",
      icon: BookOpen,
      title: "Complete Learning",
      description: "Read today's heart-healthy tip",
      completed: dailyTasks.education,
      taskType: "education" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good morning, John</h1>
              <p className="text-blue-100">Your heart health journey continues</p>
            </div>
            <Bell className="text-blue-100" size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Emergency Button */}
        <div className="mb-6">
          <EmergencyButton />
        </div>

        {/* Next Medication */}
        <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-orange-800">
              Next Medication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{nextMedication.name}</p>
                <p className="text-sm text-gray-600">Due at {nextMedication.time}</p>
                <p className="text-sm text-orange-600 font-medium">In {nextMedication.timeUntil}</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Set Reminder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickStats.map((stat, index) => (
            stat.link ? (
              <Link key={index} to={stat.link}>
                <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <stat.icon className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <stat.icon className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {/* Daily Tasks Progress */}
        {allTasksCompleted && (
          <Card className="mb-4 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center text-green-700">
                <Check className="mr-2" size={20} />
                <span className="font-medium">All daily tasks completed! Great job! 🎉</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Tasks */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Tasks</h2>
          
          {dailyTaskItems.map((task, index) => (
            <div key={index} className="relative">
              <Link to={task.to}>
                <Card className={`hover:shadow-md transition-all cursor-pointer ${
                  task.completed 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <task.icon className={`mr-4 ${
                          task.completed ? 'text-green-600' : task.to === '/medications' ? 'text-blue-600' : task.to === '/health' ? 'text-red-500' : 'text-green-600'
                        }`} size={24} />
                        <div>
                          <h3 className={`font-medium ${
                            task.completed ? 'text-green-800' : 'text-gray-800'
                          }`}>{task.title}</h3>
                          <p className={`text-sm ${
                            task.completed ? 'text-green-600' : 'text-gray-500'
                          }`}>{task.description}</p>
                        </div>
                      </div>
                      {task.completed && (
                        <Check className="text-green-600" size={20} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
