import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerApiClient } from '../api/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Extract user information from JWT token stored in cookies
 * Note: This decodes the token without verification (for quick checks)
 * For secure operations, validate the token with the backend API
 */
export async function getJWTUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    // Decode JWT token (without verification)
    // In production, you might want to verify the signature
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString()) as JWTPayload;
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validate JWT token by making a request to the backend API
 * This is more secure than just decoding the token
 */
export async function validateJWTToken(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    // Try to get profile from API (this validates the token)
    const apiClient = createServerApiClient();
    const profile = await apiClient.getMyProfile();
    
    if (!profile || !profile.id) {
      return null;
    }

    return {
      sub: profile.id,
      email: profile.email,
      role: profile.role,
    };
  } catch (error) {
    // Token might be expired, try to refresh
    if (refreshToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Update cookies with new tokens
          cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
          cookieStore.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });

          // Retry getting profile
          const apiClient = createServerApiClient();
          const profile = await apiClient.getMyProfile();
          
          if (profile && profile.id) {
            return {
              sub: profile.id,
              email: profile.email,
              role: profile.role,
            };
          }
        }
      } catch {
        // Refresh failed
        return null;
      }
    }

    return null;
  }
}

/**
 * Get current user, redirects to login if not authenticated
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await validateJWTToken();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return user;
}

/**
 * Get current user, returns null if not authenticated (no redirect)
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  return validateJWTToken();
}

/**
 * Get user profile from API
 */
export async function getCurrentUserProfile() {
  try {
    const apiClient = createServerApiClient();
    return await apiClient.getMyProfile();
  } catch {
    return null;
  }
}





