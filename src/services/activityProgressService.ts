import { supabase } from "@/integrations/supabase/client";
import { healthActivityService } from "./healthActivityService";

export interface WeeklyActivityProgress {
  stepsPercentage: number;
  cardioPercentage: number;
  strengthPercentage: number;
  overallPercentage: number;
}

export const activityProgressService = {
  async getWeeklyProgress(userId: string): Promise<WeeklyActivityProgress> {
    try {
      // Get user goals
      const { data: goals, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId);

      if (goalsError) {
        console.error('Error fetching user goals:', goalsError);
        return { stepsPercentage: 0, cardioPercentage: 0, strengthPercentage: 0, overallPercentage: 0 };
      }

      // Get weekly activity data
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of current week
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date();
      weekEnd.setDate(weekStart.getDate() + 6); // End of current week
      weekEnd.setHours(23, 59, 59, 999);

      // Get activities for this week
      const activities = await healthActivityService.getHealthActivities(
        userId,
        undefined,
        weekStart,
        weekEnd
      );

      // Calculate progress for each goal type
      const stepsGoal = goals.find(g => g.goal_type === 'steps');
      const cardioGoal = goals.find(g => g.goal_type === 'cardio');
      const strengthGoal = goals.find(g => g.goal_type === 'strength');

      // Calculate steps progress (daily goal * 7 days)
      let stepsPercentage = 0;
      if (stepsGoal) {
        const weeklyStepsGoal = Number(stepsGoal.target_value) * 7;
        const totalSteps = activities
          .filter(a => a.activity_type === 'steps')
          .reduce((sum, a) => sum + Number(a.value), 0);
        stepsPercentage = Math.min((totalSteps / weeklyStepsGoal) * 100, 100);
      }

      // Calculate cardio progress (weekly goal)
      let cardioPercentage = 0;
      if (cardioGoal) {
        const weeklyCardioGoal = Number(cardioGoal.target_value);
        const totalCardio = activities
          .filter(a => a.activity_type === 'cardio')
          .reduce((sum, a) => sum + (Number(a.duration_minutes) || 0), 0);
        cardioPercentage = Math.min((totalCardio / weeklyCardioGoal) * 100, 100);
      }

      // Calculate strength progress (weekly goal)
      let strengthPercentage = 0;
      if (strengthGoal) {
        const weeklyStrengthGoal = Number(strengthGoal.target_value);
        const strengthSessions = activities.filter(a => a.activity_type === 'strength').length;
        strengthPercentage = Math.min((strengthSessions / weeklyStrengthGoal) * 100, 100);
      }

      // Calculate overall percentage (average of all goals)
      const validPercentages = [stepsPercentage, cardioPercentage, strengthPercentage].filter(p => p > 0);
      const overallPercentage = validPercentages.length > 0 
        ? validPercentages.reduce((sum, p) => sum + p, 0) / validPercentages.length 
        : 0;

      return {
        stepsPercentage: Math.round(stepsPercentage),
        cardioPercentage: Math.round(cardioPercentage),
        strengthPercentage: Math.round(strengthPercentage),
        overallPercentage: Math.round(overallPercentage)
      };
    } catch (error) {
      console.error('Error calculating weekly progress:', error);
      return { stepsPercentage: 0, cardioPercentage: 0, strengthPercentage: 0, overallPercentage: 0 };
    }
  }
};