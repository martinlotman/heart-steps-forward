
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { OnboardingData } from '@/pages/Onboarding';

interface EQ5D5LStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
}

export const EQ5D5LStep: React.FC<EQ5D5LStepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  canGoNext,
  canGoBack,
}) => {
  const updateEQ5D5L = (field: string, value: string | number) => {
    updateData({
      eq5d5l: {
        ...data.eq5d5l,
        [field]: value,
      },
    });
  };

  const isValid = 
    data.eq5d5l.mobility && 
    data.eq5d5l.selfCare && 
    data.eq5d5l.usualActivities && 
    data.eq5d5l.painDiscomfort && 
    data.eq5d5l.anxietyDepression;

  const dimensions = [
    {
      key: 'mobility',
      title: 'Mobility',
      description: 'I have no problems in walking about',
    },
    {
      key: 'selfCare',
      title: 'Self-Care',
      description: 'I have no problems washing or dressing myself',
    },
    {
      key: 'usualActivities',
      title: 'Usual Activities',
      description: 'I have no problems doing my usual activities',
    },
    {
      key: 'painDiscomfort',
      title: 'Pain/Discomfort',
      description: 'I have no pain or discomfort',
    },
    {
      key: 'anxietyDepression',
      title: 'Anxiety/Depression',
      description: 'I am not anxious or depressed',
    },
  ];

  const levels = [
    { value: 'no-problems', label: 'No problems' },
    { value: 'slight-problems', label: 'Slight problems' },
    { value: 'moderate-problems', label: 'Moderate problems' },
    { value: 'severe-problems', label: 'Severe problems' },
    { value: 'extreme-problems', label: 'Extreme problems' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">EQ-5D-5L Health Assessment</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please indicate which statement best describes your health today in each of the following dimensions.
        </p>
      </div>

      {dimensions.map((dimension) => (
        <Card key={dimension.key}>
          <CardHeader>
            <CardTitle className="text-base">{dimension.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.eq5d5l[dimension.key as keyof typeof data.eq5d5l] as string}
              onValueChange={(value) => updateEQ5D5L(dimension.key, value)}
            >
              {levels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={`${dimension.key}-${level.value}`} />
                  <Label htmlFor={`${dimension.key}-${level.value}`}>{level.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please rate your health today on a scale from 0 (worst health you can imagine) to 100 (best health you can imagine).
            </p>
            <div className="px-4">
              <Slider
                value={[data.eq5d5l.healthScore]}
                onValueChange={(value) => updateEQ5D5L('healthScore', value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>0 (Worst)</span>
              <span className="font-medium text-lg text-gray-900">{data.eq5d5l.healthScore}</span>
              <span>100 (Best)</span>
            </div>
          </div>
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
