
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoStep } from '@/components/onboarding/PersonalInfoStep';
import { GPPAQStep } from '@/components/onboarding/GPPAQStep';
import { EQ5D5LStep } from '@/components/onboarding/EQ5D5LStep';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';
import { ConsentForm } from '@/components/ConsentForm';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { useAuth } from '@/hooks/useAuth';
import { onboardingService } from '@/services/onboardingService';
import { complianceService } from '@/services/complianceService';
import { dataSecurityService } from '@/services/dataSecurityService';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
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
    { title: 'Consent & Disclaimer', component: 'consent' },
    { title: 'Personal Information', component: PersonalInfoStep },
    { title: 'Physical Activity Assessment', component: GPPAQStep },
    { title: 'Health Assessment', component: EQ5D5LStep },
    { title: 'Complete', component: OnboardingComplete },
  ];

  const handleConsent = async (consented: boolean) => {
    if (!user) return;

    if (consented) {
      try {
        await complianceService.recordConsent(user.id, {
          data_collection: true,
          medical_disclaimer: true,
          privacy_policy: true,
          research_participation: true
        });

        await dataSecurityService.logSecurityEvent({
          action: 'ONBOARDING_CONSENT_GIVEN',
          userId: user.id
        });

        setConsentGiven(true);
        setCurrentStep(1);
      } catch (error) {
        toast({
          title: "Error recording consent",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Consent required",
        description: "You must consent to data processing to use CardiacCare",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) { // Can't go back to consent step
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete onboarding",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Sanitize data before saving
      const sanitizedData = dataSecurityService.sanitizeHealthData(onboardingData);
      
      // Save onboarding data to Supabase
      await onboardingService.saveCompleteOnboarding(sanitizedData, user.id);
      
      // Log completion
      await dataSecurityService.logSecurityEvent({
        action: 'ONBOARDING_COMPLETED',
        userId: user.id
      });
      
      // Store onboarding completion in localStorage
      localStorage.setItem('onboardingData', JSON.stringify(sanitizedData));
      localStorage.setItem('onboardingComplete', 'true');
      
      toast({
        title: "Onboarding complete!",
        description: "Your health information has been saved successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error saving data",
        description: "There was an issue saving your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <MedicalDisclaimer variant="card" />
            <ConsentForm onConsent={handleConsent} isLoading={isSubmitting} />
          </div>
        );
      case 1:
        return (
          <PersonalInfoStep
            data={onboardingData}
            updateData={updateData}
            onNext={handleNext}
            canGoNext={currentStep < steps.length - 1}
          />
        );
      case 2:
        return (
          <GPPAQStep
            data={onboardingData}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={currentStep < steps.length - 1}
            canGoBack={currentStep > 1}
          />
        );
      case 3:
        return (
          <EQ5D5LStep
            data={onboardingData}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
            canGoNext={currentStep < steps.length - 1}
            canGoBack={currentStep > 1}
          />
        );
      case 4:
        return (
          <OnboardingComplete
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome to CardiacCare
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
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
