
import { supabase } from '@/integrations/supabase/client';
import { dataSecurityService } from './dataSecurityService';

export interface ConsentRecord {
  userId: string;
  consentType: 'data_collection' | 'medical_disclaimer' | 'privacy_policy' | 'research_participation';
  consented: boolean;
  timestamp: Date;
  version: string;
}

export const complianceService = {
  // Record user consent in secure database storage
  async recordConsent(userId: string, consents: Record<string, boolean>): Promise<boolean> {
    try {
      await dataSecurityService.logSecurityEvent({
        action: 'CONSENT_UPDATED',
        userId: userId,
        resourceAccessed: 'user_consents'
      });

      const version = '1.0';
      const consentRecords = Object.entries(consents).map(([type, consented]) => ({
        user_id: userId,
        consent_type: type,
        consented,
        version
      }));

      const { error } = await supabase
        .from('user_consents')
        .upsert(consentRecords, {
          onConflict: 'user_id,consent_type',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error recording consents:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error recording consents:', error);
      return false;
    }
  },

  // Validate if user has given consent
  async hasValidConsent(userId: string, consentType: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('consented')
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .maybeSingle();

      if (error) {
        console.error('Error checking consent:', error);
        return false;
      }

      return data?.consented || false;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  },

  // Handle data subject rights requests (GDPR compliance)
  async handleDataRequest(
    userId: string,
    requestType: 'access' | 'delete' | 'export'
  ): Promise<any> {
    await dataSecurityService.logSecurityEvent({
      action: `DATA_REQUEST_${requestType.toUpperCase()}`,
      userId: userId,
      resourceAccessed: 'gdpr_data_request'
    });

    switch (requestType) {
      case 'export':
        return this.exportUserData(userId);
      case 'delete':
        return this.deleteUserData(userId);
      case 'access':
        return this.exportUserData(userId);
      default:
        throw new Error('Invalid request type');
    }
  },

  // Export all user data (GDPR right to data portability)
  async exportUserData(userId: string): Promise<any> {
    try {
      const userData: Record<string, any> = {};

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      if (profiles) userData.profiles = profiles;

      // Fetch health_metrics
      const { data: healthMetrics } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId);
      if (healthMetrics) userData.health_metrics = healthMetrics;

      // Fetch medications
      const { data: medications } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', userId);
      if (medications) userData.medications = medications;

      // Fetch medication_intakes
      const { data: medicationIntakes } = await supabase
        .from('medication_intakes')
        .select('*')
        .eq('user_id', userId);
      if (medicationIntakes) userData.medication_intakes = medicationIntakes;

      // Fetch health_activities
      const { data: healthActivities } = await supabase
        .from('health_activities')
        .select('*')
        .eq('user_id', userId);
      if (healthActivities) userData.health_activities = healthActivities;

      // Fetch daily_tasks
      const { data: dailyTasks } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId);
      if (dailyTasks) userData.daily_tasks = dailyTasks;

      // Fetch user_goals
      const { data: userGoals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId);
      if (userGoals) userData.user_goals = userGoals;

      // Fetch therapeutic_goals
      const { data: therapeuticGoals } = await supabase
        .from('therapeutic_goals')
        .select('*')
        .eq('user_id', userId);
      if (therapeuticGoals) userData.therapeutic_goals = therapeuticGoals;

      // Fetch health_journey
      const { data: healthJourney } = await supabase
        .from('health_journey')
        .select('*')
        .eq('user_id', userId);
      if (healthJourney) userData.health_journey = healthJourney;

      // Fetch eq5d5l_responses
      const { data: eq5d5lResponses } = await supabase
        .from('eq5d5l_responses')
        .select('*')
        .eq('user_id', userId);
      if (eq5d5lResponses) userData.eq5d5l_responses = eq5d5lResponses;

      // Fetch gppaq_responses
      const { data: gppaqResponses } = await supabase
        .from('gppaq_responses')
        .select('*')
        .eq('user_id', userId);
      if (gppaqResponses) userData.gppaq_responses = gppaqResponses;

      // Fetch user_preferences
      const { data: userPreferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);
      if (userPreferences) userData.user_preferences = userPreferences;

      // Fetch user_consents
      const { data: userConsents } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId);
      if (userConsents) userData.user_consents = userConsents;

      return {
        userId,
        exportDate: new Date().toISOString(),
        data: userData
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  },

  // Delete all user data (GDPR right to erasure)
  async deleteUserData(userId: string): Promise<{ success: boolean }> {
    try {
      // Delete in order to avoid foreign key constraints
      await supabase.from('medication_intakes').delete().eq('user_id', userId);
      await supabase.from('medications').delete().eq('user_id', userId);
      await supabase.from('health_activities').delete().eq('user_id', userId);
      await supabase.from('health_metrics').delete().eq('user_id', userId);
      await supabase.from('daily_tasks').delete().eq('user_id', userId);
      await supabase.from('user_goals').delete().eq('user_id', userId);
      await supabase.from('therapeutic_goals').delete().eq('user_id', userId);
      await supabase.from('health_journey').delete().eq('user_id', userId);
      await supabase.from('eq5d5l_responses').delete().eq('user_id', userId);
      await supabase.from('gppaq_responses').delete().eq('user_id', userId);
      await supabase.from('user_preferences').delete().eq('user_id', userId);
      await supabase.from('user_consents').delete().eq('user_id', userId);
      await supabase.from('profiles').delete().eq('user_id', userId);

      await dataSecurityService.logSecurityEvent({
        action: 'USER_DATA_DELETED',
        userId: userId,
        resourceAccessed: 'all_user_tables'
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting user data:', error);
      return { success: false };
    }
  },

  // Validate health recommendations for FDA compliance
  validateHealthRecommendation(recommendation: string): boolean {
    const regulatedClaims = [
      /cure|cures|curing/i,
      /treat|treats|treatment for/i,
      /diagnose|diagnosis/i,
      /prevent|prevents|prevention of/i,
      /disease/i,
      /medical condition/i
    ];

    for (const pattern of regulatedClaims) {
      if (pattern.test(recommendation)) {
        console.warn('Health recommendation contains regulated medical claims');
        return false;
      }
    }

    return true;
  }
};
