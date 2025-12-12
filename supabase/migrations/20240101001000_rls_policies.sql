-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Anyone can view organizations" ON public.organizations
  FOR SELECT USING (true);

CREATE POLICY "Organization owners can update" ON public.organizations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Organization owners can insert" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organization owners can delete" ON public.organizations
  FOR DELETE USING (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Anyone can view companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Company owners can update" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Company owners can insert" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Company owners can delete" ON public.companies
  FOR DELETE USING (auth.uid() = user_id);

-- Tenders policies
CREATE POLICY "Anyone can view open tenders" ON public.tenders
  FOR SELECT USING (status = 'open' OR EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = tenders.organization_id 
    AND organizations.user_id = auth.uid()
  ));

CREATE POLICY "Organization owners can insert tenders" ON public.tenders
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = organization_id 
    AND organizations.user_id = auth.uid()
  ));

CREATE POLICY "Organization owners can update tenders" ON public.tenders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = tenders.organization_id 
    AND organizations.user_id = auth.uid()
  ));

CREATE POLICY "Organization owners can delete tenders" ON public.tenders
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = tenders.organization_id 
    AND organizations.user_id = auth.uid()
  ));

-- Jobs policies
CREATE POLICY "Anyone can view open jobs" ON public.jobs
  FOR SELECT USING (status = 'open' OR EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = jobs.company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Company owners can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Company owners can update jobs" ON public.jobs
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = jobs.company_id 
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Company owners can delete jobs" ON public.jobs
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = jobs.company_id 
    AND companies.user_id = auth.uid()
  ));

-- Tender applications policies
CREATE POLICY "Users can view own tender applications" ON public.tender_applications
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.tenders t
    JOIN public.organizations o ON t.organization_id = o.id
    WHERE t.id = tender_applications.tender_id AND o.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own tender applications" ON public.tender_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tender applications" ON public.tender_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Organization owners can update tender applications" ON public.tender_applications
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.tenders t
    JOIN public.organizations o ON t.organization_id = o.id
    WHERE t.id = tender_applications.tender_id AND o.user_id = auth.uid()
  ));

-- Job applications policies
CREATE POLICY "Users can view own job applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE j.id = job_applications.job_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own job applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job applications" ON public.job_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Company owners can update job applications" ON public.job_applications
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.companies c ON j.company_id = c.id
    WHERE j.id = job_applications.job_id AND c.user_id = auth.uid()
  ));

-- Analytics policies
CREATE POLICY "Anyone can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON public.analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));
