
import { supabase } from '@/integrations/supabase/client';

export const dailyTasksService = {
  async updateDailyTask(
    taskDate: string, 
    taskType: 'medications' | 'health' | 'education' | 'physical_activity', 
    completed: boolean,
    userId: string
  ) {
    try {
      const { data: existingTask } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', taskDate)
        .single();

      const taskUpdate = { [taskType]: completed };

      if (existingTask) {
        const { error } = await supabase
          .from('daily_tasks')
          .update({
            ...taskUpdate,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('task_date', taskDate);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('daily_tasks')
          .insert({
            user_id: userId,
            task_date: taskDate,
            medications: taskType === 'medications' ? completed : false,
            health: taskType === 'health' ? completed : false,
            education: taskType === 'education' ? completed : false,
            physical_activity: taskType === 'physical_activity' ? completed : false
          });

        if (error) throw error;
      }

      console.log(`Daily task ${taskType} updated for ${taskDate}`);
    } catch (error) {
      console.error('Error updating daily task:', error);
      throw error;
    }
  },

  async updateHealthJourney(journeyDate: string, status: 'incomplete' | 'complete', userId: string) {
    try {
      const { error } = await supabase
        .from('health_journey')
        .upsert({
          user_id: userId,
          journey_date: journeyDate,
          status: status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log(`Health journey updated for ${journeyDate}: ${status}`);
    } catch (error) {
      console.error('Error updating health journey:', error);
      throw error;
    }
  }
};
