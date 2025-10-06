
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  currentUserId: string | null; // Either authenticated user or impersonated user
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user ID (either authenticated user or impersonated user)
  const getCurrentUserId = (): string | null => {
    // Only allow impersonation if we have a valid authenticated user
    if (!user?.id) {
      return null;
    }
    
    // For now, let's disable impersonation to ensure users see only their own data
    // TODO: Implement proper admin role checking before allowing impersonation
    const impersonatedUserId = localStorage.getItem('impersonatedUserId');
    if (impersonatedUserId) {
      console.warn('Clearing impersonatedUserId to prevent data leakage');
      localStorage.removeItem('impersonatedUserId');
    }
    
    return user.id;
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }
      
      console.log('SignUp successful:', data.user?.email, 'Session:', !!data.session);
      return { error: null, session: data.session, user: data.user };
    } catch (error) {
      console.error('SignUp exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }
      
      console.log('SignIn successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('SignIn exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear local storage first (including impersonation)
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('impersonatedUserId');
      
      // Clear any other potentially problematic localStorage items
      Object.keys(localStorage).forEach((key) => {
        if (key.includes('impersonated') || key.includes('admin')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear all Supabase auth keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('SignOut error:', error);
      }
      
      console.log('SignOut successful');
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('SignOut exception:', error);
      // Force redirect even if signOut fails
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    currentUserId: getCurrentUserId(),
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
