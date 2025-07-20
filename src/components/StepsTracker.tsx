import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Target, TrendingUp, Smartphone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { healthActivityService } from '@/services/healthActivityService';
import { useHealthSync } from '@/hooks/useHealthSync';

interface StepsTrackerProps {
  goal?: number;
  onStepsUpdate?: (steps: number) => void;
}

const StepsTracker: React.FC<StepsTrackerProps> = ({ goal = 10000, onStepsUpdate }) => {
  const { currentUserId } = useAuth();
  const { isConnected, syncHealthData, getTodaysSteps: getHealthSyncSteps } = useHealthSync();
  const [todaysSteps, setTodaysSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTodaysSteps = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      const steps = await healthActivityService.getTodaysSteps(currentUserId);
      setTodaysSteps(steps);
      onStepsUpdate?.(steps);
    } catch (error) {
      console.error('Error fetching today\'s steps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysSteps();
  }, [currentUserId]);

  // Update steps when health sync data changes
  useEffect(() => {
    if (isConnected) {
      const healthSyncSteps = getHealthSyncSteps();
      if (healthSyncSteps > 0) {
        setTodaysSteps(healthSyncSteps);
        onStepsUpdate?.(healthSyncSteps);
      }
    }
  }, [isConnected, getHealthSyncSteps, onStepsUpdate]);

  const progressPercentage = Math.min((todaysSteps / goal) * 100, 100);
  const isGoalReached = todaysSteps >= goal;

  const getStepsStatus = () => {
    if (todaysSteps < goal * 0.3) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Low' };
    if (todaysSteps < goal * 0.7) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Moderate' };
    if (todaysSteps < goal) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Good' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'Excellent' };
  };

  const status = getStepsStatus();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="mr-2 text-blue-600" size={20} />
            Daily Steps
          </div>
          {isConnected && (
            <Badge variant="outline" className="text-xs">
              <Smartphone size={10} className="mr-1" />
              Synced
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {todaysSteps.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                of {goal.toLocaleString()} steps
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <Badge variant="outline" className={`text-xs ${status.color} ${status.bg}`}>
                  {status.label}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-right text-sm text-gray-600">
                {Math.round(progressPercentage)}%
              </div>
            </div>

            {isGoalReached && (
              <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                <Target className="text-green-600 mr-2" size={16} />
                <span className="text-sm text-green-800 font-medium">
                  Daily goal achieved! 🎉
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Remaining</div>
                <div className="font-medium text-gray-800">
                  {Math.max(0, goal - todaysSteps).toLocaleString()}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Est. Distance</div>
                <div className="font-medium text-gray-800">
                  {(todaysSteps * 0.0008).toFixed(1)} km
                </div>
              </div>
            </div>

            {!isConnected && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncHealthData}
                className="w-full"
              >
                <TrendingUp className="mr-1" size={14} />
                Connect Health Data
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StepsTracker;