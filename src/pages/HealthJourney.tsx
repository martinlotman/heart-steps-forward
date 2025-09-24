
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useJourneyData } from '@/hooks/useJourneyData';
import { useToast } from '@/hooks/use-toast';
import { streakService } from '@/services/streakService';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneyStats from '@/components/journey/JourneyStats';
import JourneyTimeline from '@/components/journey/JourneyTimeline';
import JourneyLegend from '@/components/journey/JourneyLegend';
import DayDetailsModal from '@/components/journey/DayDetailsModal';

interface DayProgress {
  day: number;
  date: string;
  dateKey: string;
  medicationsCompleted: boolean;
  healthMetricsLogged: boolean;
  educationCompleted: boolean;
  tasksCompleted: number;
  status: 'complete' | 'partial' | 'incomplete';
}

const HealthJourney = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const { journeyData, daysSinceMI, streakInfo, loading } = useJourneyData(user?.id);

  const completeDays = journeyData.filter(day => day.status === 'complete').length;
  const partialDays = journeyData.filter(day => day.status === 'partial').length;
  const incompleteDays = journeyData.filter(day => day.status === 'incomplete').length;
  const overallProgress = journeyData.length > 0 ? (completeDays / journeyData.length) * 100 : 0;

  const handleDayClick = (day: DayProgress) => {
    setSelectedDay(day);
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  // Handle streak notifications
  useEffect(() => {
    if (!user?.id || loading) return;

    const checkAndShowNotifications = async () => {
      // Check for streak achievement notification
      if (streakService.shouldShowStreakAchievement(streakInfo)) {
        const hasShownAchievement = await streakService.hasShownNotificationToday(user.id, 'achievement');
        
        if (!hasShownAchievement) {
          const message = streakService.getStreakMessage(streakInfo);
          if (message) {
            toast({
              title: "Streak Achievement! 🔥",
              description: message,
              duration: 6000,
            });
            await streakService.markNotificationShown(user.id, 'achievement');
          }
        }
      }

      // Check for streak warning notification  
      if (streakService.shouldShowStreakWarning(streakInfo)) {
        const hasShownWarning = await streakService.hasShownNotificationToday(user.id, 'warning');
        
        if (!hasShownWarning) {
          const message = streakService.getStreakMessage(streakInfo);
          if (message) {
            toast({
              title: "Streak Alert! ⚠️",
              description: message,
              variant: "destructive",
              duration: 8000,
            });
            await streakService.markNotificationShown(user.id, 'warning');
          }
        }
      }
    };

    checkAndShowNotifications();
  }, [user?.id, streakInfo, loading, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
        <JourneyHeader overallProgress={0} daysSinceMI={0} />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your health journey...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <JourneyHeader overallProgress={overallProgress} daysSinceMI={daysSinceMI} />

      <div className="max-w-md mx-auto px-4 py-6">
        <JourneyStats 
          completeDays={completeDays}
          partialDays={partialDays}
          incompleteDays={incompleteDays}
          streakInfo={streakInfo}
        />

        <JourneyTimeline 
          journeyData={journeyData}
          onDayClick={handleDayClick}
        />

        <JourneyLegend />
      </div>

      {selectedDay && (
        <DayDetailsModal 
          selectedDay={selectedDay}
          onClose={closeModal}
        />
      )}

      <Navigation />
    </div>
  );
};

export default HealthJourney;
