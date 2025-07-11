
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

interface OnboardingCompleteProps {
  onComplete: () => void;
  isSubmitting?: boolean;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onComplete,
  isSubmitting = false,
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold mb-2">Welcome to Your Health Journey!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for completing the onboarding process. Your health information will be saved 
          and will help us provide you with personalized recommendations and track your progress.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">What's Next?</h4>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Set up your medication schedule</li>
          <li>• Track your daily activities</li>
          <li>• Monitor your health progress</li>
          <li>• Access educational resources</li>
        </ul>
      </div>

      <Button onClick={onComplete} className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving your information...
          </>
        ) : (
          'Get Started'
        )}
      </Button>
    </div>
  );
};
