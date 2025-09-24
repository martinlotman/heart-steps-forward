import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import type { StreakInfo } from '@/services/streakService';

interface JourneyStatsProps {
  completeDays: number;
  partialDays: number;
  incompleteDays: number;
  streakInfo: StreakInfo;
}

const JourneyStats = ({ completeDays, partialDays, incompleteDays, streakInfo }: JourneyStatsProps) => {
  return (
    <>
      {/* Streak Display - Only show if user has a streak >= 3 */}
      {streakInfo.currentStreak >= 3 && (
        <Card className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Flame className="text-orange-500 animate-pulse" size={24} />
                  <span className="text-2xl font-bold text-orange-600">
                    {streakInfo.currentStreak}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-orange-700">Day Streak!</div>
                  <div className="text-xs text-orange-600">Keep it going!</div>
                </div>
              </div>
              {streakInfo.longestStreak > streakInfo.currentStreak && (
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Trophy className="text-yellow-500" size={16} />
                    <span className="text-sm font-semibold text-gray-600">
                      Best: {streakInfo.longestStreak}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completeDays}</div>
          <div className="text-xs text-green-700">Perfect Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{partialDays}</div>
          <div className="text-xs text-yellow-700">Partial Days</div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{incompleteDays}</div>
          <div className="text-xs text-red-700">Missed Days</div>
        </CardContent>
      </Card>
      </div>
    </>
  );
};

export default JourneyStats;