
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/pages/Onboarding';

export const onboardingService = {
  async saveProfile(data: OnboardingData, userId: string) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        name: data.name,
        age: data.age,
        date_of_mi: data.dateOfMI?.toISOString().split('T')[0] || null,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async saveGPPAQResponse(data: OnboardingData, userId: string) {
    const { error } = await supabase
      .from('gppaq_responses')
      .upsert({
        user_id: userId,
        work_type: data.gppaq.workType,
        physical_activity: data.gppaq.physicalActivity,
        walking_cycling: data.gppaq.walkingCycling,
        housework: data.gppaq.housework,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async saveEQ5D5LResponse(data: OnboardingData, userId: string) {
    const { error } = await supabase
      .from('eq5d5l_responses')
      .upsert({
        user_id: userId,
        mobility: data.eq5d5l.mobility,
        self_care: data.eq5d5l.selfCare,
        usual_activities: data.eq5d5l.usualActivities,
        pain_discomfort: data.eq5d5l.painDiscomfort,
        anxiety_depression: data.eq5d5l.anxietyDepression,
        health_score: data.eq5d5l.healthScore,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async saveCompleteOnboarding(data: OnboardingData, userId: string) {
    try {
      await this.saveProfile(data, userId);
      await this.saveGPPAQResponse(data, userId);
      await this.saveEQ5D5LResponse(data, userId);
      console.log('Onboarding data saved successfully to Supabase');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  }
};
