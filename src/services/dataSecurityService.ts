import { supabase } from '@/integrations/supabase/client';

export interface SecurityAuditLog {
  action: string;
  userId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  resourceAccessed?: string;
}

export const dataSecurityService = {
  // Log security-relevant actions
  async logSecurityEvent(event: Omit<SecurityAuditLog, 'timestamp'>) {
    try {
      // In a production environment, this would go to a secure audit log
      console.log('Security Event:', {
        ...event,
        timestamp: new Date().toISOString()
      });
      
      // Store in localStorage for demonstration (in production, use secure backend)
      const existingLogs = localStorage.getItem('securityAuditLogs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('securityAuditLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  },

  // Validate data before processing
  sanitizeHealthData(data: any): any {
    // Remove any potential XSS or injection attempts
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        // Basic sanitization - in production, use a proper sanitization library
        sanitized[key] = sanitized[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    });
    
    return sanitized;
  },

  // Check for suspicious activity patterns
  async checkForSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const logs = localStorage.getItem('securityAuditLogs');
      if (!logs) return false;
      
      const auditLogs: SecurityAuditLog[] = JSON.parse(logs);
      const userLogs = auditLogs.filter(log => log.userId === userId);
      const recentLogs = userLogs.filter(log => 
        new Date(log.timestamp).getTime() > Date.now() - 60000 // Last minute
      );
      
      // Flag if more than 10 actions in the last minute
      return recentLogs.length > 10;
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
      return false;
    }
  },

  // Encrypt sensitive data before storage (simplified version)
  encryptSensitiveData(data: string): string {
    // In production, use proper encryption library like crypto-js
    // This is a simple base64 encoding for demonstration
    try {
      return btoa(data);
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  },

  // Decrypt sensitive data after retrieval
  decryptSensitiveData(encryptedData: string): string {
    // In production, use proper decryption
    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
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
