import React, { useState, useEffect } from 'react';
import { Target, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { goalService, getGoalDisplayInfo } from '@/services/goalService';

interface GoalSettingDialogProps {
  goalType: 'steps' | 'cardio' | 'strength';
  children: React.ReactNode;
  onGoalUpdated?: () => void;
}

const GoalSettingDialog: React.FC<GoalSettingDialogProps> = ({
  goalType,
  children,
  onGoalUpdated
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [loadingCurrentGoal, setLoadingCurrentGoal] = useState(false);
  const { currentUserId } = useAuth();
  const { toast } = useToast();

  const goalInfo = getGoalDisplayInfo(goalType);

  useEffect(() => {
    if (open && currentUserId) {
      loadCurrentGoal();
    }
  }, [open, currentUserId, goalType]);

  const loadCurrentGoal = async () => {
    if (!currentUserId) return;
    
    try {
      setLoadingCurrentGoal(true);
      const existingGoal = await goalService.getGoalByType(currentUserId, goalType);
      
      if (existingGoal) {
        setTargetValue(existingGoal.target_value);
      } else {
        setTargetValue(goalInfo.defaultValue);
      }
    } catch (error) {
      console.error('Error loading current goal:', error);
      setTargetValue(goalInfo.defaultValue);
    } finally {
      setLoadingCurrentGoal(false);
    }
  };

  const handleSaveGoal = async () => {
    if (!currentUserId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to set goals.',
      });
      return;
    }

    if (targetValue < goalInfo.min || targetValue > goalInfo.max) {
      toast({
        variant: 'destructive',
        title: 'Invalid Goal',
        description: `Please enter a value between ${goalInfo.min} and ${goalInfo.max}.`,
      });
      return;
    }

    try {
      setLoading(true);
      
      await goalService.createOrUpdateGoal(currentUserId, {
        goal_type: goalType,
        target_value: targetValue,
        unit: goalInfo.unit
      });

      toast({
        title: 'Goal Set Successfully',
        description: `Your ${goalInfo.title.toLowerCase()} has been updated to ${targetValue} ${goalInfo.unit}.`,
      });

      setOpen(false);
      onGoalUpdated?.();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your goal. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTargetValue(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="mr-2 text-blue-600" size={20} />
            {goalInfo.title}
          </DialogTitle>
          <DialogDescription>
            {goalInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        {loadingCurrentGoal ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span className="text-sm text-gray-600">Loading current goal...</span>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target-value" className="text-right">
                Target
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="target-value"
                    type="number"
                    value={targetValue}
                    onChange={handleInputChange}
                    placeholder={goalInfo.placeholder}
                    min={goalInfo.min}
                    max={goalInfo.max}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {goalInfo.unit}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Range: {goalInfo.min} - {goalInfo.max} {goalInfo.unit}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveGoal}
                disabled={loading || targetValue < goalInfo.min || targetValue > goalInfo.max}
              >
                {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                Save Goal
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GoalSettingDialog;