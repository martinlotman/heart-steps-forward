
import { useState } from 'react';
import { Heart, Calendar, TrendingUp, BookOpen, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmergencyButton from '@/components/EmergencyButton';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [nextMedication] = useState({
    name: 'Metoprolol',
    time: '2:00 PM',
    timeUntil: '1 hour'
  });

  const quickStats = [
    { label: 'Days since MI', value: '45', icon: Heart },
    { label: 'Medications today', value: '2/4', icon: Calendar },
    { label: 'Recovery score', value: '85%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good morning, John</h1>
              <p className="text-blue-100">Your heart health journey continues</p>
            </div>
            <Bell className="text-blue-100" size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Emergency Button */}
        <div className="mb-6">
          <EmergencyButton />
        </div>

        {/* Next Medication */}
        <Card className="mb-6 border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-orange-800">
              Next Medication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{nextMedication.name}</p>
                <p className="text-sm text-gray-600">Due at {nextMedication.time}</p>
                <p className="text-sm text-orange-600 font-medium">In {nextMedication.timeUntil}</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Set Reminder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <stat.icon className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          
          <Link to="/medications">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-4" size={24} />
                  <div>
                    <h3 className="font-medium text-gray-800">View Medications</h3>
                    <p className="text-sm text-gray-500">Track your daily medications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/health">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Heart className="text-red-500 mr-4" size={24} />
                  <div>
                    <h3 className="font-medium text-gray-800">Log Health Metrics</h3>
                    <p className="text-sm text-gray-500">Record BP, weight, and symptoms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/education">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="text-green-600 mr-4" size={24} />
                  <div>
                    <h3 className="font-medium text-gray-800">Education Center</h3>
                    <p className="text-sm text-gray-500">Learn about heart-healthy living</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
