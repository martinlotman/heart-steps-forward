
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface HealthTimelineProps {
  metric: {
    title: string;
    unit: string;
    type: 'daily' | 'lab';
  };
  onBack: () => void;
}

interface BaseDataEntry {
  date: string;
  value: number;
  trend: string;
}

interface BloodPressureEntry extends BaseDataEntry {
  systolic?: number;
  diastolic?: number;
}

const HealthTimeline = ({ metric, onBack }: HealthTimelineProps) => {
  // Sample historical data - in a real app, this would come from a database
  const getHistoricalData = (): (BaseDataEntry | BloodPressureEntry)[] => {
    const baseData = {
      'Blood Pressure': [
        { date: '2024-01-15', value: 125, systolic: 125, diastolic: 82, trend: 'up' },
        { date: '2024-01-14', value: 120, systolic: 120, diastolic: 80, trend: 'stable' },
        { date: '2024-01-13', value: 118, systolic: 118, diastolic: 78, trend: 'down' },
        { date: '2024-01-12', value: 122, systolic: 122, diastolic: 81, trend: 'up' },
        { date: '2024-01-11', value: 119, systolic: 119, diastolic: 79, trend: 'stable' },
      ],
      'Weight': [
        { date: '2024-01-15', value: 165, trend: 'down' },
        { date: '2024-01-14', value: 166, trend: 'down' },
        { date: '2024-01-13', value: 167, trend: 'stable' },
        { date: '2024-01-12', value: 167, trend: 'up' },
        { date: '2024-01-11', value: 168, trend: 'down' },
      ],
      'Heart Rate': [
        { date: '2024-01-15', value: 72, trend: 'stable' },
        { date: '2024-01-14', value: 71, trend: 'down' },
        { date: '2024-01-13', value: 74, trend: 'up' },
        { date: '2024-01-12', value: 73, trend: 'stable' },
        { date: '2024-01-11', value: 75, trend: 'down' },
      ],
      'Steps Today': [
        { date: '2024-01-15', value: 8420, trend: 'up' },
        { date: '2024-01-14', value: 7850, trend: 'down' },
        { date: '2024-01-13', value: 9200, trend: 'up' },
        { date: '2024-01-12', value: 6500, trend: 'down' },
        { date: '2024-01-11', value: 8100, trend: 'up' },
      ],
      'LDL-C': [
        { date: '2024-01-10', value: 85, trend: 'down' },
        { date: '2023-12-15', value: 92, trend: 'up' },
        { date: '2023-11-20', value: 88, trend: 'down' },
        { date: '2023-10-25', value: 95, trend: 'stable' },
      ],
      'Total Cholesterol': [
        { date: '2024-01-10', value: 180, trend: 'stable' },
        { date: '2023-12-15', value: 185, trend: 'down' },
        { date: '2023-11-20', value: 190, trend: 'up' },
        { date: '2023-10-25', value: 188, trend: 'stable' },
      ],
      'HDL-C': [
        { date: '2024-01-10', value: 55, trend: 'up' },
        { date: '2023-12-15', value: 52, trend: 'stable' },
        { date: '2023-11-20', value: 50, trend: 'down' },
        { date: '2023-10-25', value: 53, trend: 'up' },
      ],
    };
    
    return baseData[metric.title as keyof typeof baseData] || [];
  };

  const data = getHistoricalData();
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'down':
        return <TrendingDown className="text-green-600" size={16} />;
      case 'stable':
        return <Minus className="text-gray-500" size={16} />;
      default:
        return null;
    }
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
      color: "#3b82f6",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
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
            <h1 className="text-xl font-semibold text-gray-800">{metric.title} Timeline</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Chart Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Trend Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
          <h2 className="text-lg font-semibold text-gray-800">History</h2>
          {data.map((entry, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold text-gray-800">
                        {entry.value}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                      {metric.title === 'Blood Pressure' && 'systolic' in entry && 'diastolic' in entry && (
                        <span className="text-sm text-gray-500 ml-1">
                          ({entry.systolic}/{entry.diastolic})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getTrendIcon(entry.trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Add New Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;
