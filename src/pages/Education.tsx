
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import DailyRecommendationCard from '@/components/DailyRecommendationCard';
import { useDailyRecommendations } from '@/hooks/useDailyRecommendations';

const Education = () => {
  const { recommendation, loading, error } = useDailyRecommendations();
  const [isCompleted, setIsCompleted] = useState(false);

  // Load completion status from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = localStorage.getItem(`dailyTasks_${today}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      setIsCompleted(tasks.education || false);
    }
  }, []);

  const handleTaskComplete = () => {
    setIsCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="text-gray-600" size={24} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">Learn & Complete</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading today's learning task...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="text-gray-600" size={24} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">Learn & Complete</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 mb-2">⚠️</div>
              <p className="text-red-800 font-medium mb-2">Unable to load learning tasks</p>
              <p className="text-red-600 text-sm">{error}</p>
            </CardContent>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Learn & Complete</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Daily Tip */}
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Play className="text-blue-600 mr-2" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Today's Learning</p>
                <p className="text-blue-600 text-sm">Complete today's learning task to improve your recovery journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mb-6">
          <Card className={`${isCompleted ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-gradient-to-r from-blue-50 to-green-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Progress</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {isCompleted ? '1 of 1 task completed' : '0 of 1 task completed'}
                  </p>
                </div>
                <div className="text-2xl">
                  {isCompleted ? '🎉' : '📚'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task completed message */}
        {isCompleted && (
          <div className="mb-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center text-green-700">
                  <Check className="mr-2" size={20} />
                  <span className="font-medium">Today's learning task completed! Great job! 🎉</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Recommendation */}
        {recommendation ? (
          <DailyRecommendationCard
            recommendation={recommendation}
            isCompleted={isCompleted}
            onComplete={handleTaskComplete}
          />
        ) : (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <BookOpen className="mx-auto mb-4 text-orange-600" size={48} />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">No Learning Tasks Available</h3>
              <p className="text-orange-700 text-sm">
                Learning recommendations are currently being prepared. Please check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Education;
