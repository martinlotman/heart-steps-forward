import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { adminService, AdminUser } from '@/services/adminService';

interface AdminContextType {
  isAdmin: boolean;
  impersonatedUserId: string | null;
  allUsers: AdminUser[];
  loading: boolean;
  impersonateUser: (userId: string) => void;
  stopImpersonation: () => void;
  refreshUsers: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setImpersonatedUserId(null);
      setAllUsers([]);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const adminStatus = await adminService.checkIfUserIsAdmin(user.id);
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        await refreshUsers();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const refreshUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const users = await adminService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const impersonateUser = (userId: string) => {
    setImpersonatedUserId(userId);
    localStorage.setItem('impersonatedUserId', userId);
  };

  const stopImpersonation = () => {
    setImpersonatedUserId(null);
    localStorage.removeItem('impersonatedUserId');
  };

  // Restore impersonation on page reload
  useEffect(() => {
    const saved = localStorage.getItem('impersonatedUserId');
    if (saved && isAdmin) {
      setImpersonatedUserId(saved);
    }
  }, [isAdmin]);

  const value: AdminContextType = {
    isAdmin,
    impersonatedUserId,
    allUsers,
    loading,
    impersonateUser,
    stopImpersonation,
    refreshUsers
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}