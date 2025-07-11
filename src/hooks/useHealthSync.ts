
import { useState, useEffect } from 'react';
import { healthDataService, HealthActivity } from '@/services/healthDataService';
import { healthActivityService } from '@/services/healthActivityService';
import { dailyTasksService } from '@/services/dailyTasksService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useHealthSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [todaysActivity, setTodaysActivity] = useState<HealthActivity[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (!isConnected || !user) return;

    try {
      const activityData = await healthDataService.syncTodaysActivity();
      setTodaysActivity(activityData);
      setLastSync(new Date());
      
      // Save activity data to Supabase
      const healthActivities = activityData.map(activity => ({
        activityType: activity.type as 'steps' | 'calories' | 'distance' | 'exercise',
        value: activity.value,
        unit: activity.unit || (activity.type === 'steps' ? 'steps' : 'kcal'),
        startDate: new Date(),
        endDate: new Date(),
        source: 'manual' as const
      }));

      if (healthActivities.length > 0) {
        await healthActivityService.saveBulkHealthActivities(healthActivities, user.id);
      }
      
      // Update health journey with activity data
      await updateHealthJourney(activityData);
      
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

  const updateHealthJourney = async (activities: HealthActivity[]) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const hasSteps = activities.some(activity => activity.type === 'steps' && activity.value > 0);
    const hasCalories = activities.some(activity => activity.type === 'calories' && activity.value > 0);
    
    if (hasSteps || hasCalories) {
      try {
        // Update physical activity task in Supabase
        await dailyTasksService.updateDailyTask(today, 'physical_activity', true, user.id);
        
        // Update local storage for compatibility
        const existingTasks = localStorage.getItem(`dailyTasks_${today}`);
        const tasks = existingTasks ? JSON.parse(existingTasks) : { medications: false, health: false, education: false };
        
        const updatedTasks = { ...tasks, physicalActivity: true };
        localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(updatedTasks));
        
        // Update health journey status
        const allCompleted = updatedTasks.medications && updatedTasks.health && updatedTasks.education && updatedTasks.physicalActivity;
        if (allCompleted) {
          await dailyTasksService.updateHealthJourney(today, 'complete', user.id);
          localStorage.setItem(`healthJourney_${today}`, 'complete');
        }
      } catch (error) {
        console.error('Error updating health journey:', error);
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
  }, [isConnected, user]);

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
