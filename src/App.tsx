
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NotificationService } from "@/services/notificationService";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Health from "./pages/Health";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import HealthJourney from "./pages/HealthJourney";
import PhysicalActivity from "./pages/PhysicalActivity";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize notification permissions on app start
    NotificationService.requestPermissions().catch(console.error);
    
    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    setIsOnboardingComplete(onboardingComplete === 'true');
  }, []);

  // Show loading state while checking onboarding status
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect to onboarding if not complete */}
            {!isOnboardingComplete && (
              <>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            )}
            
            {/* Main app routes - only accessible after onboarding */}
            {isOnboardingComplete && (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/medications" element={<Medications />} />
                <Route path="/health" element={<Health />} />
                <Route path="/education" element={<Education />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/health-journey" element={<HealthJourney />} />
                <Route path="/physical-activity" element={<PhysicalActivity />} />
                <Route path="/onboarding" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
