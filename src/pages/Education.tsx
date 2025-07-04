
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const Education = () => {
  const educationContent = [
    {
      title: 'Heart-Healthy Diet',
      description: 'Learn about foods that support your recovery',
      duration: '5 min read',
      category: 'Nutrition'
    },
    {
      title: 'Safe Exercise After MI',
      description: 'Gentle exercises to strengthen your heart',
      duration: '8 min read',
      category: 'Exercise'
    },
    {
      title: 'Managing Stress',
      description: 'Techniques to reduce stress and anxiety',
      duration: '6 min read',
      category: 'Mental Health'
    },
    {
      title: 'Understanding Your Medications',
      description: 'Why each medication is important for recovery',
      duration: '4 min read',
      category: 'Medications'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="text-gray-600" size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Education</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Play className="text-blue-600 mr-2" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Daily Tip</p>
                <p className="text-blue-600 text-sm">Take medications at the same time each day for best results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {educationContent.map((content, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                      {content.title}
                    </CardTitle>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {content.category}
                    </span>
                  </div>
                  <BookOpen className="text-gray-400" size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{content.description}</p>
                <p className="text-sm text-gray-500">{content.duration}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Education;
