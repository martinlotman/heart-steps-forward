
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { OnboardingData } from '@/pages/Onboarding';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';

interface PersonalInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  canGoNext: boolean;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  updateData,
  onNext,
  canGoNext,
}) => {
  const { user } = useAuth();

  // Load existing profile data if available
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (user) {
        try {
          const profile = await profileService.getUserProfile(user.id);
          if (profile) {
            updateData({
              name: profile.name || data.name,
              age: profile.age || data.age,
              dateOfMI: profile.date_of_mi ? new Date(profile.date_of_mi) : data.dateOfMI,
            });
          }
        } catch (error) {
          console.error('Error loading existing profile:', error);
        }
      }
    };

    // Only load if the form is empty
    if (!data.name && !data.age && !data.dateOfMI) {
      loadExistingProfile();
    }
  }, [user, data.name, data.age, data.dateOfMI, updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.name && data.age > 0 && data.dateOfMI) {
      onNext();
    }
  };

  const isValid = data.name.trim() !== '' && data.age > 0 && data.dateOfMI !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            placeholder="Enter your age"
            min="18"
            max="120"
            required
          />
        </div>

        <div>
          <Label>Date of Myocardial Infarction</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.dateOfMI && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.dateOfMI ? format(data.dateOfMI, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.dateOfMI || undefined}
                onSelect={(date) => updateData({ dateOfMI: date || null })}
                disabled={(date) => date > new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || !canGoNext}>
          Next
        </Button>
      </div>
    </form>
  );
};
