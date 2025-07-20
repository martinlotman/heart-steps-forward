-- Add notification preferences column to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN notification_preferences JSONB DEFAULT '{"medication": true, "physical_activity": true, "learn": true, "streak": true}'::jsonb;