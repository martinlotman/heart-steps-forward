
import { useState, useEffect } from 'react';
import { Heart, Calendar, Activity, BookOpen, Bell } from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import Navigation from '@/components/Navigation';
import NextMedicationCard from '@/components/NextMedicationCard';
import QuickStatsGrid from '@/components/QuickStatsGrid';
import DailyTasksList from '@/components/DailyTasksList';
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

  const handleUpdateMedication = (medicationId: number, newTime: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, time: newTime } : med
      )
    );
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
    },
    {
      to: "/health",
      icon: Heart,
      title: "Log Health Metrics",
      description: "Record BP, weight, and symptoms",
      completed: dailyTasks.health,
    },
    {
      to: "/education",
      icon: BookOpen,
      title: "Complete Learning",
      description: "Complete lifestyle recommendations",
      completed: dailyTasks.education,
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
        <NextMedicationCard
          nextMedication={nextMedication}
          onMarkTaken={handleMarkTaken}
          onUpdateMedication={handleUpdateMedication}
        />

        {/* Quick Stats */}
        <QuickStatsGrid stats={quickStats} />

        {/* Daily Tasks */}
        <DailyTasksList 
          tasks={dailyTaskItems}
          allTasksCompleted={allTasksCompleted}
        />
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
