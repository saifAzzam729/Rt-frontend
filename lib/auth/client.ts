import { apiClient } from '../api/client';

/**
 * Client-side auth utilities
 */

/**
 * Logout user by clearing tokens
 */
export function logout() {
  apiClient.logout();
  
  // Clear localStorage tokens
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  
  // Redirect to home
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!localStorage.getItem('access_token');
}

/**
 * Get stored access token (client-side)
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('access_token');
}

/**
 * Get stored refresh token (client-side)
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('refresh_token');
}





