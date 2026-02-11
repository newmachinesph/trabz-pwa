import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trabz.ph/api/v1';

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<TokenResponse> | null = null;

async function request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = Cookies.get('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry && Cookies.get('refresh_token')) {
    try {
      await doRefreshToken();
      return request<T>(endpoint, options, false);
    } catch {
      clearTokens();
      throw new ApiError('Session expired', 401);
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.detail || `Request failed (${res.status})`, res.status, data);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

function setTokens(access: string, refresh: string) {
  Cookies.set('access_token', access, { expires: 1, sameSite: 'Lax' });
  Cookies.set('refresh_token', refresh, { expires: 7, sameSite: 'Lax' });
}

function clearTokens() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
}

async function doRefreshToken(): Promise<TokenResponse> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    const rt = Cookies.get('refresh_token');
    if (!rt) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data: TokenResponse = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return data;
  })();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  company_id: number;
  posted_by: number;
  title: string;
  description: string;
  category: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  job_type: string;
  status: string;
  posted_at: string;
  expires_at: string | null;
  requirements?: string[];
  benefits?: string[];
  temp_to_hire?: boolean;
  instant_pay?: boolean;
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
  page_size: number;
}

export interface Gig {
  id: number;
  company_id: number;
  posted_by: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  shift: string;
  time_start: string;
  time_end: string;
  pay_per_shift: number;
  slots_total: number;
  slots_taken: number;
  urgency: string;
  status: string;
  temp_to_hire: boolean;
  instant_pay: boolean;
  verified: boolean;
  rating: number;
  created_at: string;
}

export interface GigListResponse {
  items: Gig[];
  total: number;
  page: number;
  page_size: number;
}

export interface Application {
  id: number;
  job_id: number;
  worker_id: number;
  status: string;
  notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationListResponse {
  items: Application[];
  total: number;
}

export interface Performance {
  id: number;
  worker_id: number;
  overall_score: number;
  level: string;
  total_shifts: number;
  completion_rate: number;
  on_time_rate: number;
  avg_rating: number;
  badges: string[] | null;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<TokenResponse> {
  const data = await request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function registerUser(body: {
  name: string;
  phone: string;
  email?: string;
  password: string;
}): Promise<TokenResponse> {
  const data = await request<TokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...body, role: 'worker' }),
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

// ---------------------------------------------------------------------------
// OTP
// ---------------------------------------------------------------------------

export interface OtpSendResponse {
  status: string;
  expires_in: number;
  sms_status: string;
}

export interface OtpVerifyResponse {
  status: string;
  message: string;
}

export async function sendOtp(phoneNumber: string): Promise<OtpSendResponse> {
  return request<OtpSendResponse>('/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phoneNumber }),
  });
}

export async function verifyOtp(phoneNumber: string, otpCode: string): Promise<OtpVerifyResponse> {
  return request<OtpVerifyResponse>('/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
  });
}

export async function refreshToken(): Promise<TokenResponse> {
  return doRefreshToken();
}

export function logout() {
  clearTokens();
}

export async function getMe(): Promise<User> {
  return request<User>('/users/me');
}

export async function updateMe(body: Partial<User>): Promise<User> {
  return request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(body) });
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export async function listJobs(params?: Record<string, string | number>): Promise<JobListResponse> {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
  return request<JobListResponse>(`/jobs${qs}`);
}

export async function getJob(id: number): Promise<Job> {
  return request<Job>(`/jobs/${id}`);
}

export async function applyForJob(jobId: number, notes?: string): Promise<Application> {
  return request<Application>(`/applications/jobs/${jobId}`, {
    method: 'POST',
    body: JSON.stringify({ notes: notes || null }),
  });
}

export async function getMyApplications(params?: Record<string, string | number>): Promise<ApplicationListResponse> {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
  return request<ApplicationListResponse>(`/applications/me${qs}`);
}

// ---------------------------------------------------------------------------
// Gigs
// ---------------------------------------------------------------------------

export async function listGigs(params?: Record<string, string | number>): Promise<GigListResponse> {
  const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : '';
  return request<GigListResponse>(`/gigs${qs}`);
}

export async function getGig(id: number): Promise<Gig> {
  return request<Gig>(`/gigs/${id}`);
}

export async function claimGig(gigId: number): Promise<Gig> {
  return request<Gig>(`/gigs/${gigId}/claim`, { method: 'POST' });
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export async function getMyPerformance(): Promise<Performance> {
  return request<Performance>('/performance/me');
}

export { ApiError };
