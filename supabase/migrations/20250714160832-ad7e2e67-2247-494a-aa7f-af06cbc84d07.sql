-- Remove duplicate profiles, keeping the most recent one
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id 
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM public.profiles
  ) t 
  WHERE rn > 1
);