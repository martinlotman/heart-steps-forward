import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

export interface SecurityAuditLog {
  action: string;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  resourceAccessed?: string;
}

export const dataSecurityService = {
  // Log security-relevant actions using secure database storage
  async logSecurityEvent(event: Omit<SecurityAuditLog, 'timestamp'>) {
    try {
      const { data, error } = await supabase.rpc('log_audit_event', {
        _user_id: event.userId,
        _action: event.action,
        _resource_accessed: event.resourceAccessed || null,
        _ip_address: event.ipAddress || null,
        _user_agent: event.userAgent || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }

      return data;
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  },

  // Validate data before processing using proper sanitization library
  sanitizeHealthData(data: any): any {
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        // Use DOMPurify for proper XSS prevention
        // Strip all HTML tags for health data as we don't need formatting
        sanitized[key] = DOMPurify.sanitize(sanitized[key], {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true
        }).trim();
      }
    });
    
    return sanitized;
  },

  // Check for suspicious activity patterns
  async checkForSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', oneMinuteAgo);

      if (error) {
        console.error('Error checking suspicious activity:', error);
        return false;
      }
      
      // Flag if more than 10 actions in the last minute
      return (data?.length || 0) > 10;
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
      return false;
    }
  },

  // Validate session and check for session hijacking
  async validateSession(userId: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.id !== userId) {
        await this.logSecurityEvent({
          action: 'INVALID_SESSION_ACCESS',
          userId: userId,
          resourceAccessed: 'session_validation'
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }
};
