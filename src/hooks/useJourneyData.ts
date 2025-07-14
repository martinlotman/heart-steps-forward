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
    
    // Start from the day after MI (recovery journey starts the day after MI)
    const journeyStartDate = new Date(miDate);
    journeyStartDate.setDate(miDate.getDate() + 1);
    
    const totalDays = Math.ceil((today.getTime() - journeyStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // For demo purposes, create sample data with completed days
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(journeyStartDate);
      currentDate.setDate(journeyStartDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Create sample data - first 10 days complete, then mix of partial/incomplete
      let medicationsCompleted = false;
      let healthMetricsLogged = false;
      let educationCompleted = false;
      
      if (i < 10) {
        // First 10 days - all complete
        medicationsCompleted = true;
        healthMetricsLogged = true;
        educationCompleted = true;
      } else if (i < 12) {
        // Days 11-12 - partial completion
        medicationsCompleted = true;
        healthMetricsLogged = Math.random() > 0.5;
        educationCompleted = false;
      } else if (i < 15) {
        // Days 13-15 - mixed completion
        medicationsCompleted = Math.random() > 0.3;
        healthMetricsLogged = Math.random() > 0.4;
        educationCompleted = Math.random() > 0.6;
      }
      
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