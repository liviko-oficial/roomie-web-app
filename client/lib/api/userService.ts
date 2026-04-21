import apiClient from './client';

export const userService = {
  // Registro
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/api/register', {
      email,
      password,
    });
    return response.data;
  },

  // Verificar email
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/api/register/verify?token=${token}`);
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/login', {
      email,
      password,
    });
    // Guardar token
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userType', 'student');
    }
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await apiClient.get('/api/user');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData: Record<string, unknown>) => {
    const response = await apiClient.put('/api/user', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  },
};