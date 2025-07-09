
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { NotificationService } from "@/services/notificationService";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Health from "./pages/Health";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import HealthJourney from "./pages/HealthJourney";
import PhysicalActivity from "./pages/PhysicalActivity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize notification permissions on app start
    NotificationService.requestPermissions().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/health" element={<Health />} />
            <Route path="/education" element={<Education />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/health-journey" element={<HealthJourney />} />
            <Route path="/physical-activity" element={<PhysicalActivity />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
