import { supabase } from '@/integrations/supabase/client';

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: 'steps' | 'cardio' | 'strength';
  target_value: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalData {
  goal_type: 'steps' | 'cardio' | 'strength';
  target_value: number;
  unit: string;
}

export const goalService = {
  async getUserGoals(userId: string): Promise<UserGoal[]> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as UserGoal[];
  },

  async getGoalByType(userId: string, goalType: 'steps' | 'cardio' | 'strength'): Promise<UserGoal | null> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('goal_type', goalType)
      .maybeSingle();

    if (error) throw error;
    return data as UserGoal | null;
  },

  async createOrUpdateGoal(userId: string, goalData: CreateGoalData): Promise<UserGoal> {
    const { data, error } = await supabase
      .from('user_goals')
      .upsert({
        user_id: userId,
        goal_type: goalData.goal_type,
        target_value: goalData.target_value,
        unit: goalData.unit,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,goal_type'
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserGoal;
  },

  async deleteGoal(userId: string, goalType: 'steps' | 'cardio' | 'strength'): Promise<void> {
    const { error } = await supabase
      .from('user_goals')
      .delete()
      .eq('user_id', userId)
      .eq('goal_type', goalType);

    if (error) throw error;
  }
};

export const getGoalDisplayInfo = (goalType: 'steps' | 'cardio' | 'strength') => {
  switch (goalType) {
    case 'steps':
      return {
        title: 'Daily Steps Goal',
        description: 'Set your target number of steps per day',
        unit: 'steps',
        placeholder: 'e.g., 8000',
        defaultValue: 8000,
        min: 1000,
        max: 50000
      };
    case 'cardio':
      return {
        title: 'Weekly Cardio Goal',
        description: 'Set your target minutes of cardio exercise per week',
        unit: 'minutes',
        placeholder: 'e.g., 150',
        defaultValue: 150,
        min: 30,
        max: 1000
      };
    case 'strength':
      return {
        title: 'Weekly Strength Training Goal',
        description: 'Set your target number of strength training sessions per week',
        unit: 'sessions',
        placeholder: 'e.g., 2',
        defaultValue: 2,
        min: 1,
        max: 7
      };
    default:
      return {
        title: 'Set Goal',
        description: 'Set your activity goal',
        unit: '',
        placeholder: '',
        defaultValue: 0,
        min: 0,
        max: 100
      };
  }
};