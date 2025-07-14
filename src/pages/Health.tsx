import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import HealthMetricCard from '@/components/HealthMetricCard';
import HealthTimeline from '@/components/HealthTimeline';
import HealthMetricEntryForm from '@/components/HealthMetricEntryForm';
import Navigation from '@/components/Navigation';
import { healthMetricsService, HealthMetric } from '@/services/healthMetricsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Health = () => {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<{
    title: string;
    unit: string;
    type: 'daily' | 'lab';
  } | null>(null);
  const [showEntryForm, setShowEntryForm] = useState<{
    metricType: string;
    unit: string;
  } | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const metricDefinitions = [
    { title: 'Blood Pressure', unit: 'mmHg', type: 'daily' as const },
    { title: 'Weight', unit: 'kg', type: 'daily' as const },
    { title: 'Heart Rate', unit: 'bpm', type: 'daily' as const },
    { title: 'Steps Today', unit: 'steps', type: 'daily' as const },
  ];

  const labDefinitions = [
    { title: 'LDL-C', unit: 'mmol/L', type: 'lab' as const },
    { title: 'Total Cholesterol', unit: 'mmol/L', type: 'lab' as const },
    { title: 'HDL-C', unit: 'mmol/L', type: 'lab' as const },
  ];

  useEffect(() => {
    if (user) {
      loadHealthMetrics();
    }
  }, [user]);

  const loadHealthMetrics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const metrics = await healthMetricsService.getHealthMetrics(user.id);
      setHealthMetrics(metrics);
    } catch (error) {
      console.error('Error loading health metrics:', error);
      toast.error('Failed to load health metrics');
    } finally {
      setLoading(false);
    }
  };

  const getLatestMetricValue = (metricType: string) => {
    const latestMetric = healthMetrics
      .filter(m => m.metric_type === metricType)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
    
    if (!latestMetric) return { value: '--', trend: 'stable' as const, normal: true };

    if (metricType === 'Blood Pressure' && latestMetric.systolic && latestMetric.diastolic) {
      return {
        value: `${latestMetric.systolic}/${latestMetric.diastolic}`,
        trend: 'stable' as const,
        normal: latestMetric.systolic <= 140 && latestMetric.diastolic <= 90
      };
    }

    // Check normal ranges for all metrics
    let normal = true;
    if (metricType === 'Weight') {
      normal = latestMetric.value >= 50 && latestMetric.value <= 100; // Normal weight range
    } else if (metricType === 'Heart Rate') {
      normal = latestMetric.value >= 60 && latestMetric.value <= 100; // Normal resting heart rate
    } else if (metricType === 'Steps Today') {
      normal = latestMetric.value >= 8000; // Recommended daily steps
    } else if (metricType === 'LDL-C') {
      normal = latestMetric.value <= 3.0; // Normal LDL-C < 3.0 mmol/L
    } else if (metricType === 'Total Cholesterol') {
      normal = latestMetric.value <= 5.0; // Normal Total Cholesterol < 5.0 mmol/L
    } else if (metricType === 'HDL-C') {
      normal = latestMetric.value >= 1.0; // Normal HDL-C > 1.0 mmol/L
    }

    return {
      value: latestMetric.value.toString(),
      trend: 'stable' as const,
      normal
    };
  };

  const handleMetricClick = (title: string, unit: string, type: 'daily' | 'lab') => {
    setSelectedMetric({ title, unit, type });
  };

  const handleBackToHealth = () => {
    setSelectedMetric(null);
  };

  const handleQuickAction = (metricType: string, unit: string) => {
    setShowEntryForm({ metricType, unit });
  };

  const handleEntrySuccess = () => {
    setShowEntryForm(null);
    loadHealthMetrics();
  };

  const handleBackFromEntry = () => {
    setShowEntryForm(null);
  };

  if (showEntryForm) {
    return (
      <HealthMetricEntryForm
        metricType={showEntryForm.metricType}
        unit={showEntryForm.unit}
        onBack={handleBackFromEntry}
        onSuccess={handleEntrySuccess}
      />
    );
  }

  if (selectedMetric) {
    return (
      <HealthTimeline 
        metric={selectedMetric} 
        onBack={handleBackToHealth}
      />
    );
  }

  const allMetricsNormal = [...metricDefinitions, ...labDefinitions].every(def => {
    const latest = getLatestMetricValue(def.title);
    return latest.normal;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="text-muted-foreground" size={24} />
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Health Metrics</h1>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowEntryForm({ metricType: 'Blood Pressure', unit: 'mmHg' })}>
              <Plus size={16} className="mr-1" />
              Log
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Today's Overview</p>
          <div className={`p-4 rounded-lg ${allMetricsNormal ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}>
            <p className="font-medium">
              {allMetricsNormal ? 'All metrics within normal range' : 'Some metrics need attention'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Daily Metrics</h2>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading metrics...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {metricDefinitions.map((def, index) => {
                const latest = getLatestMetricValue(def.title);
                return (
                  <div 
                    key={index}
                    onClick={() => handleMetricClick(def.title, def.unit, def.type)}
                    className="cursor-pointer"
                  >
                    <HealthMetricCard
                      title={def.title}
                      value={latest.value}
                      unit={def.unit}
                      trend={latest.trend}
                      normal={latest.normal}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Lab Results</h2>
          <div className="grid grid-cols-1 gap-4">
            {labDefinitions.map((def, index) => {
              const latest = getLatestMetricValue(def.title);
              return (
                <div 
                  key={index}
                  onClick={() => handleMetricClick(def.title, def.unit, def.type)}
                  className="cursor-pointer"
                >
                  <HealthMetricCard
                    title={def.title}
                    value={latest.value}
                    unit={def.unit}
                    trend={latest.trend}
                    normal={latest.normal}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Blood Pressure', 'mmHg')}
            >
              Log Blood Pressure
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Weight', 'kg')}
            >
              Record Weight
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('LDL-C', 'mmol/L')}
            >
              Add Lab Results
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Heart Rate', 'bpm')}
            >
              Track Heart Rate
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Steps Today', 'steps')}
            >
              Log Daily Steps
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Total Cholesterol', 'mmol/L')}
            >
              Add Total Cholesterol
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('HDL-C', 'mmol/L')}
            >
              Record HDL-C
            </Button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Health;
