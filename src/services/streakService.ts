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

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isOnStreak: boolean;
  streakStartDate?: string;
  streakEndDate?: string;
  isToday: boolean;
  todayCompleted: boolean;
}

export const streakService = {
  calculateStreak: (journeyData: DayProgress[]): StreakInfo => {
    if (!journeyData.length) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        isOnStreak: false,
        isToday: false,
        todayCompleted: false
      };
    }

    // Sort by date to ensure correct order
    const sortedData = [...journeyData].sort((a, b) => 
      new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime()
    );

    const today = new Date().toISOString().split('T')[0];
    const todayData = sortedData.find(day => day.dateKey === today);
    const todayCompleted = todayData?.status === 'complete' || false;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakStartDate: string | undefined;
    let streakEndDate: string | undefined;

    // Calculate streaks from the end (most recent) backwards
    for (let i = sortedData.length - 1; i >= 0; i--) {
      const day = sortedData[i];
      
      if (day.status === 'complete') {
        tempStreak++;
        
        // If this is the start of our current streak (counting backwards)
        if (currentStreak === 0) {
          currentStreak = tempStreak;
          streakEndDate = day.dateKey;
        } else {
          currentStreak = tempStreak;
        }
        
        streakStartDate = day.dateKey;
      } else {
        // Streak broken
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        
        // If we were counting current streak and it's broken, stop
        if (currentStreak > 0) {
          break;
        }
        
        tempStreak = 0;
        streakStartDate = undefined;
        streakEndDate = undefined;
      }
    }

    // Update longest streak if current is longer
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    const isOnStreak = currentStreak >= 3;

    return {
      currentStreak,
      longestStreak,
      isOnStreak,
      streakStartDate,
      streakEndDate,
      isToday: !!todayData,
      todayCompleted
    };
  },

  // Check if user should get streak achievement notification
  shouldShowStreakAchievement: (streakInfo: StreakInfo): boolean => {
    return streakInfo.currentStreak >= 3 && streakInfo.todayCompleted;
  },

  // Check if user should get streak loss warning
  shouldShowStreakWarning: (streakInfo: StreakInfo): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Show warning in the evening (after 6 PM) if today is not completed and user has a streak
    return currentHour >= 18 && 
           streakInfo.isOnStreak && 
           streakInfo.isToday && 
           !streakInfo.todayCompleted;
  },

  // Get streak message for notifications
  getStreakMessage: (streakInfo: StreakInfo): string => {
    if (streakService.shouldShowStreakAchievement(streakInfo)) {
      if (streakInfo.currentStreak === 3) {
        return "🔥 Congratulations! You've started a 3-day streak! Keep up the excellent work!";
      } else if (streakInfo.currentStreak === 7) {
        return "🌟 Amazing! You've maintained a full week streak! You're building fantastic healthy habits!";
      } else if (streakInfo.currentStreak % 10 === 0) {
        return `🏆 Incredible! ${streakInfo.currentStreak} days in a row! You're a health champion!`;
      } else if (streakInfo.currentStreak >= 3) {
        return `🔥 Outstanding! ${streakInfo.currentStreak} days strong! Your consistency is paying off!`;
      }
    }
    
    if (streakService.shouldShowStreakWarning(streakInfo)) {
      return `⚠️ Don't break your ${streakInfo.currentStreak}-day streak! Complete your daily tasks before the day ends.`;
    }
    
    return '';
  },

  // Store streak notifications to avoid spam
  async hasShownNotificationToday(userId: string, type: 'achievement' | 'warning'): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const key = `streak_${type}_${today}`;
    
    try {
      const stored = localStorage.getItem(`${key}_${userId}`);
      return stored === 'true';
    } catch {
      return false;
    }
  },

  async markNotificationShown(userId: string, type: 'achievement' | 'warning'): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `streak_${type}_${today}`;
    
    try {
      localStorage.setItem(`${key}_${userId}`, 'true');
    } catch (error) {
      console.error('Error storing notification flag:', error);
    }
  }
};