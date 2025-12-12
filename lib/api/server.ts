import { cookies } from 'next/headers';
import { UserRole } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}

class ServerApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || null;
    const refreshToken = cookieStore.get('refresh_token')?.value || null;
    return { accessToken, refreshToken };
  }

  private async setTokens(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  private async clearTokens() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
  }

  private async handleError(response: Response): Promise<Error> {
    try {
      const error: ApiError = await response.json();
      const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
      return new Error(message || `Request failed with status ${response.status}`);
    } catch {
      return new Error(`Request failed with status ${response.status}`);
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      await this.setTokens(data.access_token, data.refresh_token);
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    } catch {
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { accessToken, refreshToken } = await this.getTokens();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Handle 401 - try to refresh token
      if (response.status === 401 && refreshToken) {
        const refreshed = await this.refreshAccessToken(refreshToken);
        if (refreshed) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${refreshed.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (!retryResponse.ok) {
            if (retryResponse.status === 401) {
              await this.clearTokens();
            }
            throw await this.handleError(retryResponse);
          }
          
          const contentType = retryResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return retryResponse.json();
          }
          return {} as T;
        } else {
          await this.clearTokens();
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
      // Handle fetch errors more gracefully
      if (error instanceof TypeError && error.message.includes('fetch failed')) {
        console.error(`Failed to fetch from ${url}. Is the backend server running at ${this.baseURL}?`);
        throw new Error(`Unable to connect to the API server. Please ensure the backend is running at ${this.baseURL}`);
      }
      if (error instanceof Error) {
        // Check if it's an AbortError (timeout)
        if (error.name === 'AbortError') {
          throw new Error(`Request to ${url} timed out. The server may be unresponsive.`);
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
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
}

export function createServerApiClient(): ServerApiClient {
  return new ServerApiClient(API_BASE_URL);
}
