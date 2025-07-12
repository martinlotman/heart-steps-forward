
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy & Data Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">HIPAA Compliance</h3>
            <p className="text-sm text-gray-600 mb-2">
              CardiacCare is designed with HIPAA compliance in mind. We implement appropriate safeguards to protect your protected health information (PHI).
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• All data is encrypted in transit and at rest</li>
              <li>• Access controls limit who can view your information</li>
              <li>• Audit logs track all data access</li>
              <li>• Regular security assessments are performed</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">GDPR Compliance</h3>
            <p className="text-sm text-gray-600 mb-2">
              Your rights under GDPR include:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Right to access your personal data</li>
              <li>• Right to rectification of inaccurate data</li>
              <li>• Right to erasure ("right to be forgotten")</li>
              <li>• Right to data portability</li>
              <li>• Right to withdraw consent</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Data Collection & Use</h3>
            <p className="text-sm text-gray-600 mb-2">
              We collect only the minimum necessary health information to provide our services:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Personal information (name, age, email)</li>
              <li>• Health condition information (heart attack date, symptoms)</li>
              <li>• Activity data (steps, exercise, medication tracking)</li>
              <li>• Survey responses (quality of life assessments)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Data Security Measures</h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• End-to-end encryption for all data transmission</li>
              <li>• AES-256 encryption for data storage</li>
              <li>• Multi-factor authentication</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• HTTPS/TLS 1.3 for all communications</li>
              <li>• Data minimization principles</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-sm text-gray-600">
              For privacy concerns or data requests, contact our Data Protection Officer at: privacy@cardiaccare.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
