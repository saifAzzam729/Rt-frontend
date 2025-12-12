export type UserRole = 'user' | 'organization' | 'company' | 'admin';

export type JobStatus = 'open' | 'closed' | 'draft';

export type TenderStatus = 'open' | 'closed' | 'draft';

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  location?: string;
  industry?: string;
  license_number?: string;
  license_file_url?: string;
  work_sectors: string[];
  profile_complete: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  location?: string;
  industry?: string;
  size?: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  employment_type?: string;
  experience_level?: string;
  status: JobStatus;
  location?: string;
  category?: string;
  views_count?: number;
  created_at: string;
  updated_at: string;
  company?: Partial<Company>;
  application_count?: number; // For aggregated counts
}

export interface Tender {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  requirements?: string;
  deadline?: string;
  status: TenderStatus;
  location?: string;
  category?: string;
  views_count?: number;
  created_at: string;
  updated_at: string;
  organization?: Partial<Organization>;
  application_count?: number; // For aggregated counts
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
  job?: Job; // Nested job from API
}

export interface TenderApplication {
  id: string;
  tender_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
  tender?: Tender; // Nested tender from API
}

export interface AdminAnalytics {
  total_users: number;
  total_jobs: number;
  total_tenders: number;
  total_companies: number;
  total_organizations: number;
  pending_approvals: number;
}

export interface PendingApprovals {
  companies: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  organizations: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
}



