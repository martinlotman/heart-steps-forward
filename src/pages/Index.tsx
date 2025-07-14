
import { useState, useEffect } from 'react';
import { Heart, Calendar, Activity, BookOpen, Bell } from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import Navigation from '@/components/Navigation';
import NextMedicationCard from '@/components/NextMedicationCard';
import QuickStatsGrid from '@/components/QuickStatsGrid';
import DailyTasksList from '@/components/DailyTasksList';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { medicationService, type MedicationIntake } from '@/services/medicationService';
import { AdminPanel } from '@/components/AdminPanel';

const Index = () => {
  const { toast } = useToast();
  const { user, currentUserId } = useAuth();
  const [daysSinceMI, setDaysSinceMI] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [todaysIntakes, setTodaysIntakes] = useState<MedicationIntake[]>([]);
  const [intakesLoading, setIntakesLoading] = useState(true);

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Fetch user profile and today's medication intakes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && currentUserId) {
        try {
          setProfileLoading(true);
          setIntakesLoading(true);
          
          // Fetch profile
          console.log('Fetching profile for user:', currentUserId);
          const profile = await profileService.getUserProfile(currentUserId);
          console.log('Fetched profile:', profile);
          
          if (profile && profile.date_of_mi) {
            setUserProfile(profile);
            const days = profileService.calculateDaysSinceMI(profile.date_of_mi);
            setDaysSinceMI(days);
          } else {
            console.log('No profile found in database, checking localStorage...');
            // Fallback to localStorage if database fetch fails or no profile exists
            const onboardingData = localStorage.getItem('onboardingData');
            if (onboardingData) {
              const data = JSON.parse(onboardingData);
              console.log('Found onboarding data in localStorage:', data);
              setUserProfile({ name: data.name });
              if (data.dateOfMI) {
                const days = profileService.calculateDaysSinceMI(data.dateOfMI);
                setDaysSinceMI(days);
              }
            }
          }

          // Fetch today's medication intakes
          try {
            const intakes = await medicationService.getTodaysIntakes(currentUserId);
            setTodaysIntakes(intakes);
          } catch (intakeError) {
            console.error('Error fetching medication intakes:', intakeError);
          }
          
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to localStorage if database fetch fails
          const onboardingData = localStorage.getItem('onboardingData');
          if (onboardingData) {
            const data = JSON.parse(onboardingData);
            console.log('Using localStorage fallback:', data);
            setUserProfile({ name: data.name });
            if (data.dateOfMI) {
              const days = profileService.calculateDaysSinceMI(data.dateOfMI);
              setDaysSinceMI(days);
            }
          }
        } finally {
          setProfileLoading(false);
          setIntakesLoading(false);
        }
      } else {
        setProfileLoading(false);
        setIntakesLoading(false);
      }
    };

    fetchUserData();
  }, [user, currentUserId]);

  // Get next medication that hasn't been taken
  const getNextMedication = () => {
    if (intakesLoading || todaysIntakes.length === 0) {
      return null;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find untaken scheduled intakes
    const untakenIntakes = todaysIntakes.filter(intake => 
      intake.status === 'scheduled' && intake.medication
    );
    
    if (untakenIntakes.length === 0) {
      return null;
    }

    // Convert to the format expected by NextMedicationCard
    const medicationsWithTimes = untakenIntakes.map(intake => {
      const scheduledTime = new Date(intake.scheduled_time);
      const medicationTime = scheduledTime.getHours() * 60 + scheduledTime.getMinutes();
      
      return {
        id: parseInt(intake.id, 16) || Math.random(), // Convert UUID to number for compatibility
        name: intake.medication!.name,
        dosage: intake.medication!.dosage,
        time: scheduledTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        taken: false,
        medicationTime,
        intakeId: intake.id // Store the actual intake ID for database operations
      };
    });

    // Find the next medication due
    const nextMed = medicationsWithTimes
      .filter(med => med.medicationTime >= currentTime)
      .sort((a, b) => a.medicationTime - b.medicationTime)[0] || 
      medicationsWithTimes.sort((a, b) => a.medicationTime - b.medicationTime)[0];

    if (!nextMed) return null;

    // Calculate time until next medication
    const timeDiff = nextMed.medicationTime - currentTime;
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

  const handleMarkTaken = async (medicationId: number) => {
    if (!currentUserId) return;

    try {
      // Find the intake by medication ID (we stored intakeId in the medication object)
      const intake = todaysIntakes.find(intake => {
        const convertedId = parseInt(intake.id, 16) || Math.random();
        return convertedId === medicationId;
      });

      if (!intake) {
        toast({
          title: "Error",
          description: "Medication intake not found",
          variant: "destructive"
        });
        return;
      }

      // Mark as taken in database
      await medicationService.markMedicationTaken(intake.id);
      
      // Update local state
      setTodaysIntakes(prev => 
        prev.map(prevIntake => 
          prevIntake.id === intake.id 
            ? { ...prevIntake, status: 'taken' as const, taken_at: new Date().toISOString() }
            : prevIntake
        )
      );
      
      toast({
        title: "Medication taken",
        description: `${intake.medication?.name} marked as taken`,
      });
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      toast({
        title: "Error",
        description: "Failed to mark medication as taken",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMedication = (medicationId: number, newTime: string) => {
    // For now, just show a toast - updating medication schedules would require 
    // more complex logic to update the medication's reminder_times
    toast({
      title: "Feature coming soon",
      description: "Medication schedule updates will be available soon",
    });
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

  // Calculate medication stats
  const takenCount = todaysIntakes.filter(intake => intake.status === 'taken').length;
  const totalCount = todaysIntakes.length;

  const quickStats = [
    { label: 'Days since MI', value: daysSinceMI.toString(), icon: Heart, link: '/health-journey' },
    { label: 'Medications today', value: `${takenCount}/${totalCount}`, icon: Calendar, link: '/medications' },
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
      title: "Learn & Complete",
      description: "Complete today's learning task",
      completed: dailyTasks.education,
    }
  ];

  const greeting = getTimeBasedGreeting();
  const displayName = userProfile?.name || (profileLoading ? '...' : 'there');
  
  console.log('Current user profile:', userProfile);
  console.log('Display name:', displayName);
  console.log('Profile loading:', profileLoading);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{greeting}, {displayName}</h1>
              <p className="text-blue-100">Your heart health journey continues</p>
            </div>
            <Bell className="text-blue-100" size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Admin Panel - Only visible to admins */}
        <AdminPanel />

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
