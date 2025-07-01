
-- Create the resource_content table for storing scraped content
CREATE TABLE IF NOT EXISTS public.resource_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER update_resource_content_updated_at
BEFORE UPDATE ON public.resource_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.resource_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow anyone to read resource content"
  ON public.resource_content
  FOR SELECT
  USING (true);

-- Only allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert resource content"
  ON public.resource_content
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only allow authenticated users to update their own resource content
CREATE POLICY "Allow authenticated users to update resource content"
  ON public.resource_content
  FOR UPDATE
  USING (auth.role() = 'authenticated');
