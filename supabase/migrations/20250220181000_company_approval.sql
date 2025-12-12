ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

UPDATE public.companies
SET approved = COALESCE(approved, FALSE);

