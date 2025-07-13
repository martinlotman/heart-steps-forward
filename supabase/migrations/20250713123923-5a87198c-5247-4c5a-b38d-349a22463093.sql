
-- Create a table for health metrics entries
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  systolic INTEGER NULL, -- For blood pressure only
  diastolic INTEGER NULL, -- For blood pressure only
  notes TEXT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own metrics
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own health metrics
CREATE POLICY "Users can view their own health metrics" 
  ON public.health_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own health metrics
CREATE POLICY "Users can create their own health metrics" 
  ON public.health_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own health metrics
CREATE POLICY "Users can update their own health metrics" 
  ON public.health_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own health metrics
CREATE POLICY "Users can delete their own health metrics" 
  ON public.health_metrics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_health_metrics_user_id_type_date ON public.health_metrics(user_id, metric_type, recorded_at DESC);
