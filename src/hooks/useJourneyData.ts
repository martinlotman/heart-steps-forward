import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { healthMetricsService } from '@/services/healthMetricsService';
import { supabase } from '@/integrations/supabase/client';
import { streakService, type StreakInfo } from '@/services/streakService';

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
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    currentStreak: 0,
    longestStreak: 0,
    isOnStreak: false,
    isToday: false,
    todayCompleted: false
  });
  const [loading, setLoading] = useState(true);

  const generateJourneyData = async (miDate: Date, userId: string) => {
    const data: DayProgress[] = [];
    const today = new Date();
    
    // Start from the day after MI (recovery journey starts the day after MI)
    const journeyStartDate = new Date(miDate);
    journeyStartDate.setDate(miDate.getDate() + 1);
    
    const totalDays = Math.ceil((today.getTime() - journeyStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Get all daily tasks from database
    const { data: dailyTasks } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId);

    // Get all medication intakes
    const { data: medicationIntakes } = await supabase
      .from('medication_intakes')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'taken');

    // Get all health metrics
    const { data: healthMetrics } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId);
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(journeyStartDate);
      currentDate.setDate(journeyStartDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Check actual data for this date
      const dailyTask = dailyTasks?.find(task => task.task_date === dateKey);
      
      // Check medications taken on this date
      const medicationsOnDate = medicationIntakes?.filter(intake => 
        intake.taken_at?.split('T')[0] === dateKey
      ) || [];
      
      // Check health metrics logged on this date
      const healthMetricsOnDate = healthMetrics?.filter(metric => 
        metric.recorded_at?.split('T')[0] === dateKey
      ) || [];
      
      // Determine completion status based on actual data
      const medicationsCompleted = dailyTask?.medications === true || medicationsOnDate.length > 0;
      const healthMetricsLogged = dailyTask?.health === true || healthMetricsOnDate.length > 0;
      const educationCompleted = dailyTask?.education === true;
      
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
    
    // Calculate streak information
    const calculatedStreakInfo = streakService.calculateStreak(data);
    setStreakInfo(calculatedStreakInfo);
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
    streakInfo,
    loading
  };
};