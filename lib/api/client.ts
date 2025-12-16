import { UserRole } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Load tokens from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && this.refreshToken) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (!retryResponse.ok) {
            throw await this.handleError(retryResponse);
          }
          
          return retryResponse.json();
        } else {
          this.clearTokens();
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const error: ApiError = await response.json();
      return new Error(error.message || `Request failed with status ${response.status}`);
    } catch {
      return new Error(`Request failed with status ${response.status}`);
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async signup(data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    role: UserRole;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      
    });
  }

  async login(email: string, password: string, phone?: string) {
    const response: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, phone }),
    });
    
    if (response.access_token && response.refresh_token) {
      this.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async verifyEmail(email: string, otp: string) {
    const response: any = await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    
    if (response.access_token && response.refresh_token) {
      this.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async resendOTP(email: string) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  logout() {
    this.clearTokens();
  }

  // Profile endpoints
  async getMyProfile() {
    return this.request('/profiles/me', { method: 'GET' });
  }

  async updateMyProfile(data: any) {
    return this.request('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Organizations endpoints
  async createOrganization(data: any) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyOrganizations() {
    return this.request('/organizations/my', { method: 'GET' });
  }

  async getOrganization(id: string) {
    return this.request(`/organizations/${id}`, { method: 'GET' });
  }

  async updateOrganization(id: string, data: any) {
    return this.request(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getOrganizationQuota(id: string) {
    return this.request(`/organizations/${id}/quota`, { method: 'GET' });
  }

  // Companies endpoints
  async createCompany(data: any) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyCompanies() {
    return this.request('/companies/my', { method: 'GET' });
  }

  async getCompany(id: string) {
    return this.request(`/companies/${id}`, { method: 'GET' });
  }

  async updateCompany(id: string, data: any) {
    return this.request(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getCompanyQuota(id: string) {
    return this.request(`/companies/${id}/quota`, { method: 'GET' });
  }

  // Jobs endpoints
  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJobs(params?: { search?: string; category?: string; location?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/jobs${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`, { method: 'GET' });
  }

  async updateJob(id: string, data: any) {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, { method: 'DELETE' });
  }

  async getJobsByCompany(companyId: string) {
    return this.request(`/jobs/company/${companyId}`, { method: 'GET' });
  }

  // Tenders endpoints
  async createTender(data: any) {
    return this.request('/tenders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTenders(params?: { search?: string; category?: string; location?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/tenders${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getTender(id: string) {
    return this.request(`/tenders/${id}`, { method: 'GET' });
  }

  async updateTender(id: string, data: any) {
    return this.request(`/tenders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTender(id: string) {
    return this.request(`/tenders/${id}`, { method: 'DELETE' });
  }

  async getTendersByOrganization(organizationId: string) {
    return this.request(`/tenders/organization/${organizationId}`, { method: 'GET' });
  }

  // Applications endpoints
  async applyToJob(jobId: string, data?: { cover_letter?: string; resume_url?: string }) {
    return this.request(`/applications/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getMyJobApplications() {
    return this.request('/applications/jobs/my', { method: 'GET' });
  }

  async getJobApplicationsForCompany(companyId: string) {
    return this.request(`/applications/jobs/company/${companyId}`, { method: 'GET' });
  }

  async applyToTender(tenderId: string, data?: { cover_letter?: string; resume_url?: string }) {
    return this.request(`/applications/tenders/${tenderId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async getMyTenderApplications() {
    return this.request('/applications/tenders/my', { method: 'GET' });
  }

  async getTenderApplicationsForOrganization(organizationId: string) {
    return this.request(`/applications/tenders/organization/${organizationId}`, { method: 'GET' });
  }

  // Admin endpoints
  async approveEntity(data: { entityType: 'organization' | 'company'; entityId: string; approved: boolean }) {
    return this.request('/admin/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPendingApprovals() {
    return this.request('/admin/pending', { method: 'GET' });
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics', { method: 'GET' });
  }

  // Reports endpoints
  async createReport(data: any) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReports() {
    return this.request('/reports', { method: 'GET' });
  }

  async getReport(id: string) {
    return this.request(`/reports/${id}`, { method: 'GET' });
  }

  async updateReportStatus(id: string, status: string) {
    return this.request(`/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // File upload endpoints
  async uploadFile(endpoint: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }

  async uploadLicense(file: File) {
    return this.uploadFile('/upload/license', file);
  }

  async uploadResume(file: File) {
    return this.uploadFile('/upload/resume', file);
  }

  async uploadLogo(file: File) {
    return this.uploadFile('/upload/logo', file);
  }

  async uploadAvatar(file: File) {
    return this.uploadFile('/upload/avatar', file);
  }

  // Pricing endpoints (public, no auth required)
  async getPricing() {
    // Pricing endpoints are public, so we make a direct fetch without auth
    const url = `${this.baseURL}/pricing`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }

  async getPricingPlan(planId: string) {
    const url = `${this.baseURL}/pricing/plan/${planId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }

  async calculatePrice(planId: string, quantity: number = 1) {
    const url = `${this.baseURL}/pricing/calculate?planId=${planId}&quantity=${quantity}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);



