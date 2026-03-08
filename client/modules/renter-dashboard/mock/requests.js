// Mock data de solicitudes recibidas por el arrendador
// Cada solicitud tiene: tenant, property, status, offerStatus, offerAmount, createdAt, message
export const requests = [
  // EN PROCESO (3 solicitudes - ordenadas de más antigua a más reciente)
  {
    id: 1,
    tenant: {
      name: "Sofía Herrera",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "sofia.herrera@gmail.com",
      phone: "81 1234 5678",
    },
    property: {
      title: "Depto. Centro",
      address: "Av. Universidad 123",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 8500,
    },
    status: "en_proceso",
    offerStatus: "contraoferta_por_revisar",
    offerAmount: 7800,
    createdAt: "2024-01-10",
    message: "Hola, estoy interesada en rentar el depto. Soy estudiante de último semestre.",
  },
  {
    id: 2,
    tenant: {
      name: "Diego Morales",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "diego.morales@hotmail.com",
      phone: "81 2345 6789",
    },
    property: {
      title: "Casa Norte",
      address: "Calle Roble 456",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 12000,
    },
    status: "en_proceso",
    offerStatus: "sin_oferta",
    offerAmount: null,
    createdAt: "2024-01-15",
    message: "Me interesa la propiedad, comparto con un compañero de carrera.",
  },
  {
    id: 3,
    tenant: {
      name: "Valeria Castro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "vale.castro@outlook.com",
      phone: "81 3456 7890",
    },
    property: {
      title: "Cuarto Sur",
      address: "Privada Los Pinos 789",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 4500,
    },
    status: "en_proceso",
    offerStatus: "sin_oferta",
    offerAmount: null,
    createdAt: "2024-01-20",
    message: "Busco cuarto cerca de la uni, el tuyo me queda perfecto.",
  },

  // APROBADOS (2 solicitudes)
  {
    id: 4,
    tenant: {
      name: "Andrés Fuentes",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "andres.fuentes@gmail.com",
      phone: "81 4567 8901",
    },
    property: {
      title: "Depto. Este",
      address: "Blvd. Constitución 321",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 9000,
    },
    status: "aprobada",
    offerStatus: "oferta_aceptada",
    offerAmount: 8500,
    createdAt: "2024-01-05",
    message: "Muchas gracias por aprobar mi solicitud, listo para firmar.",
  },
  {
    id: 5,
    tenant: {
      name: "Camila Ríos",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "camila.rios@live.com",
      phone: "81 5678 9012",
    },
    property: {
      title: "Casa Oeste",
      address: "Av. Tecnológico 654",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 15000,
    },
    status: "aprobada",
    offerStatus: "sin_oferta",
    offerAmount: null,
    createdAt: "2024-01-08",
    message: "Excelente, coordino contigo para la visita y entrega de llaves.",
  },

  // RECHAZADOS (1 solicitud)
  {
    id: 6,
    tenant: {
      name: "Luis Mendoza",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "luis.mendoza@yahoo.com",
      phone: "81 6789 0123",
    },
    property: {
      title: "Cuarto Centro",
      address: "Calle Principal 987",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 5500,
    },
    status: "rechazada",
    offerStatus: "oferta_rechazada",
    offerAmount: 3500,
    createdAt: "2024-01-12",
    message: "Entiendo, gracias por considerarme de todas formas.",
  },
];

// Labels para mostrar en UI
export const statusLabels = {
  en_proceso: "En proceso",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export const offerStatusLabels = {
  sin_oferta: "Sin oferta",
  contraoferta_por_revisar: "Contraoferta por revisar",
  oferta_aceptada: "Oferta aceptada",
  oferta_rechazada: "Oferta rechazada",
};