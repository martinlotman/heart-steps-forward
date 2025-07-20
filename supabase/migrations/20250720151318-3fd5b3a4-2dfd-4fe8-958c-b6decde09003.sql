-- Update the health_activities table activity_type constraint to include cardio and strength
ALTER TABLE public.health_activities 
DROP CONSTRAINT IF EXISTS health_activities_activity_type_check;

-- Add the updated constraint with new activity types
ALTER TABLE public.health_activities 
ADD CONSTRAINT health_activities_activity_type_check 
CHECK (activity_type IN ('steps', 'distance', 'calories', 'exercise', 'cardio', 'strength'));

-- Also add columns for exercise details that we're using in the logging
ALTER TABLE public.health_activities 
ADD COLUMN IF NOT EXISTS exercise_name text,
ADD COLUMN IF NOT EXISTS duration_minutes integer,
ADD COLUMN IF NOT EXISTS notes text;