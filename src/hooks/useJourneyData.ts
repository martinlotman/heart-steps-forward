import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
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

export const useJourneyData = (userId: string | undefined) => {
  const [journeyData, setJourneyData] = useState<DayProgress[]>([]);
  const [miDate, setMiDate] = useState<Date | null>(null);
  const [daysSinceMI, setDaysSinceMI] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Get user profile to determine MI date
        const profile = await profileService.getUserProfile(userId);
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
          await generateJourneyData(actualMiDate, userId);
        }
      } catch (error) {
        console.error('Error fetching journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, [userId]);

  return {
    journeyData,
    miDate,
    daysSinceMI,
    loading
  };
};