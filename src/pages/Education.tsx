
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import LifestyleTaskCard from '@/components/LifestyleTaskCard';
import { useLifestyleRecommendations } from '@/hooks/useLifestyleRecommendations';

const Education = () => {
  const { recommendations, loading, error } = useLifestyleRecommendations();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Load completed tasks from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedCompletedTasks = localStorage.getItem(`completedLifestyleTasks_${today}`);
    if (savedCompletedTasks) {
      setCompletedTasks(new Set(JSON.parse(savedCompletedTasks)));
    }
  }, []);

  const handleTaskComplete = (taskName: string, performanceIndicator: string) => {
    const today = new Date().toDateString();
    const newCompletedTasks = new Set([...completedTasks, taskName]);
    setCompletedTasks(newCompletedTasks);
    
    // Save to localStorage
    localStorage.setItem(`completedLifestyleTasks_${today}`, JSON.stringify([...newCompletedTasks]));
    
    // Update education task completion in daily tasks
    const savedTasks = localStorage.getItem(`dailyTasks_${today}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.education = true;
      localStorage.setItem(`dailyTasks_${today}`, JSON.stringify(tasks));
      
      // Check if all daily tasks are completed
      if (tasks.medications && tasks.health && tasks.education) {
        localStorage.setItem(`healthJourney_${today}`, 'complete');
      }
    }
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
              <h1 className="text-xl font-semibold text-gray-800">Education</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <p>Loading recommendations...</p>
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
              <h1 className="text-xl font-semibold text-gray-800">Education</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <p className="text-red-600">Error loading recommendations: {error}</p>
        </div>
        <Navigation />
      </div>
    );
  }

  const completedCount = completedTasks.size;
  const totalCount = recommendations.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Education</h1>
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
                <p className="text-blue-800 font-medium">Daily Tip</p>
                <p className="text-blue-600 text-sm">Complete learning tasks to improve your recovery journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {totalCount > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Progress</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {completedCount} of {totalCount} tasks completed
                    </p>
                  </div>
                  <div className="text-2xl">
                    {completedCount === totalCount ? '🎉' : '📚'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All tasks completed message */}
        {completedCount === totalCount && totalCount > 0 && (
          <div className="mb-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center text-green-700">
                  <Check className="mr-2" size={20} />
                  <span className="font-medium">All learning tasks completed! Great job! 🎉</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lifestyle Recommendations */}
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <LifestyleTaskCard
              key={index}
              recommendation={recommendation}
              isCompleted={completedTasks.has(recommendation.Task)}
              onComplete={handleTaskComplete}
            />
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No lifestyle recommendations available at the moment.</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Education;
