import apiClient from './client';

export const arrendadorService = {
  // Registro de arrendador
  register: async (email: string, password: string, nombre: string, apellido: string, telefono: string) => {
    const response = await apiClient.post('/api/arrendadores/registro', {
      email,
      password,
      nombre,
      apellido,
      telefono,
    });
    return response.data;
  },

  // Login de arrendador
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/arrendadores/login', {
      email,
      password,
    });
    const { data } = response.data;
    if (data?.token) {
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('arrendadorId', data.id);
      localStorage.setItem('userType', 'arrendador');
    }
    return response.data;
  },

  // Obtener perfil del arrendador
  getProfile: async (id: string) => {
    const response = await apiClient.get(`/api/arrendadores/${id}`);
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (id: string, userData: Record<string, unknown>) => {
    const response = await apiClient.put(`/api/arrendadores/${id}`, userData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const response = await apiClient.put(`/api/arrendadores/${id}/cambiar-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Obtener mis propiedades
  getMyProperties: async (id: string) => {
    const response = await apiClient.get(`/api/propiedades-renta/arrendador/${id}`);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('arrendadorId');
    localStorage.removeItem('userType');
  },
};