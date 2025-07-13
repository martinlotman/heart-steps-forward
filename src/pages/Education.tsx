
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check } from 'lucide-react';
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
          <p>Loading today's learning task...</p>
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
          <p className="text-red-600">Error loading today's learning task: {error}</p>
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
        {recommendation && (
          <DailyRecommendationCard
            recommendation={recommendation}
            isCompleted={isCompleted}
            onComplete={handleTaskComplete}
          />
        )}

        {!recommendation && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No learning task available for today.</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Education;
