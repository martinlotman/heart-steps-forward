
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConsentFormProps {
  onConsent: (consented: boolean) => void;
  isLoading?: boolean;
}

export const ConsentForm: React.FC<ConsentFormProps> = ({ onConsent, isLoading }) => {
  const [consents, setConsents] = useState({
    dataCollection: false,
    medicalDisclaimer: false,
    privacyPolicy: false,
    researchParticipation: false
  });

  const allConsentsGiven = Object.values(consents).every(consent => consent);

  const handleConsentChange = (key: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = () => {
    if (allConsentsGiven) {
      onConsent(true);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Informed Consent & Data Agreement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-64 border rounded p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold">Purpose of Data Collection</h4>
              <p className="text-gray-600">
                CardiacCare collects your health information to provide personalized cardiac recovery support, 
                track your progress, and improve your overall health outcomes following a myocardial infarction.
              </p>
            </section>
            
            <section>
              <h4 className="font-semibold">Types of Data Collected</h4>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Personal information (name, age, contact details)</li>
                <li>• Medical history related to your cardiac event</li>
                <li>• Physical activity and health metrics</li>
                <li>• Medication adherence information</li>
                <li>• Quality of life assessment responses</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold">Data Security & Privacy</h4>
              <p className="text-gray-600">
                Your data is encrypted, stored securely, and access is limited to authorized personnel only. 
                We comply with HIPAA, GDPR, and other applicable privacy regulations.
              </p>
            </section>

            <section>
              <h4 className="font-semibold">Your Rights</h4>
              <p className="text-gray-600">
                You have the right to access, modify, or delete your data at any time. You may withdraw 
                consent for data processing, though this may limit app functionality.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="dataCollection"
              checked={consents.dataCollection}
              onCheckedChange={(checked) => handleConsentChange('dataCollection', checked as boolean)}
            />
            <label htmlFor="dataCollection" className="text-sm leading-tight">
              I consent to the collection and processing of my health data as described above for the purpose of cardiac recovery support.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="medicalDisclaimer"
              checked={consents.medicalDisclaimer}
              onCheckedChange={(checked) => handleConsentChange('medicalDisclaimer', checked as boolean)}
            />
            <label htmlFor="medicalDisclaimer" className="text-sm leading-tight">
              I understand that this app is for informational purposes only and does not replace professional medical advice.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="privacyPolicy"
              checked={consents.privacyPolicy}
              onCheckedChange={(checked) => handleConsentChange('privacyPolicy', checked as boolean)}
            />
            <label htmlFor="privacyPolicy" className="text-sm leading-tight">
              I have read and agree to the Privacy Policy and Terms of Service.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="researchParticipation"
              checked={consents.researchParticipation}
              onCheckedChange={(checked) => handleConsentChange('researchParticipation', checked as boolean)}
            />
            <label htmlFor="researchParticipation" className="text-sm leading-tight">
              I consent to the use of my anonymized data for research purposes to improve cardiac care (optional).
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => onConsent(false)}>
            Decline
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!allConsentsGiven || isLoading}
          >
            {isLoading ? 'Processing...' : 'I Consent & Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
