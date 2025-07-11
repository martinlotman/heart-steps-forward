
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoStep } from '@/components/onboarding/PersonalInfoStep';
import { GPPAQStep } from '@/components/onboarding/GPPAQStep';
import { EQ5D5LStep } from '@/components/onboarding/EQ5D5LStep';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';

export interface OnboardingData {
  name: string;
  age: number;
  dateOfMI: Date | null;
  gppaq: {
    workType: string;
    physicalActivity: string;
    walkingCycling: string;
    housework: string;
  };
  eq5d5l: {
    mobility: string;
    selfCare: string;
    usualActivities: string;
    painDiscomfort: string;
    anxietyDepression: string;
    healthScore: number;
  };
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    age: 0,
    dateOfMI: null,
    gppaq: {
      workType: '',
      physicalActivity: '',
      walkingCycling: '',
      housework: '',
    },
    eq5d5l: {
      mobility: '',
      selfCare: '',
      usualActivities: '',
      painDiscomfort: '',
      anxietyDepression: '',
      healthScore: 50,
    },
  });

  const steps = [
    { title: 'Personal Information', component: PersonalInfoStep },
    { title: 'Physical Activity Assessment', component: GPPAQStep },
    { title: 'Health Assessment', component: EQ5D5LStep },
    { title: 'Complete', component: OnboardingComplete },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Store onboarding data (you can save to local storage or send to backend)
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/');
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome to Your Health Journey
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{steps[currentStep].title}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={onboardingData}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
              onComplete={handleComplete}
              canGoNext={currentStep < steps.length - 1}
              canGoBack={currentStep > 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
