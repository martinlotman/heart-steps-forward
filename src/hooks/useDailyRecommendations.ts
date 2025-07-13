
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type DailyRecommendation = Tables<'Lifestyle daily recommendations'>;

export const useDailyRecommendations = () => {
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyRecommendation = async () => {
      try {
        // Get a random recommendation for today - in production you might want 
        // to use a more sophisticated algorithm based on date
        const { data, error } = await supabase
          .from('Lifestyle daily recommendations')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        setRecommendation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch daily recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyRecommendation();
  }, []);

  return { recommendation, loading, error };
};
