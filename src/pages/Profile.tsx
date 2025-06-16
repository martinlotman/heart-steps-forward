
import { ArrowLeft, User, Settings, Bell, Shield, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';

const Profile = () => {
  const menuItems = [
    { icon: Bell, title: 'Notifications', description: 'Manage your medication reminders' },
    { icon: User, title: 'Personal Info', description: 'Update your health information' },
    { icon: Shield, title: 'Emergency Contacts', description: 'Manage your emergency contacts' },
    { icon: Settings, title: 'Settings', description: 'App preferences and privacy' },
    { icon: HelpCircle, title: 'Help & Support', description: 'Get help and contact support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
              <p className="text-gray-600">Recovery Day 45</p>
              <p className="text-sm text-green-600 font-medium">Excellent Progress!</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
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
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
