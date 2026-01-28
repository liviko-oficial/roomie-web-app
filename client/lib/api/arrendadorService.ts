import apiClient from './client';
import type { ArrendadorUpdateData } from './types';

export const arrendadorService = {
  // Registro de arrendador
  register: async (email: string, password: string, nombre: string, apellido: string, telefono: string) => {
    const response = await apiClient.post('/api/arrendadores/register', {
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
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('arrendadorId', response.data.arrendador.id);
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
  updateProfile: async (id: string, userData: ArrendadorUpdateData) => {
    const response = await apiClient.put(`/api/arrendadores/${id}`, userData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const response = await apiClient.put(`/api/arrendadores/${id}/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Obtener mis propiedades
  getMyProperties: async (id: string) => {
    const response = await apiClient.get(`/api/arrendadores/${id}/propiedades`);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('arrendadorId');
    localStorage.removeItem('userType');
  },
};