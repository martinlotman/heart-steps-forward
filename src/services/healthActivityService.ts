
import { supabase } from '@/integrations/supabase/client';

export interface HealthActivityData {
  activityType: 'steps' | 'distance' | 'calories' | 'exercise';
  value: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  source: 'google_fit' | 'apple_health' | 'manual';
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
          source: activity.source
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
        source: activity.source
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
  }
};
