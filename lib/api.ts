// API Configuration and Service Layer

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.trabz.ph/api/v1';

// API Client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return apiClient.post('/auth/register', data);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};

// Jobs Services
export const jobsService = {
  getJobs: async (params?: {
    search?: string;
    category?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get(`/jobs?${queryString}`);
  },

  getJobById: async (id: string) => {
    return apiClient.get(`/jobs/${id}`);
  },

  applyForJob: async (jobId: string, applicationData: unknown) => {
    return apiClient.post(`/jobs/${jobId}/apply`, applicationData);
  },

  getMyApplications: async () => {
    return apiClient.get('/jobs/applications/me');
  },
};

// Gigs Services
export const gigsService = {
  getGigs: async (params?: {
    category?: string;
    urgent?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get(`/gigs?${queryString}`);
  },

  getGigById: async (id: string) => {
    return apiClient.get(`/gigs/${id}`);
  },

  claimGig: async (gigId: string) => {
    return apiClient.post(`/gigs/${gigId}/claim`, {});
  },

  getMyGigs: async () => {
    return apiClient.get('/gigs/my-gigs');
  },
};

// Wallet Services
export const walletService = {
  getBalance: async () => {
    return apiClient.get('/wallet/balance');
  },

  getTransactions: async (params?: {
    limit?: number;
    offset?: number;
    type?: string;
  }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get(`/wallet/transactions?${queryString}`);
  },

  cashOut: async (data: { amount: number; method: string; account: string }) => {
    return apiClient.post('/wallet/cashout', data);
  },
};

// Learning Services
export const learningService = {
  getCourses: async (params?: {
    category?: string;
    enrolled?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get(`/courses?${queryString}`);
  },

  getCourseById: async (id: string) => {
    return apiClient.get(`/courses/${id}`);
  },

  enrollCourse: async (courseId: string) => {
    return apiClient.post(`/courses/${courseId}/enroll`, {});
  },

  getMyCourses: async () => {
    return apiClient.get('/courses/enrolled');
  },

  updateProgress: async (courseId: string, lessonId: string, progress: number) => {
    return apiClient.post(`/courses/${courseId}/lessons/${lessonId}/progress`, {
      progress,
    });
  },
};

// Profile Services
export const profileService = {
  getProfile: async () => {
    return apiClient.get('/profile');
  },

  updateProfile: async (data: unknown) => {
    return apiClient.put('/profile', data);
  },

  uploadDocument: async (formData: FormData) => {
    return fetch(`${API_BASE_URL}/profile/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    }).then((res) => res.json());
  },
};

export default apiClient;
