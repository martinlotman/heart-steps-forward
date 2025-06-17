
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import HealthMetricCard from '@/components/HealthMetricCard';
import HealthTimeline from '@/components/HealthTimeline';
import Navigation from '@/components/Navigation';

const Health = () => {
  const [selectedMetric, setSelectedMetric] = useState<{
    title: string;
    unit: string;
    type: 'daily' | 'lab';
  } | null>(null);

  const healthMetrics = [
    { title: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable' as const, normal: true },
    { title: 'Weight', value: '165', unit: 'lbs', trend: 'down' as const, normal: true },
    { title: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable' as const, normal: true },
    { title: 'Steps Today', value: '8,420', unit: 'steps', trend: 'up' as const, normal: true },
  ];

  const labResults = [
    { title: 'LDL-C', value: '85', unit: 'mg/dL', trend: 'down' as const, normal: true },
    { title: 'Total Cholesterol', value: '180', unit: 'mg/dL', trend: 'stable' as const, normal: true },
    { title: 'HDL-C', value: '55', unit: 'mg/dL', trend: 'up' as const, normal: true },
  ];

  const handleMetricClick = (title: string, unit: string, type: 'daily' | 'lab') => {
    setSelectedMetric({ title, unit, type });
  };

  const handleBackToHealth = () => {
    setSelectedMetric(null);
  };

  if (selectedMetric) {
    return (
      <HealthTimeline 
        metric={selectedMetric} 
        onBack={handleBackToHealth}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="text-gray-600" size={24} />
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">Health Metrics</h1>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-1" />
              Log
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Today's Overview</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">All metrics within normal range</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <div 
                key={index}
                onClick={() => handleMetricClick(metric.title, metric.unit, 'daily')}
                className="cursor-pointer"
              >
                <HealthMetricCard
                  title={metric.title}
                  value={metric.value}
                  unit={metric.unit}
                  trend={metric.trend}
                  normal={metric.normal}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lab Results</h2>
          <div className="grid grid-cols-1 gap-4">
            {labResults.map((result, index) => (
              <div 
                key={index}
                onClick={() => handleMetricClick(result.title, result.unit, 'lab')}
                className="cursor-pointer"
              >
                <HealthMetricCard
                  title={result.title}
                  value={result.value}
                  unit={result.unit}
                  trend={result.trend}
                  normal={result.normal}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Log Blood Pressure
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Record Weight
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Add Lab Results
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Track Symptoms
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Health;
