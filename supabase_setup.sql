-- 1. Create PROFILES table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create PROCESSES table
CREATE TABLE public.processes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  recommendation TEXT DEFAULT '-',
  priority TEXT DEFAULT 'Medium',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  impact JSONB DEFAULT '{"financial": [], "efficiency": [], "accuracy": []}'::jsonb,
  scoring JSONB DEFAULT '{"fit": 0, "complexity": 0, "value": 0}'::jsonb,
  systems JSONB DEFAULT '[]'::jsonb,
  potential_value NUMERIC DEFAULT 0
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for PROFILES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 5. Create Policies for PROCESSES
CREATE POLICY "Customers can view their own processes"
  ON public.processes FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Customers can insert their own processes"
  ON public.processes FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Admins can view ALL processes"
  ON public.processes FOR SELECT
  USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Admins can update ALL processes"
  ON public.processes FOR UPDATE
  USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 6. Set up a Trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
