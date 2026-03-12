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

const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

function setTokens(access: string, refresh: string) {
  Cookies.set('access_token', access, { expires: 1, sameSite: 'Lax', secure: isSecure });
  Cookies.set('refresh_token', refresh, { expires: 7, sameSite: 'Lax', secure: isSecure });
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

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: string[];
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
  resume_url: string | null;
  resume_data: ResumeData | null;
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

export async function login(emailOrPhone: string, password: string): Promise<TokenResponse> {
  // Detect if input is phone number (starts with 0 or +, or contains only digits)
  const isPhone = /^[0-9+]/.test(emailOrPhone) || /^[0-9]+$/.test(emailOrPhone);

  const body = isPhone
    ? { phone: emailOrPhone, password }
    : { email: emailOrPhone, password };

  const data = await request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
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

export async function logout() {
  const rt = Cookies.get('refresh_token');
  if (rt) {
    await request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: rt }),
    }).catch(() => {});
  }
  clearTokens();
}

export async function getMe(): Promise<User> {
  return request<User>('/users/me');
}

export async function updateMe(body: Partial<User>): Promise<User> {
  return request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(body) });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return request<{ message: string }>('/users/me/password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildQueryString(params?: Record<string, string | number>): string {
  if (!params) return '';
  return '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export async function listJobs(params?: Record<string, string | number>): Promise<JobListResponse> {
  return request<JobListResponse>(`/jobs${buildQueryString(params)}`);
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
  return request<ApplicationListResponse>(`/applications/me${buildQueryString(params)}`);
}

// ---------------------------------------------------------------------------
// Gigs
// ---------------------------------------------------------------------------

export async function listGigs(params?: Record<string, string | number>): Promise<GigListResponse> {
  return request<GigListResponse>(`/gigs${buildQueryString(params)}`);
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

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface Conversation {
  id: number;
  employer_id: number;
  worker_id: number;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  read: boolean;
  created_at: string;
}

export async function listConversations(): Promise<Conversation[]> {
  return request<Conversation[]>('/messages/conversations');
}

export async function createConversation(employerId: number): Promise<Conversation> {
  return request<Conversation>('/messages/conversations', {
    method: 'POST',
    body: JSON.stringify({ employer_id: employerId }),
  });
}

export async function listMessages(conversationId: number, params?: Record<string, string | number>): Promise<Message[]> {
  return request<Message[]>(`/messages/conversations/${conversationId}/messages${buildQueryString(params)}`);
}

export async function sendMessage(conversationId: number, content: string): Promise<Message> {
  return request<Message>(`/messages/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function markConversationRead(conversationId: number): Promise<void> {
  return request<void>(`/messages/conversations/${conversationId}/read`, { method: 'PATCH' });
}

// ---------------------------------------------------------------------------
// KayaScore
// ---------------------------------------------------------------------------

export interface KayaScoreAssessment {
  id: number;
  user_id: number;
  status: string;
  domain_scores: Record<string, number> | null;
  overall_score: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface KayaScoreQuestion {
  id: number;
  domain: string;
  trait: string;
  question_text: string;
  reverse_scored: boolean;
}

export async function startKayaScoreAssessment(): Promise<KayaScoreAssessment> {
  return request<KayaScoreAssessment>('/kayascore/start', { method: 'POST' });
}

export async function getKayaScoreQuestions(): Promise<KayaScoreQuestion[]> {
  return request<KayaScoreQuestion[]>('/kayascore/questions');
}

export async function submitKayaScore(assessmentId: number, responses: { question_id: number; score: number }[]): Promise<KayaScoreAssessment> {
  return request<KayaScoreAssessment>(`/kayascore/${assessmentId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
}

export async function getMyKayaScores(): Promise<KayaScoreAssessment[]> {
  return request<KayaScoreAssessment[]>('/kayascore/my-scores');
}

export async function getKayaScoreBenchmarks(category: string): Promise<{ job_category: string; trait: string; min_score: number; ideal_score: number }[]> {
  return request(`/kayascore/benchmarks/${encodeURIComponent(category)}`);
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

export interface JobMatch {
  job: Job;
  score: number;
  breakdown: Record<string, number>;
}

export interface WorkerPreference {
  id: number;
  worker_id: number;
  preferred_categories: string[];
  min_salary: number | null;
}

export async function getJobRecommendations(): Promise<JobMatch[]> {
  return request<JobMatch[]>('/matching/recommendations');
}

export async function getJobMatchScore(jobId: number): Promise<{ score: number; breakdown: Record<string, number> }> {
  return request(`/matching/score/${jobId}`);
}

export async function updatePreferences(body: { preferred_categories?: string[]; min_salary?: number }): Promise<WorkerPreference> {
  return request<WorkerPreference>('/matching/preferences', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function getPreferences(): Promise<WorkerPreference> {
  return request<WorkerPreference>('/matching/preferences');
}

// ---------------------------------------------------------------------------
// Learning
// ---------------------------------------------------------------------------

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_hours: number;
  tesda_aligned: boolean;
  created_at: string;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order: number;
}

export interface CourseEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  completed: boolean;
  enrolled_at: string;
  completed_at: string | null;
  course: Course;
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_url: string;
  issued_at: string;
}

export async function listCourses(params?: Record<string, string | number>): Promise<Course[]> {
  return request<Course[]>(`/learning/courses${buildQueryString(params)}`);
}

export async function getCourse(courseId: number): Promise<Course> {
  return request<Course>(`/learning/courses/${courseId}`);
}

export async function getCourseModules(courseId: number): Promise<CourseModule[]> {
  return request<CourseModule[]>(`/learning/courses/${courseId}/modules`);
}

export async function enrollInCourse(courseId: number): Promise<CourseEnrollment> {
  return request<CourseEnrollment>('/learning/enroll', {
    method: 'POST',
    body: JSON.stringify({ course_id: courseId }),
  });
}

export async function updateCourseProgress(enrollmentId: number, progress: number): Promise<CourseEnrollment> {
  return request<CourseEnrollment>(`/learning/progress/${enrollmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  });
}

export async function getMyCourses(): Promise<CourseEnrollment[]> {
  return request<CourseEnrollment[]>('/learning/my-courses');
}

export async function getMyCertificates(): Promise<Certificate[]> {
  return request<Certificate[]>('/learning/my-certificates');
}

// ---------------------------------------------------------------------------
// OFW
// ---------------------------------------------------------------------------

export interface OFWProfile {
  id: number;
  user_id: number;
  destination_country: string | null;
  agency: string | null;
  contract_terms: Record<string, unknown> | null;
  created_at: string;
}

export interface ContractScan {
  id: number;
  user_id: number;
  document_url: string;
  scan_results: Record<string, unknown> | null;
  risk_flags: string[] | null;
  created_at: string;
}

export interface RemittanceRecord {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  recipient_name: string;
  provider: string;
  status: string;
  created_at: string;
}

export async function getOFWProfile(): Promise<OFWProfile> {
  return request<OFWProfile>('/ofw/profile');
}

export async function updateOFWProfile(body: Partial<OFWProfile>): Promise<OFWProfile> {
  return request<OFWProfile>('/ofw/profile', { method: 'PUT', body: JSON.stringify(body) });
}

export async function submitContractScan(documentUrl: string): Promise<ContractScan> {
  return request<ContractScan>('/ofw/contract-scan', {
    method: 'POST',
    body: JSON.stringify({ document_url: documentUrl }),
  });
}

export async function getContractScans(): Promise<ContractScan[]> {
  return request<ContractScan[]>('/ofw/contract-scans');
}

export async function logRemittance(body: { amount: number; currency: string; recipient_name: string; provider: string }): Promise<RemittanceRecord> {
  return request<RemittanceRecord>('/ofw/remittance', { method: 'POST', body: JSON.stringify(body) });
}

export async function getRemittances(): Promise<{ records: RemittanceRecord[]; total_sent: number }> {
  return request('/ofw/remittances');
}

export async function sendSOS(): Promise<{ emergency_numbers: Record<string, string>; status: string }> {
  return request('/ofw/sos', { method: 'POST' });
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------

export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  currency: string;
  created_at: string;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  amount: number;
  transaction_type: string;
  description: string | null;
  balance_after: number;
  created_at: string;
}

export interface EWARequest {
  id: number;
  user_id: number;
  amount_requested: number;
  amount_approved: number | null;
  fee_amount: number | null;
  status: string;
  created_at: string;
}

export interface MicroLoan {
  id: number;
  user_id: number;
  amount: number;
  interest_rate: number;
  status: string;
  amount_repaid: number;
  created_at: string;
}

export async function initWallet(): Promise<Wallet> {
  return request<Wallet>('/wallet/init', { method: 'POST' });
}

export async function getWalletBalance(): Promise<{ wallet: Wallet; pending_ewa: number; active_loans: number }> {
  return request('/wallet/balance');
}

export async function getWalletTransactions(params?: Record<string, string | number>): Promise<WalletTransaction[]> {
  return request<WalletTransaction[]>(`/wallet/transactions${buildQueryString(params)}`);
}

export async function requestEWA(amount: number): Promise<EWARequest> {
  return request<EWARequest>('/wallet/ewa/request', {
    method: 'POST',
    body: JSON.stringify({ amount_requested: amount }),
  });
}

export async function getEWAHistory(): Promise<EWARequest[]> {
  return request<EWARequest[]>('/wallet/ewa/history');
}

export async function applyForLoan(amount: number): Promise<MicroLoan> {
  return request<MicroLoan>('/wallet/loan/apply', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function getLoanHistory(): Promise<MicroLoan[]> {
  return request<MicroLoan[]>('/wallet/loan/history');
}

// ---------------------------------------------------------------------------
// Safety
// ---------------------------------------------------------------------------

export interface ScamReport {
  id: number;
  reporter_id: number;
  reported_entity: string;
  entity_type: string;
  description: string;
  evidence_urls: string[] | null;
  status: string;
  created_at: string;
}

export interface Dispute {
  id: number;
  complainant_id: number;
  respondent_id: number;
  dispute_type: string;
  description: string;
  status: string;
  resolution: string | null;
  created_at: string;
}

export interface VerificationRequest {
  id: number;
  user_id: number;
  document_type: string;
  document_url: string;
  status: string;
  reviewer_notes: string | null;
  created_at: string;
}

export async function reportScam(body: { reported_entity: string; entity_type: string; description: string; evidence_urls?: string[] }): Promise<ScamReport> {
  return request<ScamReport>('/safety/report', { method: 'POST', body: JSON.stringify(body) });
}

export async function getMyReports(): Promise<ScamReport[]> {
  return request<ScamReport[]>('/safety/my-reports');
}

export async function fileDispute(body: { respondent_id: number; dispute_type: string; description: string }): Promise<Dispute> {
  return request<Dispute>('/safety/dispute', { method: 'POST', body: JSON.stringify(body) });
}

export async function getMyDisputes(): Promise<Dispute[]> {
  return request<Dispute[]>('/safety/my-disputes');
}

export async function submitVerification(body: { document_type: string; document_url: string }): Promise<VerificationRequest> {
  return request<VerificationRequest>('/safety/verify', { method: 'POST', body: JSON.stringify(body) });
}

export async function getMyVerifications(): Promise<VerificationRequest[]> {
  return request<VerificationRequest[]>('/safety/my-verifications');
}

// ---------------------------------------------------------------------------
// Community
// ---------------------------------------------------------------------------

export interface TradeGroup {
  id: number;
  name: string;
  description: string;
  category: string;
  member_count: number;
  created_at: string;
}

export interface GroupMembership {
  id: number;
  group_id: number;
  user_id: number;
  joined_at: string;
  group: TradeGroup;
}

export interface Referral {
  id: number;
  referrer_id: number;
  referred_id: number | null;
  referral_code: string;
  status: string;
  reward_amount: number | null;
  created_at: string;
}

export async function listTradeGroups(params?: Record<string, string | number>): Promise<TradeGroup[]> {
  return request<TradeGroup[]>(`/community/groups${buildQueryString(params)}`);
}

export async function getTradeGroup(groupId: number): Promise<TradeGroup> {
  return request<TradeGroup>(`/community/groups/${groupId}`);
}

export async function joinTradeGroup(groupId: number): Promise<GroupMembership> {
  return request<GroupMembership>(`/community/groups/${groupId}/join`, { method: 'POST' });
}

export async function leaveTradeGroup(groupId: number): Promise<void> {
  return request<void>(`/community/groups/${groupId}/leave`, { method: 'DELETE' });
}

export async function getMyGroups(): Promise<GroupMembership[]> {
  return request<GroupMembership[]>('/community/my-groups');
}

export async function createReferral(): Promise<Referral> {
  return request<Referral>('/community/referral', { method: 'POST' });
}

export async function getMyReferrals(): Promise<Referral[]> {
  return request<Referral[]>('/community/my-referrals');
}

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------

export interface Mission {
  id: number;
  title: string;
  description: string;
  mission_type: string;
  xp_reward: number;
  target_count: number;
  active: boolean;
}

export interface WorkerMission {
  id: number;
  mission_id: number;
  worker_id: number;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  mission: Mission;
}

export async function listMissions(params?: Record<string, string | number>): Promise<Mission[]> {
  return request<Mission[]>(`/missions${buildQueryString(params)}`);
}

export async function getMyMissions(): Promise<WorkerMission[]> {
  return request<WorkerMission[]>('/missions/me');
}

export async function updateMissionProgress(workerMissionId: number, progress: number): Promise<WorkerMission> {
  return request<WorkerMission>(`/missions/${workerMissionId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ progress }),
  });
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface ReviewOut {
  id: number;
  company_id: number;
  worker_id: number;
  rating: number;
  pay_timeliness: number;
  work_environment: number;
  communication: number;
  safety_standards: number;
  comment: string | null;
  created_at: string;
}

export async function createReview(body: { company_id: number; rating: number; pay_timeliness: number; work_environment: number; communication: number; safety_standards: number; comment?: string }): Promise<ReviewOut> {
  return request<ReviewOut>('/reviews', { method: 'POST', body: JSON.stringify(body) });
}

export async function getCompanyReviews(companyId: number): Promise<ReviewOut[]> {
  return request<ReviewOut[]>(`/reviews/company/${companyId}`);
}

export async function getCompanyRating(companyId: number): Promise<{ overall: number; total_reviews: number }> {
  return request(`/reviews/company/${companyId}/rating`);
}

export { ApiError };
