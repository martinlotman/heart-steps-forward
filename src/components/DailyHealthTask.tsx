
import { useState } from 'react';
import { Heart, Activity, Scale, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface HealthMetric {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  unit: string;
  placeholder: string;
  value: string;
  logged: boolean;
}

const DailyHealthTask = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { id: 'bp', name: 'Blood Pressure', icon: Heart, unit: 'mmHg', placeholder: '120/80', value: '', logged: false },
    { id: 'weight', name: 'Weight', icon: Scale, unit: 'lbs', placeholder: '165', value: '', logged: false },
    { id: 'steps', name: 'Steps', icon: Activity, unit: 'steps', placeholder: '8000', value: '', logged: false },
  ]);

  const handleInputChange = (id: string, value: string) => {
    setMetrics(prev => 
      prev.map(metric => 
        metric.id === id ? { ...metric, value } : metric
      )
    );
  };

  const handleLogMetric = (id: string) => {
    const metric = metrics.find(m => m.id === id);
    if (!metric?.value.trim()) return;

    setMetrics(prev => 
      prev.map(metric => 
        metric.id === id ? { ...metric, logged: true } : metric
      )
    );

    toast({
      title: "Metric logged",
      description: `${metric.name}: ${metric.value} ${metric.unit} has been recorded`,
    });
  };

  const completedCount = metrics.filter(metric => metric.logged).length;
  const totalCount = metrics.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Health Metrics</h2>
        <p className="text-gray-600">Log your daily health measurements</p>
        <div className="mt-4 bg-green-50 p-4 rounded-lg">
          <p className="text-green-800 font-medium">
            {completedCount} of {totalCount} metrics logged today
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map(metric => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.id} className={metric.logged ? 'bg-green-50 border-green-200' : 'bg-white'}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    metric.logged ? 'bg-green-500' : 'bg-blue-100'
                  }`}>
                    {metric.logged ? (
                      <Check className="text-white" size={20} />
                    ) : (
                      <IconComponent className="text-blue-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                    <p className="text-sm text-gray-600">Enter today's reading</p>
                  </div>
                </div>
                
                {!metric.logged && (
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={metric.placeholder}
                      value={metric.value}
                      onChange={(e) => handleInputChange(metric.id, e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 self-center min-w-fit">{metric.unit}</span>
                    <Button 
                      onClick={() => handleLogMetric(metric.id)}
                      disabled={!metric.value.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Log
                    </Button>
                  </div>
                )}
                
                {metric.logged && (
                  <div className="text-green-600 font-medium">
                    ✓ Logged: {metric.value} {metric.unit}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DailyHealthTask;
