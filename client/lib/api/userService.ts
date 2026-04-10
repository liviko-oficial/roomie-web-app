import apiClient from './client';

export const userService = {
  // Registro
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/user/register', {
      email,
      password,
    });
    return response.data;
  },

  // Verificar email
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/user/register/verify?token=${token}`);
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/user/login', {
      email,
      password,
    });
    // Guardar token
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
    }
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData: any) => {
    const response = await apiClient.put('/user', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
  },
};