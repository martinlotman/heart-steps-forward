
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { healthMetricsService } from '@/services/healthMetricsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HealthMetricEntryFormProps {
  metricType: string;
  unit: string;
  onBack: () => void;
  onSuccess: () => void;
}

const HealthMetricEntryForm = ({ metricType, unit, onBack, onSuccess }: HealthMetricEntryFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    systolic: '',
    diastolic: '',
    notes: '',
    recordedAt: new Date().toISOString().slice(0, 16)
  });

  const isBloodPressure = metricType === 'Blood Pressure';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const data = {
        metric_type: metricType,
        value: isBloodPressure ? Number(formData.systolic) : Number(formData.value),
        unit,
        systolic: isBloodPressure ? Number(formData.systolic) : undefined,
        diastolic: isBloodPressure ? Number(formData.diastolic) : undefined,
        notes: formData.notes || undefined,
        recorded_at: new Date(formData.recordedAt).toISOString()
      };

      await healthMetricsService.createHealthMetric(data, user.id);
      toast.success(`${metricType} entry saved successfully!`);
      onSuccess();
    } catch (error) {
      console.error('Error saving health metric:', error);
      toast.error('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-xl font-semibold text-foreground">Add {metricType}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>New {metricType} Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="recordedAt">Date & Time</Label>
                <Input
                  id="recordedAt"
                  type="datetime-local"
                  value={formData.recordedAt}
                  onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
                  required
                />
              </div>

              {isBloodPressure ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="value">{metricType} ({unit})</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    placeholder={`Enter ${metricType.toLowerCase()}`}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                  {loading ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthMetricEntryForm;
