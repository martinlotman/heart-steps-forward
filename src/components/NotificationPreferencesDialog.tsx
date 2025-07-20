import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pill, Activity, BookOpen, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationPreferences {
  medication: boolean;
  physical_activity: boolean;
  learn: boolean;
  streak: boolean;
}

export const NotificationPreferencesDialog = ({
  open,
  onOpenChange,
}: NotificationPreferencesDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    medication: true,
    physical_activity: true,
    learn: true,
    streak: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      loadNotificationPreferences();
    }
  }, [open, user]);

  const loadNotificationPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading notification preferences:', error);
        return;
      }

      if (data && data.notification_preferences) {
        const prefs = data.notification_preferences as unknown as NotificationPreferences;
        setPreferences(prefs);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notification_preferences: preferences as any,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'medication' as keyof NotificationPreferences,
      title: 'Medication Reminders',
      description: 'Get notified when it\'s time to take your medications',
      icon: Pill,
    },
    {
      key: 'physical_activity' as keyof NotificationPreferences,
      title: 'Physical Activity',
      description: 'Reminders for your daily exercise and activity goals',
      icon: Activity,
    },
    {
      key: 'learn' as keyof NotificationPreferences,
      title: 'Educational Content',
      description: 'New health tips and educational materials',
      icon: BookOpen,
    },
    {
      key: 'streak' as keyof NotificationPreferences,
      title: 'Streak Notifications',
      description: 'Celebrate your progress and maintain your streaks',
      icon: Zap,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {notificationTypes.map((type) => (
            <Card key={type.key} className="border-0 shadow-none bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <type.icon className="text-primary mt-1" size={20} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{type.title}</h4>
                      <Switch
                        checked={preferences[type.key]}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({
                            ...prev,
                            [type.key]: checked,
                          }))
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};