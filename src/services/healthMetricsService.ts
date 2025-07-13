
import { supabase } from '@/integrations/supabase/client';

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  systolic?: number;
  diastolic?: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHealthMetricData {
  metric_type: string;
  value: number;
  unit: string;
  systolic?: number;
  diastolic?: number;
  notes?: string;
  recorded_at?: string;
}

export const healthMetricsService = {
  async createHealthMetric(data: CreateHealthMetricData, userId: string): Promise<HealthMetric> {
    const { data: result, error } = await supabase
      .from('health_metrics')
      .insert({
        user_id: userId,
        metric_type: data.metric_type,
        value: data.value,
        unit: data.unit,
        systolic: data.systolic,
        diastolic: data.diastolic,
        notes: data.notes,
        recorded_at: data.recorded_at || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating health metric:', error);
      throw error;
    }

    return result;
  },

  async getHealthMetrics(userId: string, metricType?: string): Promise<HealthMetric[]> {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching health metrics:', error);
      throw error;
    }

    return data || [];
  },

  async getLatestMetric(userId: string, metricType: string): Promise<HealthMetric | null> {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest metric:', error);
      throw error;
    }

    return data;
  }
};
