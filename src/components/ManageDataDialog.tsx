import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoStep } from '@/components/onboarding/PersonalInfoStep';
import { GPPAQStep } from '@/components/onboarding/GPPAQStep';
import { EQ5D5LStep } from '@/components/onboarding/EQ5D5LStep';
import { OnboardingData } from '@/pages/Onboarding';
import { useAuth } from '@/hooks/useAuth';
import { onboardingService } from '@/services/onboardingService';
import { profileService } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ManageDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataUpdated?: () => void;
}

export const ManageDataDialog: React.FC<ManageDataDialogProps> = ({
  open,
  onOpenChange,
  onDataUpdated,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
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

  // Load existing data when dialog opens
  useEffect(() => {
    if (open && user) {
      loadExistingData();
    }
  }, [open, user]);

  const loadExistingData = async () => {
    if (!user) return;

    try {
      // Load profile data
      const profile = await profileService.getUserProfile(user.id);
      
      // Load GPPAQ data
      const { data: gppaqData } = await supabase
        .from('gppaq_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Load EQ5D5L data
      const { data: eq5d5lData } = await supabase
        .from('eq5d5l_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const updatedData: OnboardingData = {
        name: profile?.name || '',
        age: profile?.age || 0,
        dateOfMI: profile?.date_of_mi ? new Date(profile.date_of_mi) : null,
        gppaq: {
          workType: gppaqData?.[0]?.work_type || '',
          physicalActivity: gppaqData?.[0]?.physical_activity || '',
          walkingCycling: gppaqData?.[0]?.walking_cycling || '',
          housework: gppaqData?.[0]?.housework || '',
        },
        eq5d5l: {
          mobility: eq5d5lData?.[0]?.mobility || '',
          selfCare: eq5d5lData?.[0]?.self_care || '',
          usualActivities: eq5d5lData?.[0]?.usual_activities || '',
          painDiscomfort: eq5d5lData?.[0]?.pain_discomfort || '',
          anxietyDepression: eq5d5lData?.[0]?.anxiety_depression || '',
          healthScore: eq5d5lData?.[0]?.health_score || 50,
        },
      };

      setOnboardingData(updatedData);
    } catch (error) {
      console.error('Error loading existing data:', error);
      toast.error('Failed to load existing data');
    }
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await onboardingService.saveCompleteOnboarding(onboardingData, user.id);
      toast.success('Data updated successfully');
      onDataUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  const isPersonalInfoValid = onboardingData.name.trim() !== '' && 
    onboardingData.age > 0 && 
    onboardingData.dateOfMI !== null;

  const isGPPAQValid = !!onboardingData.gppaq.workType && 
    !!onboardingData.gppaq.physicalActivity && 
    !!onboardingData.gppaq.walkingCycling && 
    !!onboardingData.gppaq.housework;

  const isEQ5D5LValid = !!onboardingData.eq5d5l.mobility && 
    !!onboardingData.eq5d5l.selfCare && 
    !!onboardingData.eq5d5l.usualActivities && 
    !!onboardingData.eq5d5l.painDiscomfort && 
    !!onboardingData.eq5d5l.anxietyDepression;

  const allDataValid = isPersonalInfoValid && isGPPAQValid && isEQ5D5LValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage My Data</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="physical">Physical Activity</TabsTrigger>
            <TabsTrigger value="health">Health Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoStep
              data={onboardingData}
              updateData={updateData}
              onNext={() => setActiveTab('physical')}
              canGoNext={isPersonalInfoValid}
            />
          </TabsContent>

          <TabsContent value="physical" className="space-y-4">
            <GPPAQStep
              data={onboardingData}
              updateData={updateData}
              onNext={() => setActiveTab('health')}
              onBack={() => setActiveTab('personal')}
              canGoNext={isGPPAQValid}
              canGoBack={true}
            />
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <EQ5D5LStep
              data={onboardingData}
              updateData={updateData}
              onNext={() => {}}
              onBack={() => setActiveTab('physical')}
              canGoNext={isEQ5D5LValid}
              canGoBack={true}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!allDataValid || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};