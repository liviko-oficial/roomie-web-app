import apiClient from './client';

export const propertyService = {
  // Obtener todas las propiedades (con filtros)
  getAll: async (params?: any) => {
    const response = await apiClient.get('/api/propiedades-renta', {
      params, // campus, precio, tipo, etc
    });
    return response.data;
  },

  // Obtener una propiedad por ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/api/propiedades-renta/${id}`);
    return response.data;
  },

  // Obtener propiedades de un arrendador
  getByArrendador: async (arrendadorId: string) => {
    const response = await apiClient.get(`/api/propiedades-renta/arrendador/${arrendadorId}`);
    return response.data;
  },

  // Crear propiedad (protegido - solo arrendador)
  create: async (propertyData: any) => {
    const response = await apiClient.post('/api/propiedades-renta', propertyData);
    return response.data;
  },

  // Actualizar propiedad (protegido)
  update: async (id: string, propertyData: any) => {
    const response = await apiClient.put(`/api/propiedades-renta/${id}`, propertyData);
    return response.data;
  },

  // Eliminar propiedad (soft delete - protegido)
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/propiedades-renta/${id}`);
    return response.data;
  },

  // Restaurar propiedad eliminada
  restore: async (id: string) => {
    const response = await apiClient.patch(`/api/propiedades-renta/${id}/restaurar`);
    return response.data;
  },
};