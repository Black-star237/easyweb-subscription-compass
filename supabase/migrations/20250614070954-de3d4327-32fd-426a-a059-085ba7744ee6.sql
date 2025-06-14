
-- Create table for user background images
CREATE TABLE public.user_backgrounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  blur_level INTEGER NOT NULL DEFAULT 0 CHECK (blur_level >= 0 AND blur_level <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user settings table for background preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  background_blur INTEGER NOT NULL DEFAULT 0 CHECK (background_blur >= 0 AND background_blur <= 100),
  active_background_id UUID REFERENCES public.user_backgrounds(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for background images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true);

-- Enable RLS on user_backgrounds table
ALTER TABLE public.user_backgrounds ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_backgrounds
CREATE POLICY "Users can view their own backgrounds" 
  ON public.user_backgrounds 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backgrounds" 
  ON public.user_backgrounds 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backgrounds" 
  ON public.user_backgrounds 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backgrounds" 
  ON public.user_backgrounds 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Storage policies for backgrounds bucket
CREATE POLICY "Users can upload their own background images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own background images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own background images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_backgrounds
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
