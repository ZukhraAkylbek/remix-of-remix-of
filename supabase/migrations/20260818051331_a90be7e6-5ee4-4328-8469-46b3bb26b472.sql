ALTER TABLE public.surgery_directions
  ADD COLUMN IF NOT EXISTS advantages text,
  ADD COLUMN IF NOT EXISTS symptoms text,
  ADD COLUMN IF NOT EXISTS about_title text,
  ADD COLUMN IF NOT EXISTS doctor_slugs text;