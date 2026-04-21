import apiClient from './client';

export const propertyService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    tipoPropiedad?: string;
    tipoRenta?: string;
    generoPreferido?: string;
    precioMinimo?: number;
    precioMaximo?: number;
    campus?: string;
    distanciaMaxima?: number;
    amueblado?: boolean;
    mascotasPermitidas?: boolean;
    serviciosIncluidos?: boolean;
    numeroBanos?: number;
    numeroRecamaras?: number;
    ordenarPor?: string;
  }) => {
    const response = await apiClient.get('/api/propiedades-renta', { params });
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
  create: async (propertyData: Record<string, unknown>) => {
    const response = await apiClient.post('/api/propiedades-renta', propertyData);
    return response.data;
  },

  // Actualizar propiedad (protegido)
  update: async (id: string, propertyData: Record<string, unknown>) => {
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