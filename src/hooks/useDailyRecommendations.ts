
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
        console.log('Fetching daily recommendations from Supabase...');
        
        // First, let's check if there are any recommendations at all
        const { data: allData, error: countError } = await supabase
          .from('Lifestyle daily recommendations')
          .select('*');

        if (countError) {
          console.error('Error fetching recommendations:', countError);
          throw countError;
        }

        console.log('Available recommendations:', allData?.length || 0);

        if (!allData || allData.length === 0) {
          console.log('No recommendations found in the database');
          setRecommendation(null);
          setLoading(false);
          return;
        }

        // Get a random recommendation for today - you might want to use
        // a more sophisticated algorithm based on date in the future
        const randomIndex = Math.floor(Math.random() * allData.length);
        const selectedRecommendation = allData[randomIndex];
        
        console.log('Selected recommendation:', selectedRecommendation);
        setRecommendation(selectedRecommendation);
      } catch (err) {
        console.error('Error in fetchDailyRecommendation:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch daily recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyRecommendation();
  }, []);

  return { recommendation, loading, error };
};
