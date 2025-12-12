DROP POLICY IF EXISTS "Organization owners can insert tenders" ON public.tenders;

CREATE POLICY "Organization owners can insert tenders"
  ON public.tenders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.organizations
      WHERE organizations.id = organization_id
        AND organizations.user_id = auth.uid()
        AND organizations.approved IS TRUE
    )
  );

DROP POLICY IF EXISTS "Company owners can insert jobs" ON public.jobs;

CREATE POLICY "Company owners can insert jobs"
  ON public.jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.companies
      WHERE companies.id = company_id
        AND companies.user_id = auth.uid()
        AND companies.approved IS TRUE
    )
  );

