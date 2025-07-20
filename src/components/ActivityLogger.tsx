import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Dumbbell, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { healthActivityService } from '@/services/healthActivityService';
import { useToast } from '@/hooks/use-toast';

interface ActivityLoggerProps {
  activityType: 'cardio' | 'strength';
  onActivityAdded: () => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ activityType, onActivityAdded }) => {
  const { currentUserId } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: '',
    duration: '',
    intensity: '',
    notes: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const cardioExercises = [
    'Walking', 'Running', 'Cycling', 'Swimming', 'Rowing', 'Elliptical', 
    'Stair Climbing', 'Dancing', 'Jumping Rope', 'Other'
  ];

  const strengthExercises = [
    'Push-ups', 'Pull-ups', 'Squats', 'Deadlifts', 'Bench Press', 'Shoulder Press',
    'Bicep Curls', 'Tricep Dips', 'Planks', 'Lunges', 'Other'
  ];

  const exercises = activityType === 'cardio' ? cardioExercises : strengthExercises;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "Please log in to track activities",
        variant: "destructive"
      });
      return;
    }

    try {
      const now = new Date();
      const activityData = {
        activityType,
        value: activityType === 'cardio' ? parseInt(formData.duration) || 0 : parseInt(formData.sets) || 0,
        unit: activityType === 'cardio' ? 'minutes' : 'sets',
        startDate: now,
        endDate: now,
        source: 'manual' as const,
        exerciseName: formData.exerciseName,
        duration: parseInt(formData.duration) || 0,
        notes: `${formData.notes}${activityType === 'strength' ? ` | Sets: ${formData.sets}, Reps: ${formData.reps}, Weight: ${formData.weight}kg` : ` | Intensity: ${formData.intensity}`}`
      };

      await healthActivityService.saveHealthActivity(activityData, currentUserId);
      
      toast({
        title: "Activity Logged",
        description: `${formData.exerciseName} has been added to your ${activityType} log`,
      });

      setFormData({
        exerciseName: '',
        duration: '',
        intensity: '',
        notes: '',
        sets: '',
        reps: '',
        weight: ''
      });
      setIsOpen(false);
      onActivityAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-1" />
          Log {activityType === 'cardio' ? 'Cardio' : 'Strength'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {activityType === 'cardio' ? <Heart className="mr-2" size={20} /> : <Dumbbell className="mr-2" size={20} />}
            Log {activityType === 'cardio' ? 'Cardio' : 'Strength'} Activity
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="exercise">Exercise</Label>
            <Select value={formData.exerciseName} onValueChange={(value) => setFormData(prev => ({ ...prev, exerciseName: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise} value={exercise}>
                    {exercise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="30"
              required
            />
          </div>

          {activityType === 'cardio' && (
            <div>
              <Label htmlFor="intensity">Intensity</Label>
              <Select value={formData.intensity} onValueChange={(value) => setFormData(prev => ({ ...prev, intensity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activityType === 'strength' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData(prev => ({ ...prev, sets: e.target.value }))}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                    placeholder="12"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="50"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did it feel? Any observations..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Log Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogger;