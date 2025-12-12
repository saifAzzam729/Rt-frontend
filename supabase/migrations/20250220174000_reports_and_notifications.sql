-- Reports and Notifications schema

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  report_topic TEXT,
  listing_type TEXT,
  listing_id UUID,
  listing_url TEXT,
  details TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.report_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION public.create_report_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.report_notifications (report_id, status, metadata)
  VALUES (
    NEW.id,
    'new',
    jsonb_build_object(
      'report_topic', NEW.report_topic,
      'listing_type', NEW.listing_type,
      'listing_url', NEW.listing_url
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_report_notification ON public.reports;
CREATE TRIGGER trg_create_report_notification
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.create_report_notification();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_notifications ENABLE ROW LEVEL SECURITY;

-- Service role can manage everything
CREATE POLICY "service role manages reports"
  ON public.reports
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service role manages report notifications"
  ON public.report_notifications
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admins can read/update
CREATE POLICY "admins read reports"
  ON public.reports
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admins update reports"
  ON public.reports
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins read report notifications"
  ON public.report_notifications
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "admins update report notifications"
  ON public.report_notifications
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

