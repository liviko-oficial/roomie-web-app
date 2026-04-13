// Mock data de solicitudes recibidas por el arrendador (de estudiantes)
export const renterRequests = [
  {
    id: 101,
    tenant: {
      name: "Ana Sofía García",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      email: "ana.garcia@tec.mx",
      phone: "81 9876 5432",
    },
    property: {
      title: "Depto. Centro",
      address: "Av. Universidad 123",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      price: 8500,
    },
    status: "en_proceso",
    offerStatus: "contraoferta_por_revisar",
    offerAmount: 7800,
    counterOffersMade: 1,
    createdAt: "2024-01-12",
    message: "Me interesa mucho el departamento, ¿podemos negociar el precio?",
  },
  {
    id: 102,
    tenant: {
      name: "Diego Ramírez Torres",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      email: "diego.ramirez@tec.mx",
      phone: "81 5555 1234",
    },
    property: {
      title: "Casa Norte",
      address: "Calle Roble 456",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      price: 12000,
    },
    status: "en_proceso",
    offerStatus: "sin_oferta",
    offerAmount: null,
    createdAt: "2024-01-18",
    message: "Busco un lugar cerca del campus, me gustaría agendar una visita.",
  },
  {
    id: 103,
    tenant: {
      name: "Valentina López",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80",
      email: "vale.lopez@tec.mx",
      phone: "81 4444 5678",
    },
    property: {
      title: "Cuarto Sur",
      address: "Privada Los Pinos 789",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      price: 4500,
    },
    status: "aprobada",
    offerStatus: "oferta_aceptada",
    offerAmount: 4200,
    counterOffersMade: 2,
    createdAt: "2024-01-05",
    message: "Acepto las condiciones, ¿cuándo puedo mudarme?",
  },
  {
    id: 104,
    tenant: {
      name: "Mateo Hernández",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      email: "mateo.hdz@tec.mx",
      phone: "81 3333 9012",
    },
    property: {
      title: "Depto. Este",
      address: "Blvd. Constitución 321",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      price: 9000,
    },
    status: "rechazada",
    offerStatus: "oferta_rechazada",
    offerAmount: 5500,
    createdAt: "2024-01-08",
    message: "Me gustaría rentar este departamento para el próximo semestre.",
  },
];

export const renterStatusLabels = {
  en_proceso: "En proceso",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export const renterOfferStatusLabels = {
  sin_oferta: "Sin oferta",
  contraoferta_por_revisar: "Contraoferta por revisar",
  oferta_aceptada: "Oferta aceptada",
  oferta_rechazada: "Oferta rechazada",
};
