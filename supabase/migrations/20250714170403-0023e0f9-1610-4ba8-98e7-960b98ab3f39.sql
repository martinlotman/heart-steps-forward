-- Create medications table to store each patient's prescribed medications
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  instructions TEXT,
  prescribed_by TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication_intakes table to log actual medication intake
CREATE TABLE public.medication_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'delayed', 'scheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_intakes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medications table
CREATE POLICY "Users can view their own medications" 
ON public.medications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medications" 
ON public.medications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" 
ON public.medications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" 
ON public.medications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for medication_intakes table
CREATE POLICY "Users can view their own medication intakes" 
ON public.medication_intakes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication intakes" 
ON public.medication_intakes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication intakes" 
ON public.medication_intakes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication intakes" 
ON public.medication_intakes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on medications
CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON public.medications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_medications_active ON public.medications(active);
CREATE INDEX idx_medication_intakes_user_id ON public.medication_intakes(user_id);
CREATE INDEX idx_medication_intakes_medication_id ON public.medication_intakes(medication_id);
CREATE INDEX idx_medication_intakes_scheduled_time ON public.medication_intakes(scheduled_time);
CREATE INDEX idx_medication_intakes_status ON public.medication_intakes(status);