import { supabase } from '@/integrations/supabase/client';

export interface TherapeuticGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: string;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTherapeuticGoalData {
  goal_type: string;
  target_value: string;
  unit: string;
}

export interface UpdateTherapeuticGoalData {
  target_value: string;
}

// Default goals with proper formatting
export const defaultTherapeuticGoals = [
  {
    goal_type: 'body_mass_index',
    display_name: 'Body-Mass Index',
    target_value: '20–25',
    unit: 'kg/m²'
  },
  {
    goal_type: 'waist_circumference',
    display_name: 'Waist Circumference',
    target_value: '< 94',
    unit: 'cm'
  },
  {
    goal_type: 'systolic_blood_pressure',
    display_name: 'Systolic Blood Pressure',
    target_value: '120–130',
    unit: 'mmHg'
  },
  {
    goal_type: 'diastolic_blood_pressure',
    display_name: 'Diastolic Blood Pressure',
    target_value: '70–80',
    unit: 'mmHg'
  },
  {
    goal_type: 'hba1c',
    display_name: 'HbA1c',
    target_value: '< 7.0',
    unit: '%'
  },
  {
    goal_type: 'ldl_cholesterol',
    display_name: 'LDL-Cholesterol',
    target_value: '< 1.4',
    unit: 'mmol/L'
  }
];

export const therapeuticGoalsService = {
  async getTherapeuticGoals(userId: string): Promise<TherapeuticGoal[]> {
    const { data, error } = await supabase
      .from('therapeutic_goals')
      .select('*')
      .eq('user_id', userId)
      .order('goal_type');

    if (error) {
      console.error('Error fetching therapeutic goals:', error);
      throw error;
    }

    return data || [];
  },

  async createTherapeuticGoal(data: CreateTherapeuticGoalData, userId: string): Promise<TherapeuticGoal> {
    const { data: result, error } = await supabase
      .from('therapeutic_goals')
      .insert({
        user_id: userId,
        goal_type: data.goal_type,
        target_value: data.target_value,
        unit: data.unit
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating therapeutic goal:', error);
      throw error;
    }

    return result;
  },

  async updateTherapeuticGoal(goalId: string, data: UpdateTherapeuticGoalData): Promise<TherapeuticGoal> {
    const { data: result, error } = await supabase
      .from('therapeutic_goals')
      .update({
        target_value: data.target_value
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating therapeutic goal:', error);
      throw error;
    }

    return result;
  },

  async initializeDefaultGoals(userId: string): Promise<TherapeuticGoal[]> {
    const existingGoals = await this.getTherapeuticGoals(userId);
    
    if (existingGoals.length === 0) {
      // Create all default goals
      const promises = defaultTherapeuticGoals.map(goal =>
        this.createTherapeuticGoal({
          goal_type: goal.goal_type,
          target_value: goal.target_value,
          unit: goal.unit
        }, userId)
      );

      try {
        const createdGoals = await Promise.all(promises);
        return createdGoals;
      } catch (error) {
        console.error('Error initializing default goals:', error);
        throw error;
      }
    }

    return existingGoals;
  }
};