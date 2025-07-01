
-- Create roleplay_sessions table
CREATE TABLE public.roleplay_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users NOT NULL,
  segment TEXT NOT NULL,
  scenario_title TEXT NOT NULL,
  scenario_data JSONB NOT NULL,
  industry TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  duration INTEGER NOT NULL DEFAULT 10,
  transcript JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ai_feedback table
CREATE TABLE public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roleplay_session_id UUID REFERENCES public.roleplay_sessions NOT NULL,
  score INTEGER NOT NULL,
  strengths TEXT[] NOT NULL,
  weaknesses TEXT[] NOT NULL,
  improvement_tips TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create leaderboard_entries table
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER NOT NULL,
  category TEXT NOT NULL,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.roleplay_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own roleplay sessions" 
  ON public.roleplay_sessions 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own roleplay sessions" 
  ON public.roleplay_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own roleplay sessions" 
  ON public.roleplay_sessions 
  FOR UPDATE 
  USING (auth.uid() = student_id);

CREATE POLICY "Users can view their own feedback" 
  ON public.ai_feedback 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.roleplay_sessions 
    WHERE id = roleplay_session_id AND student_id = auth.uid()
  ));

CREATE POLICY "Users can view leaderboard entries" 
  ON public.leaderboard_entries 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own leaderboard entries" 
  ON public.leaderboard_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entries" 
  ON public.leaderboard_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_roleplay_sessions_updated_at
BEFORE UPDATE ON public.roleplay_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_feedback_updated_at
BEFORE UPDATE ON public.ai_feedback
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_entries_updated_at
BEFORE UPDATE ON public.leaderboard_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
