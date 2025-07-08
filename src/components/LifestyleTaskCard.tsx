
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Check, Clock } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type LifestyleRecommendation = Tables<'Lifestyle'>;

interface LifestyleTaskCardProps {
  recommendation: LifestyleRecommendation;
  isCompleted: boolean;
  onComplete: (taskName: string, performanceIndicator: string) => void;
}

const LifestyleTaskCard = ({ recommendation, isCompleted, onComplete }: LifestyleTaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleTaskClick = () => {
    if (!isCompleted) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMarkComplete = () => {
    setShowCompletion(true);
    setTimeout(() => {
      onComplete(recommendation.Task, recommendation['Performance Indicator'] || '');
      setShowCompletion(false);
    }, 2000);
  };

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
            <BookOpen className={`mr-3 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} size={24} />
            <div>
              <CardTitle className={`text-lg font-semibold ${
                isCompleted ? 'text-green-800' : 'text-gray-800'
              }`}>
                {recommendation.Task}
              </CardTitle>
            </div>
          </div>
          {isCompleted && <Check className="text-green-600" size={20} />}
        </div>
      </CardHeader>

      {isExpanded && !isCompleted && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-3">
                {recommendation['Patient-Friendly Description']}
              </p>
              {recommendation['Time Needed'] && (
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">{recommendation['Time Needed']}</span>
                </div>
              )}
            </div>

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
          </div>
        </CardContent>
      )}

      {showCompletion && recommendation['Performance Indicator'] && (
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center text-green-700">
              <Check className="mr-2" size={20} />
              <span className="font-medium">{recommendation['Performance Indicator']}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LifestyleTaskCard;
