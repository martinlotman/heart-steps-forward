
import { supabase } from '@/integrations/supabase/client';

export interface HealthActivityData {
  activityType: 'steps' | 'distance' | 'calories' | 'cardio' | 'strength' | 'exercise';
  value: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  source: 'google_fit' | 'apple_health' | 'manual';
  notes?: string;
  exerciseName?: string;
  duration?: number;
}

export const healthActivityService = {
  async saveHealthActivity(activity: HealthActivityData, userId: string) {
    try {
      const { error } = await supabase
        .from('health_activities')
        .insert({
          user_id: userId,
          activity_type: activity.activityType,
          value: activity.value,
          unit: activity.unit,
          start_date: activity.startDate.toISOString(),
          end_date: activity.endDate.toISOString(),
          source: activity.source,
          exercise_name: activity.exerciseName,
          duration_minutes: activity.duration,
          notes: activity.notes
        });

      if (error) throw error;
      console.log('Health activity saved:', activity);
    } catch (error) {
      console.error('Error saving health activity:', error);
      throw error;
    }
  },

  async saveBulkHealthActivities(activities: HealthActivityData[], userId: string) {
    try {
      const activitiesWithUserId = activities.map(activity => ({
        user_id: userId,
        activity_type: activity.activityType,
        value: activity.value,
        unit: activity.unit,
        start_date: activity.startDate.toISOString(),
        end_date: activity.endDate.toISOString(),
        source: activity.source,
        exercise_name: activity.exerciseName,
        duration_minutes: activity.duration,
        notes: activity.notes
      }));

      const { error } = await supabase
        .from('health_activities')
        .insert(activitiesWithUserId);

      if (error) throw error;
      console.log(`Saved ${activities.length} health activities`);
    } catch (error) {
      console.error('Error saving bulk health activities:', error);
      throw error;
    }
  },

  async getHealthActivities(userId: string, activityType?: string, startDate?: Date, endDate?: Date) {
    try {
      let query = supabase
        .from('health_activities')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (activityType) {
        query = query.eq('activity_type', activityType);
      }

      if (startDate) {
        query = query.gte('start_date', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('end_date', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching health activities:', error);
      throw error;
    }
  },

  async getTodaysSteps(userId: string): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('health_activities')
        .select('value')
        .eq('user_id', userId)
        .eq('activity_type', 'steps')
        .gte('start_date', today.toISOString())
        .lt('start_date', tomorrow.toISOString());

      if (error) throw error;
      
      return data?.reduce((total, activity) => total + (activity.value || 0), 0) || 0;
    } catch (error) {
      console.error('Error fetching today\'s steps:', error);
      return 0;
    }
  },

  async getWeeklyCardio(userId: string): Promise<any[]> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('health_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'cardio')
        .gte('start_date', weekAgo.toISOString())
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weekly cardio:', error);
      return [];
    }
  },

  async getWeeklyStrength(userId: string): Promise<any[]> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('health_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'strength')
        .gte('start_date', weekAgo.toISOString())
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weekly strength:', error);
      return [];
    }
  }
};
