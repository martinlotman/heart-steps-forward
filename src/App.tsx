import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notificationService";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Health from "./pages/Health";
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
    // Check if onboarding is complete when user changes
    if (user) {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      setIsOnboardingComplete(onboardingComplete === 'true');
    } else {
      setIsOnboardingComplete(null);
    }
  }, [user]);

  // Show loading state while checking auth status
  if (loading || (user && isOnboardingComplete === null)) {
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
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Authenticated but onboarding not complete
  if (!isOnboardingComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Authenticated and onboarding complete - show main app
  return (
    <div>
      <MedicalDisclaimer variant="banner" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/medications" element={<Medications />} />  
        <Route path="/health" element={<Health />} />
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
