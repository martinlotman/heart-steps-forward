
import { supabase } from '@/integrations/supabase/client';

export const profileService = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  },

  async getImpersonatedUserProfile(userId: string) {
    // For admin viewing another user's profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching impersonated user profile:', error);
      throw error;
    }

    return data;
  },

  calculateDaysSinceMI(dateOfMI: string): number {
    const miDate = new Date(dateOfMI);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - miDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
};
