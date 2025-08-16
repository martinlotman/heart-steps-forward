
import { ArrowLeft, User, Settings, Bell, Shield, HelpCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { ManageDataDialog } from '@/components/ManageDataDialog';
import { NotificationPreferencesDialog } from '@/components/NotificationPreferencesDialog';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslations();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [daysSinceMI, setDaysSinceMI] = useState<number>(0);
  const [showManageData, setShowManageData] = useState(false);
  const [showNotificationPrefs, setShowNotificationPrefs] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await profileService.getUserProfile(user.id);
          if (profile) {
            setUserProfile(profile);
            if (profile.date_of_mi) {
              const days = profileService.calculateDaysSinceMI(profile.date_of_mi);
              setDaysSinceMI(days);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to localStorage if database fetch fails
          const onboardingData = localStorage.getItem('onboardingData');
          if (onboardingData) {
            const data = JSON.parse(onboardingData);
            setUserProfile({ name: data.name });
            if (data.dateOfMI) {
              const days = profileService.calculateDaysSinceMI(data.dateOfMI);
              setDaysSinceMI(days);
            }
          }
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleDataUpdated = () => {
    // Refresh profile data after update
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await profileService.getUserProfile(user.id);
          if (profile) {
            setUserProfile(profile);
            if (profile.date_of_mi) {
              const days = profileService.calculateDaysSinceMI(profile.date_of_mi);
              setDaysSinceMI(days);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    fetchUserProfile();
  };

  const getInitials = (name: string) => {
    if (!name) return 'JD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const userName = userProfile?.name || 'John Doe';
  const userInitials = getInitials(userName);

  const menuItems = [
    { icon: Bell, title: t('profile.notifications'), description: t('profile.notifications_desc'), onClick: () => setShowNotificationPrefs(true) },
    { icon: User, title: t('profile.personal_info'), description: t('profile.personal_info_desc'), onClick: () => setShowManageData(true) },
    { icon: Shield, title: t('profile.emergency_contacts'), description: t('profile.emergency_contacts_desc') },
    { icon: Settings, title: t('profile.settings'), description: t('profile.settings_desc') },
    { icon: HelpCircle, title: t('profile.help_support'), description: t('profile.help_support_desc') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">{t('profile.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
              <p className="text-gray-600">{t('profile.recovery_day')} {daysSinceMI}</p>
              <p className="text-sm text-green-600 font-medium">{t('profile.excellent_progress')}</p>
            </div>
          </div>
        </div>


        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={item.onClick}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <item.icon className="text-gray-500 mr-4" size={24} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Language Settings */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Globe className="text-gray-500 mr-4" size={24} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{t('profile.language')}</h3>
                  <p className="text-sm text-gray-500">{t('profile.language_desc')}</p>
                </div>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ManageDataDialog
        open={showManageData}
        onOpenChange={setShowManageData}
        onDataUpdated={handleDataUpdated}
      />

      <NotificationPreferencesDialog
        open={showNotificationPrefs}
        onOpenChange={setShowNotificationPrefs}
      />

      <Navigation />
    </div>
  );
};

export default Profile;
