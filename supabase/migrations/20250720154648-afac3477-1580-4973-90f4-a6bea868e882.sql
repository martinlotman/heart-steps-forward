-- Create table for therapeutic goals
CREATE TABLE public.therapeutic_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT NOT NULL,
  target_value TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_type)
);

-- Enable Row Level Security
ALTER TABLE public.therapeutic_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own therapeutic goals" 
ON public.therapeutic_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own therapeutic goals" 
ON public.therapeutic_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapeutic goals" 
ON public.therapeutic_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own therapeutic goals" 
ON public.therapeutic_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_therapeutic_goals_updated_at
BEFORE UPDATE ON public.therapeutic_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default therapeutic goals
INSERT INTO public.therapeutic_goals (user_id, goal_type, target_value, unit)
SELECT 
  auth.uid() as user_id,
  goal_type,
  target_value,
  unit
FROM (VALUES 
  ('body_mass_index', '20–25', 'kg/m²'),
  ('waist_circumference', '< 94', 'cm'),
  ('systolic_blood_pressure', '120–130', 'mmHg'),
  ('diastolic_blood_pressure', '70–80', 'mmHg'),
  ('hba1c', '< 7.0', '%'),
  ('ldl_cholesterol', '< 1.4', 'mmol/L')
) AS defaults(goal_type, target_value, unit)
WHERE auth.uid() IS NOT NULL;