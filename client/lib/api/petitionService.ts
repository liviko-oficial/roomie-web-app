import apiClient from './client';

export const petitionService = {
  // Student: create petition with offer
  create: async (propertyId: string, userId: string, montoOfrecidoMXN?: number) => {
    const oferta = montoOfrecidoMXN
      ? { montoOfrecidoMXN, numeroOfertas: 1, historialOfertas: [montoOfrecidoMXN] }
      : undefined;
    const response = await apiClient.post(`/api/propiedades-renta/${propertyId}/solicitar`, {
      userId,
      oferta,
    });
    return response.data;
  },

  // Student: list my petitions (with property + landlord data populated)
  getByStudent: async (userId: string, page = 1) => {
    const response = await apiClient.get(`/api/propiedades/peticiones/usuario/${userId}`, {
      params: { page, limit: 50 },
    });
    return response.data;
  },

  // Student: send counter-offer
  counterOffer: async (petitionId: string, montoOfrecidoMXN: number) => {
    const response = await apiClient.put(`/api/propiedades/peticiones/${petitionId}/contraoferta`, {
      montoOfrecidoMXN,
    });
    return response.data;
  },

  // Landlord: list petitions for my properties
  getByLandlord: async (arrendadorId: string, page = 1) => {
    const response = await apiClient.get(`/api/propiedades/${arrendadorId}/peticiones`, {
      params: { page, limit: 50 },
    });
    return response.data;
  },

  // Landlord: accept petition
  accept: async (petitionId: string, landlordId: string) => {
    const response = await apiClient.put(`/api/propiedades/peticiones/${petitionId}/aceptar`, {
      landlordId,
    });
    return response.data;
  },

  // Landlord: reject petition
  reject: async (petitionId: string, landlordId: string, motivo?: string) => {
    const response = await apiClient.put(`/api/propiedades/peticiones/${petitionId}/rechazar`, {
      landlordId,
      motivo: motivo || "Solicitud rechazada",
    });
    return response.data;
  },
};
