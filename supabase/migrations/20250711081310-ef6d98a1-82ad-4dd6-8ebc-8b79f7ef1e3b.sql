
-- Create a profiles table to store user information from onboarding
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  date_of_mi DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for GPPAQ questionnaire responses
CREATE TABLE public.gppaq_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  work_type TEXT NOT NULL,
  physical_activity TEXT NOT NULL,
  walking_cycling TEXT NOT NULL,
  housework TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for EQ-5D-5L questionnaire responses
CREATE TABLE public.eq5d5l_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mobility TEXT NOT NULL,
  self_care TEXT NOT NULL,
  usual_activities TEXT NOT NULL,
  pain_discomfort TEXT NOT NULL,
  anxiety_depression TEXT NOT NULL,
  health_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for daily tasks tracking
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  task_date DATE NOT NULL,
  medications BOOLEAN DEFAULT FALSE,
  health BOOLEAN DEFAULT FALSE,
  education BOOLEAN DEFAULT FALSE,
  physical_activity BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_date)
);

-- Create a table for health journey tracking
CREATE TABLE public.health_journey (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  journey_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('incomplete', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, journey_date)
);

-- Create a table for health activities (steps, calories, etc.)
CREATE TABLE public.health_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('steps', 'distance', 'calories', 'exercise')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('google_fit', 'apple_health', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gppaq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eq5d5l_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for gppaq_responses table
CREATE POLICY "Users can view their own GPPAQ responses" 
  ON public.gppaq_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own GPPAQ responses" 
  ON public.gppaq_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own GPPAQ responses" 
  ON public.gppaq_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for eq5d5l_responses table
CREATE POLICY "Users can view their own EQ-5D-5L responses" 
  ON public.eq5d5l_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own EQ-5D-5L responses" 
  ON public.eq5d5l_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own EQ-5D-5L responses" 
  ON public.eq5d5l_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for daily_tasks table
CREATE POLICY "Users can view their own daily tasks" 
  ON public.daily_tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily tasks" 
  ON public.daily_tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily tasks" 
  ON public.daily_tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for health_journey table
CREATE POLICY "Users can view their own health journey" 
  ON public.health_journey 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health journey" 
  ON public.health_journey 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health journey" 
  ON public.health_journey 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for health_activities table
CREATE POLICY "Users can view their own health activities" 
  ON public.health_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health activities" 
  ON public.health_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health activities" 
  ON public.health_activities 
  FOR UPDATE 
  USING (auth.uid() = user_id);
