
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notificationService";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TranslationsProvider } from "@/hooks/useTranslations";
import { AdminProvider } from "@/hooks/useAdminContext";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Health from "./pages/Health";
import HealthSync from "./pages/HealthSync";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import HealthJourney from "./pages/HealthJourney";
import PhysicalActivity from "./pages/PhysicalActivity";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize notification permissions on app start
    NotificationService.requestPermissions().catch(console.error);
  }, []);

  useEffect(() => {
    console.log('User changed:', user?.email, 'Loading:', loading);
    // Check if onboarding is complete by verifying user has a profile in database
    if (user) {
      const checkOnboardingStatus = async () => {
        try {
          // Import profileService
          const { profileService } = await import('@/services/profileService');
          const profile = await profileService.getUserProfile(user.id);
          const hasProfile = !!profile;
          console.log('Onboarding complete status:', hasProfile);
          setIsOnboardingComplete(hasProfile);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setIsOnboardingComplete(false);
        }
      };
      checkOnboardingStatus();
    } else {
      setIsOnboardingComplete(null);
    }
  }, [user]);

  // Show loading state while checking auth status
  if (loading) {
    console.log('App is loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show auth page
  if (!user) {
    console.log('User not authenticated, showing auth page');
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Authenticated but onboarding not complete
  if (isOnboardingComplete === false) {
    console.log('User authenticated but onboarding not complete');
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Still checking onboarding status
  if (isOnboardingComplete === null) {
    console.log('Still checking onboarding status...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated and onboarding complete - show main app
  console.log('User authenticated and onboarding complete, showing main app');
  return (
    <div>
      <MedicalDisclaimer variant="banner" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/medications" element={<Medications />} />  
            <Route path="/health" element={<Health />} />
            <Route path="/health/sync" element={<HealthSync />} />
        <Route path="/education" element={<Education />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/health-journey" element={<HealthJourney />} />
        <Route path="/physical-activity" element={<PhysicalActivity />} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <TranslationsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </TranslationsProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
