import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  user_id: string;
  email: string;
  name: string;
  age: number;
  date_of_mi: string;
  role: 'admin' | 'user';
  created_at: string;
}

export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data || [];
  },

  async checkIfUserIsAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data || false;
  },

  async makeUserAdmin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      });
    
    if (error) {
      console.error('Error making user admin:', error);
      throw error;
    }
  },

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
  }
};