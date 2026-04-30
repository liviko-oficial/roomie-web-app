import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv !== undefined) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return 'http://localhost:3001';
}

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: agregar JWT
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: retry en errores de red/5xx + redirect en 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    const retryable = !error.response || (error.response.status >= 500 && error.response.status < 600);

    if (retryable && config && (config._retryCount ?? 0) < 2) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      await new Promise((r) => setTimeout(r, config._retryCount! * 500));
      return apiClient(config);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const userType = localStorage.getItem('userType');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('arrendadorId');
        localStorage.removeItem('userId');
        const target = userType === 'student' ? '/login-student' : '/login-landlord';
        window.location.href = target;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
