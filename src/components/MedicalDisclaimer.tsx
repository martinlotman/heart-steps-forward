
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'card' | 'banner' | 'modal';
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ 
  variant = 'banner', 
  className = '' 
}) => {
  const content = (
    <>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong>Important Medical Disclaimer:</strong> This application is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this application. If you think you may have a medical emergency, call your doctor or emergency services immediately.
      </AlertDescription>
    </>
  );

  if (variant === 'card') {
    return (
      <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
        {content}
      </Alert>
    );
  }

  return (
    <Alert className={`border-amber-200 bg-amber-50 mb-4 ${className}`}>
      {content}
    </Alert>
  );
};
