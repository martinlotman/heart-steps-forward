
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, ExternalLink } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { getTopicEmoticon } from '@/utils/topicEmoticons';
import { dailyTasksService } from '@/services/dailyTasksService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type DailyRecommendation = Tables<'Lifestyle daily recommendations'>;

interface DailyRecommendationCardProps {
  recommendation: DailyRecommendation;
  isCompleted: boolean;
  onComplete: () => void;
}

const DailyRecommendationCard = ({ recommendation, isCompleted, onComplete }: DailyRecommendationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTaskClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkComplete = async () => {
    if (!user) return;
    
    setShowCompletion(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update education task in Supabase
      await dailyTasksService.updateDailyTask(today, 'education', true, user.id);
      
      // Update local storage for compatibility
      const existingTasks = localStorage.getItem(`dailyTasks_${today}`);
      const tasks = existingTasks ? JSON.parse(existingTasks) : {};
      const updatedTasks = { ...tasks, education: true };
      localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(updatedTasks));
      
      // Check if all daily tasks are completed
      if (updatedTasks.medications && updatedTasks.health && updatedTasks.education) {
        await dailyTasksService.updateHealthJourney(today, 'complete', user.id);
        localStorage.setItem(`healthJourney_${today}`, 'complete');
      }
      
      setTimeout(() => {
        onComplete();
        setShowCompletion(false);
        toast({
          title: "Learning completed!",
          description: "Great job on completing today's learning task.",
        });
      }, 2000);
    } catch (error) {
      console.error('Error completing learning task:', error);
      setShowCompletion(false);
      toast({
        title: "Error",
        description: "Failed to mark task as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  const emoticon = getTopicEmoticon(recommendation.Topic);

  return (
    <Card 
      className={`transition-all cursor-pointer ${
        isCompleted 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : 'hover:shadow-md'
      }`}
      onClick={handleTaskClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{emoticon}</div>
            <div>
              <CardTitle className={`text-lg font-semibold ${
                isCompleted ? 'text-green-800' : 'text-gray-800'
              }`}>
                {recommendation.Tip}
              </CardTitle>
              {recommendation.Topic && (
                <p className="text-sm text-gray-500">{recommendation.Topic}</p>
              )}
            </div>
          </div>
          {isCompleted && <Check className="text-green-600" size={20} />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {recommendation.Recommendation && (
              <div>
                <p className="text-gray-700 mb-3">
                  {recommendation.Recommendation}
                </p>
              </div>
            )}

            {recommendation.Reference && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center text-blue-700">
                  <ExternalLink size={16} className="mr-2" />
                  <a 
                    href={recommendation.Reference.split('�').pop() || recommendation.Reference} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more about this topic
                  </a>
                </div>
              </div>
            )}

            {!isCompleted && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkComplete();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={showCompletion}
              >
                {showCompletion ? 'Completing...' : 'Mark as Complete'}
              </Button>
            )}
          </div>
        </CardContent>
      )}

      {showCompletion && (
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center text-green-700">
              <Check className="mr-2" size={20} />
              <span className="font-medium">Learning task completed! Well done! 🎉</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DailyRecommendationCard;
