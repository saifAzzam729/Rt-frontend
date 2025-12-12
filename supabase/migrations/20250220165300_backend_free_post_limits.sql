-- Backend enforcement for free job/tender post limits
-- Each company can publish up to 2 free job postings, and each organization can publish up to 2 free tenders.

-- Function + trigger for jobs ------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_free_job_post_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_limit CONSTANT INTEGER := 2;
  used_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO used_count FROM public.jobs WHERE company_id = NEW.company_id;

  IF used_count >= free_limit THEN
    RAISE EXCEPTION
      'Free job post limit (% units) reached. Please contact support to unlock more postings.',
      free_limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_free_job_post_limit ON public.jobs;
CREATE TRIGGER trg_enforce_free_job_post_limit
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.enforce_free_job_post_limit();

-- Function + trigger for tenders ---------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_free_tender_post_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_limit CONSTANT INTEGER := 2;
  used_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO used_count FROM public.tenders WHERE organization_id = NEW.organization_id;

  IF used_count >= free_limit THEN
    RAISE EXCEPTION
      'Free tender post limit (% units) reached. Please contact support to unlock more tenders.',
      free_limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_free_tender_post_limit ON public.tenders;
CREATE TRIGGER trg_enforce_free_tender_post_limit
BEFORE INSERT ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.enforce_free_tender_post_limit();

-- Views for reporting --------------------------------------------------------
CREATE OR REPLACE VIEW public.company_free_post_quota AS
SELECT
  c.id AS company_id,
  2::INTEGER AS free_job_post_limit,
  COUNT(j.id)::INTEGER AS job_posts_used,
  GREATEST(0, 2 - COUNT(j.id))::INTEGER AS job_posts_remaining
FROM public.companies c
LEFT JOIN public.jobs j ON j.company_id = c.id
GROUP BY c.id;

CREATE OR REPLACE VIEW public.organization_free_post_quota AS
SELECT
  o.id AS organization_id,
  2::INTEGER AS free_tender_post_limit,
  COUNT(t.id)::INTEGER AS tender_posts_used,
  GREATEST(0, 2 - COUNT(t.id))::INTEGER AS tender_posts_remaining
FROM public.organizations o
LEFT JOIN public.tenders t ON t.organization_id = o.id
GROUP BY o.id;

