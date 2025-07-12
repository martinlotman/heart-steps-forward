
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
  // Record user consent for GDPR compliance
  async recordConsent(userId: string, consents: Record<string, boolean>) {
    try {
      await dataSecurityService.logSecurityEvent({
        action: 'CONSENT_RECORDED',
        userId,
        resourceAccessed: 'user_consent'
      });

      // Store consent records
      const consentRecords = Object.entries(consents).map(([type, consented]) => ({
        user_id: userId,
        consent_type: type,
        consented,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));

      // In production, this would be stored in a secure database table
      localStorage.setItem(`user_consent_${userId}`, JSON.stringify(consentRecords));
      
      return true;
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  },

  // Check if user has given required consents
  async hasValidConsent(userId: string, consentType: string): Promise<boolean> {
    try {
      const storedConsents = localStorage.getItem(`user_consent_${userId}`);
      if (!storedConsents) return false;

      const consents: ConsentRecord[] = JSON.parse(storedConsents);
      const consent = consents.find(c => c.consentType === consentType);
      
      return consent?.consented || false;
    } catch (error) {
      console.error('Failed to check consent:', error);
      return false;
    }
  },

  // Handle data subject rights requests (GDPR)
  async handleDataRequest(userId: string, requestType: 'access' | 'delete' | 'export'): Promise<any> {
    try {
      await dataSecurityService.logSecurityEvent({
        action: `DATA_REQUEST_${requestType.toUpperCase()}`,
        userId,
        resourceAccessed: 'user_data'
      });

      switch (requestType) {
        case 'access':
          return await this.exportUserData(userId);
        case 'delete':
          return await this.deleteUserData(userId);
        case 'export':
          return await this.exportUserData(userId);
        default:
          throw new Error('Invalid request type');
      }
    } catch (error) {
      console.error('Failed to handle data request:', error);
      throw error;
    }
  },

  // Export all user data (GDPR compliance)
  async exportUserData(userId: string) {
    try {
      const userData = {
        profile: await supabase.from('profiles').select('*').eq('user_id', userId),
        healthActivities: await supabase.from('health_activities').select('*').eq('user_id', userId),
        dailyTasks: await supabase.from('daily_tasks').select('*').eq('user_id', userId),
        gppaqResponses: await supabase.from('gppaq_responses').select('*').eq('user_id', userId),
        eq5d5lResponses: await supabase.from('eq5d5l_responses').select('*').eq('user_id', userId),
        healthJourney: await supabase.from('health_journey').select('*').eq('user_id', userId),
        consents: localStorage.getItem(`user_consent_${userId}`)
      };

      return userData;
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  },

  // Delete all user data (GDPR compliance)
  async deleteUserData(userId: string) {
    try {
      // Delete from all tables
      await Promise.all([
        supabase.from('profiles').delete().eq('user_id', userId),
        supabase.from('health_activities').delete().eq('user_id', userId),
        supabase.from('daily_tasks').delete().eq('user_id', userId),
        supabase.from('gppaq_responses').delete().eq('user_id', userId),
        supabase.from('eq5d5l_responses').delete().eq('user_id', userId),
        supabase.from('health_journey').delete().eq('user_id', userId)
      ]);

      // Remove local storage data
      localStorage.removeItem(`user_consent_${userId}`);
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('onboardingComplete');

      return { success: true };
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  },

  // Validate FDA compliance for health recommendations
  validateHealthRecommendation(recommendation: string): boolean {
    // Check for medical claims that might require FDA approval
    const regulatedClaims = [
      'cure', 'treat', 'prevent', 'diagnose', 'heal',
      'therapeutic', 'medical treatment', 'clinical'
    ];

    const lowerRec = recommendation.toLowerCase();
    const containsRegulatedClaim = regulatedClaims.some(claim => 
      lowerRec.includes(claim)
    );

    if (containsRegulatedClaim) {
      console.warn('Recommendation contains regulated medical claims:', recommendation);
      return false;
    }

    return true;
  }
};
