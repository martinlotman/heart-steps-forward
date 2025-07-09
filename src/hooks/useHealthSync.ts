
import { useState, useEffect } from 'react';
import { healthDataService, HealthActivity } from '@/services/healthDataService';
import { useToast } from '@/hooks/use-toast';

export const useHealthSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [todaysActivity, setTodaysActivity] = useState<HealthActivity[]>([]);
  const { toast } = useToast();

  // Check if already connected on mount
  useEffect(() => {
    setIsConnected(healthDataService.isHealthConnected());
  }, []);

  const connectHealthData = async () => {
    setIsLoading(true);
    try {
      const initialized = await healthDataService.initialize();
      if (!initialized) {
        toast({
          title: "Health data not available",
          description: "Health data services are not available on this device",
          variant: "destructive"
        });
        return false;
      }

      const hasPermissions = await healthDataService.requestPermissions();
      if (hasPermissions) {
        setIsConnected(true);
        toast({
          title: "Health data connected",
          description: "Successfully connected to your health data",
        });
        await syncHealthData();
        return true;
      } else {
        toast({
          title: "Permissions required",
          description: "Please grant access to health data to track your activity",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Health connection failed:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to health data services",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncHealthData = async () => {
    if (!isConnected) return;

    try {
      const activityData = await healthDataService.syncTodaysActivity();
      setTodaysActivity(activityData);
      setLastSync(new Date());
      
      // Update health journey with activity data
      updateHealthJourney(activityData);
      
      return activityData;
    } catch (error) {
      console.error('Health sync failed:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync health data",
        variant: "destructive"
      });
    }
  };

  const updateHealthJourney = (activities: HealthActivity[]) => {
    const today = new Date().toDateString();
    const hasSteps = activities.some(activity => activity.type === 'steps' && activity.value > 0);
    const hasCalories = activities.some(activity => activity.type === 'calories' && activity.value > 0);
    
    if (hasSteps || hasCalories) {
      // Mark physical activity as logged for today
      const existingTasks = localStorage.getItem(`dailyTasks_${today}`);
      const tasks = existingTasks ? JSON.parse(existingTasks) : { medications: false, health: false, education: false };
      
      // Update physical activity tracking
      const updatedTasks = { ...tasks, physicalActivity: true };
      localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(updatedTasks));
      
      // Update health journey status
      const allCompleted = updatedTasks.medications && updatedTasks.health && updatedTasks.education && updatedTasks.physicalActivity;
      if (allCompleted) {
        localStorage.setItem(`healthJourney_${today}`, 'complete');
      }
    }
  };

  const getTodaysSteps = (): number => {
    const stepsData = todaysActivity.filter(activity => activity.type === 'steps');
    return stepsData.reduce((total, activity) => total + activity.value, 0);
  };

  const getTodaysCalories = (): number => {
    const caloriesData = todaysActivity.filter(activity => activity.type === 'calories');
    return caloriesData.reduce((total, activity) => total + activity.value, 0);
  };

  // Auto-sync every 30 minutes if connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      syncHealthData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    isConnected,
    isLoading,
    lastSync,
    todaysActivity,
    connectHealthData,
    syncHealthData,
    getTodaysSteps,
    getTodaysCalories
  };
};
