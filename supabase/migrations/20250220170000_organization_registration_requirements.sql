-- Organization Registration Requirements
-- Adds license number, license file upload, work sectors, and secondary account support

-- Add new fields to organizations table
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS license_number TEXT,
  ADD COLUMN IF NOT EXISTS license_file_url TEXT,
  ADD COLUMN IF NOT EXISTS work_sectors TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Create secondary accounts table for organizations
CREATE TABLE IF NOT EXISTS public.organization_secondary_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitation_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(organization_id, email)
);

-- Create index for secondary accounts
CREATE INDEX IF NOT EXISTS idx_organization_secondary_accounts_org_id 
  ON public.organization_secondary_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_secondary_accounts_token 
  ON public.organization_secondary_accounts(invitation_token);
CREATE INDEX IF NOT EXISTS idx_organization_secondary_accounts_user_id 
  ON public.organization_secondary_accounts(user_id);

-- Function to check if organization profile is complete
CREATE OR REPLACE FUNCTION public.is_organization_profile_complete(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_record RECORD;
BEGIN
  SELECT license_number, license_file_url, work_sectors
  INTO org_record
  FROM public.organizations
  WHERE id = org_id;

  RETURN (
    org_record.license_number IS NOT NULL 
    AND org_record.license_number != ''
    AND org_record.license_file_url IS NOT NULL
    AND org_record.license_file_url != ''
    AND array_length(org_record.work_sectors, 1) > 0
  );
END;
$$;

-- Trigger to auto-update profile_complete flag
CREATE OR REPLACE FUNCTION public.update_organization_profile_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.profile_complete = public.is_organization_profile_complete(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_organization_profile_complete ON public.organizations;
CREATE TRIGGER trg_update_organization_profile_complete
  BEFORE INSERT OR UPDATE OF license_number, license_file_url, work_sectors
  ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organization_profile_complete();

-- Add updated_at trigger for secondary accounts
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.organization_secondary_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- NOTE: Create storage bucket 'organization-licenses' via Supabase Dashboard or CLI:
-- supabase storage create organization-licenses --public false
-- Then set RLS policies to allow organizations to upload their own license files

