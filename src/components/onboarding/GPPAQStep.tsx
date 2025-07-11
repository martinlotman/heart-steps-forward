
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/pages/Onboarding';

interface GPPAQStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
}

export const GPPAQStep: React.FC<GPPAQStepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  canGoNext,
  canGoBack,
}) => {
  const updateGPPAQ = (field: string, value: string) => {
    updateData({
      gppaq: {
        ...data.gppaq,
        [field]: value,
      },
    });
  };

  const isValid = 
    data.gppaq.workType && 
    data.gppaq.physicalActivity && 
    data.gppaq.walkingCycling && 
    data.gppaq.housework;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Practice Physical Activity Questionnaire (GPPAQ)</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please answer the following questions about your physical activity levels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.gppaq.workType}
            onValueChange={(value) => updateGPPAQ('workType', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sedentary" id="sedentary" />
              <Label htmlFor="sedentary">Sedentary (sitting)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standing" id="standing" />
              <Label htmlFor="standing">Standing or walking, but no vigorous activity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual">Manual work</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="heavy" id="heavy" />
              <Label htmlFor="heavy">Heavy manual work</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Physical Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.gppaq.physicalActivity}
            onValueChange={(value) => updateGPPAQ('physicalActivity', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="exercise-none" />
              <Label htmlFor="exercise-none">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="exercise-light" />
              <Label htmlFor="exercise-light">Light exercise (1-3 hours per week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="exercise-moderate" />
              <Label htmlFor="exercise-moderate">Moderate exercise (3-5 hours per week)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vigorous" id="exercise-vigorous" />
              <Label htmlFor="exercise-vigorous">Vigorous exercise (5+ hours per week)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Walking and Cycling</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.gppaq.walkingCycling}
            onValueChange={(value) => updateGPPAQ('walkingCycling', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="walking-none" />
              <Label htmlFor="walking-none">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="less-1h" id="walking-less-1h" />
              <Label htmlFor="walking-less-1h">Less than 1 hour per week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-3h" id="walking-1-3h" />
              <Label htmlFor="walking-1-3h">1-3 hours per week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3h-plus" id="walking-3h-plus" />
              <Label htmlFor="walking-3h-plus">3+ hours per week</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Housework</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.gppaq.housework}
            onValueChange={(value) => updateGPPAQ('housework', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="housework-none" />
              <Label htmlFor="housework-none">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="housework-light" />
              <Label htmlFor="housework-light">Light housework (dusting, washing dishes)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="housework-moderate" />
              <Label htmlFor="housework-moderate">Moderate housework (vacuuming, cleaning)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="heavy" id="housework-heavy" />
              <Label htmlFor="housework-heavy">Heavy housework (moving furniture, scrubbing)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid || !canGoNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
