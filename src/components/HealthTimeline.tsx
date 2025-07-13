
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { healthMetricsService, HealthMetric } from '@/services/healthMetricsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HealthTimelineProps {
  metric: {
    title: string;
    unit: string;
    type: 'daily' | 'lab';
  };
  onBack: () => void;
}

const HealthTimeline = ({ metric, onBack }: HealthTimelineProps) => {
  const { user } = useAuth();
  const [data, setData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMetricData();
    }
  }, [user, metric.title]);

  const loadMetricData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const metrics = await healthMetricsService.getHealthMetrics(user.id, metric.title);
      setData(metrics);
    } catch (error) {
      console.error('Error loading metric data:', error);
      toast.error('Failed to load metric data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="text-muted-foreground" size={16} />;
    
    if (current > previous) {
      return <TrendingUp className="text-accent-foreground" size={16} />;
    } else if (current < previous) {
      return <TrendingDown className="text-accent-foreground" size={16} />;
    }
    return <Minus className="text-muted-foreground" size={16} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const chartConfig = {
    value: {
      label: metric.title,
      color: "hsl(var(--primary))",
    },
  };

  // Prepare chart data - reverse for chronological order in chart
  const chartData = [...data].reverse().map(entry => ({
    date: entry.recorded_at,
    value: entry.value,
    displayDate: formatDate(entry.recorded_at)
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-1"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">{metric.title} Timeline</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading timeline data...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No {metric.title.toLowerCase()} data recorded yet.</p>
            <p className="text-sm mt-2">Start logging your metrics to see trends here.</p>
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Trend Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="displayDate"
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--color-value)" 
                        strokeWidth={2}
                        dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Timeline List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">History</h2>
              {data.map((entry, index) => (
                <Card key={entry.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{formatDate(entry.recorded_at)}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-2xl font-bold text-foreground">
                            {metric.title === 'Blood Pressure' && entry.systolic && entry.diastolic
                              ? `${entry.systolic}/${entry.diastolic}`
                              : entry.value
                            }
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(entry.value, data[index + 1]?.value)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="mt-6">
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={onBack}>
            Add New Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;
