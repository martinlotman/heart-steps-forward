
import { useState, useEffect } from 'react';
import { Heart, Calendar, TrendingUp, BookOpen, Bell, Check, Activity, Clock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmergencyButton from '@/components/EmergencyButton';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const Index = () => {
  const { toast } = useToast();
  
  // Sample medications data - in a real app this would come from a database
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: 'Metoprolol', dosage: '50mg', time: '8:00 AM', taken: false },
    { id: 2, name: 'Lisinopril', dosage: '10mg', time: '2:00 PM', taken: false },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false },
  ]);

  // Get next medication that hasn't been taken
  const getNextMedication = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const untakenMeds = medications.filter(med => !med.taken);
    
    if (untakenMeds.length === 0) {
      return null;
    }

    // Convert medication times to minutes for comparison
    const medWithMinutes = untakenMeds.map(med => {
      const [time, period] = med.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      
      if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60;
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = minutes;
      }
      
      return { ...med, totalMinutes };
    });

    // Find the next medication due
    const nextMed = medWithMinutes
      .filter(med => med.totalMinutes >= currentTime)
      .sort((a, b) => a.totalMinutes - b.totalMinutes)[0] || 
      medWithMinutes.sort((a, b) => a.totalMinutes - b.totalMinutes)[0];

    // Calculate time until next medication
    const timeDiff = nextMed.totalMinutes - currentTime;
    let timeUntil = '';
    
    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / 60);
      const minutes = timeDiff % 60;
      if (hours > 0) {
        timeUntil = `${hours}h ${minutes}m`;
      } else {
        timeUntil = `${minutes}m`;
      }
    } else {
      timeUntil = 'Now';
    }

    return { ...nextMed, timeUntil };
  };

  const nextMedication = getNextMedication();

  const handleMarkTaken = (medicationId: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, taken: true } : med
      )
    );
    
    const medication = medications.find(med => med.id === medicationId);
    if (medication) {
      toast({
        title: "Medication taken",
        description: `${medication.name} marked as taken`,
      });
    }
  };

  // Daily task completion state
  const [dailyTasks, setDailyTasks] = useState({
    medications: false,
    health: false,
    education: false,
    physicalActivity: false
  });

  // Load today's task completion from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = localStorage.getItem(`dailyTasks_${today}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      setDailyTasks(tasks);
    } else {
      // Check if education tasks are completed via lifestyle tasks
      const savedLifestyleTasks = localStorage.getItem(`completedLifestyleTasks_${today}`);
      if (savedLifestyleTasks) {
        const completedLifestyleTasks = JSON.parse(savedLifestyleTasks);
        if (completedLifestyleTasks.length > 0) {
          const updatedTasks = { ...dailyTasks, education: true };
          setDailyTasks(updatedTasks);
          localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(updatedTasks));
        }
      }
    }
  }, []);

  // Save task completion to localStorage and update health journey
  const updateTaskCompletion = (taskType: 'medications' | 'health' | 'education' | 'physicalActivity', completed: boolean) => {
    const newTasks = { ...dailyTasks, [taskType]: completed };
    setDailyTasks(newTasks);
    
    const today = new Date().toDateString();
    localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(newTasks));
    
    // Check if all tasks are completed and update health journey
    const allCompleted = newTasks.medications && newTasks.health && newTasks.education && newTasks.physicalActivity;
    if (allCompleted) {
      localStorage.setItem(`healthJourney_${today}`, 'complete');
    }
  };

  const allTasksCompleted = dailyTasks.medications && dailyTasks.health && dailyTasks.education && dailyTasks.physicalActivity;

  const quickStats = [
    { label: 'Days since MI', value: '45', icon: Heart, link: '/health-journey' },
    { label: 'Medications today', value: '2/4', icon: Calendar },
    { label: 'Physical activity', value: '68%', icon: Activity, link: '/physical-activity' },
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
      description: "Complete lifestyle recommendations",
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
        {nextMedication ? (
          <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-orange-800 flex items-center justify-between">
                Next Medication
                <Link to="/medications">
                  <Button variant="outline" size="sm" className="bg-white border-orange-200 text-orange-700 hover:bg-orange-100">
                    <Settings size={16} className="mr-1" />
                    Schedule
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{nextMedication.name}</p>
                  <p className="text-sm text-gray-600">{nextMedication.dosage}</p>
                  <div className="flex items-center text-sm text-orange-600 font-medium mt-1">
                    <Clock size={14} className="mr-1" />
                    Due at {nextMedication.time}
                    {nextMedication.timeUntil !== 'Now' && (
                      <span className="ml-2">• In {nextMedication.timeUntil}</span>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => handleMarkTaken(nextMedication.id)}
                  className="bg-orange-600 hover:bg-orange-700 text-white ml-4"
                >
                  <Check size={16} className="mr-1" />
                  Mark Taken
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center justify-between">
                Medications
                <Link to="/medications">
                  <Button variant="outline" size="sm" className="bg-white border-green-200 text-green-700 hover:bg-green-100">
                    <Settings size={16} className="mr-1" />
                    Schedule
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-green-700">
                <Check className="mr-2" size={20} />
                <span className="font-medium">All medications taken for today! 🎉</span>
              </div>
            </CardContent>
          </Card>
        )}

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
