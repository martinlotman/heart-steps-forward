-- Change reminder_time column to store JSON array of times
ALTER TABLE public.medications 
DROP COLUMN IF EXISTS reminder_time;

ALTER TABLE public.medications 
ADD COLUMN reminder_times JSONB DEFAULT '[]'::jsonb;