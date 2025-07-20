import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Dumbbell, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { healthActivityService } from '@/services/healthActivityService';
import { format, subDays } from 'date-fns';
import ActivityLogger from './ActivityLogger';

interface ActivityChartProps {
  activityType: 'cardio' | 'strength';
  title: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ activityType, title }) => {
  const { currentUserId } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTotal, setWeeklyTotal] = useState(0);

  const fetchActivities = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      const data = activityType === 'cardio' 
        ? await healthActivityService.getWeeklyCardio(currentUserId)
        : await healthActivityService.getWeeklyStrength(currentUserId);
      
      setActivities(data);
      
      // Calculate weekly total
      const total = data.reduce((sum, activity) => sum + (activity.value || 0), 0);
      setWeeklyTotal(total);
    } catch (error) {
      console.error(`Error fetching ${activityType} activities:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [currentUserId, activityType]);

  const getActivityIcon = () => {
    return activityType === 'cardio' ? Heart : Dumbbell;
  };

  const getActivityColor = () => {
    return activityType === 'cardio' ? 'text-red-600' : 'text-blue-600';
  };

  const getActivityBg = () => {
    return activityType === 'cardio' ? 'bg-red-50' : 'bg-blue-50';
  };

  const ActivityIcon = getActivityIcon();

  // Generate last 7 days for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.start_date);
      return activityDate.toDateString() === date.toDateString();
    });
    
    const dayTotal = dayActivities.reduce((sum, activity) => sum + (activity.value || 0), 0);
    
    return {
      date,
      total: dayTotal,
      activities: dayActivities,
      label: format(date, 'EEE')
    };
  }).reverse();

  const maxValue = Math.max(...last7Days.map(day => day.total), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <ActivityIcon className={`mr-2 ${getActivityColor()}`} size={20} />
            {title}
          </div>
          <ActivityLogger activityType={activityType} onActivityAdded={fetchActivities} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Weekly Summary */}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {weeklyTotal}
              </div>
              <div className="text-sm text-gray-600">
                {activityType === 'cardio' ? 'minutes' : 'sets'} this week
              </div>
            </div>

            {/* 7-Day Chart */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar size={14} className="mr-1" />
                Last 7 Days
              </h4>
              <div className="grid grid-cols-7 gap-1 h-20">
                {last7Days.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex-1 flex items-end w-full">
                      <div
                        className={`w-full rounded-t-sm ${getActivityBg()} transition-all duration-300`}
                        style={{
                          height: day.total > 0 ? `${(day.total / maxValue) * 100}%` : '2px',
                          minHeight: '2px'
                        }}
                        title={`${day.total} ${activityType === 'cardio' ? 'minutes' : 'sets'}`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {day.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recent Activities</h4>
              {activities.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No activities logged yet. Start by adding your first {activityType} session!
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ActivityIcon className={getActivityColor()} size={14} />
                        <div>
                          <div className="text-sm font-medium">
                            {activity.exercise_name || `${activityType} workout`}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center">
                            <Clock size={10} className="mr-1" />
                            {format(new Date(activity.start_date), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.duration_minutes ? `${activity.duration_minutes} min` : `${activity.value} ${activity.unit}`}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityChart;