-- Enable Row Level Security on Lifestyle daily recommendations table
ALTER TABLE public."Lifestyle daily recommendations" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read lifestyle daily recommendations
CREATE POLICY "Anyone can view lifestyle daily recommendations" 
ON public."Lifestyle daily recommendations" 
FOR SELECT 
USING (true);

-- Also enable RLS on Lifestyle table if not already enabled
ALTER TABLE public."Lifestyle" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read lifestyle tasks
CREATE POLICY "Anyone can view lifestyle tasks" 
ON public."Lifestyle" 
FOR SELECT 
USING (true);