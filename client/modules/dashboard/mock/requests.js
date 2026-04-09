// Mock data de solicitudes del estudiante
// Cada solicitud tiene: landlord, property, status, offerStatus, offerAmount, createdAt, message
export const requests = [
  // EN PROCESO (3 solicitudes - ordenadas de más antigua a más reciente)
  {
    id: 1,
    landlord: {
      name: "Roberto Martínez",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "roberto.mtz@gmail.com",
      phone: "81 1234 5678",
    },
    property: {
      title: "Depto. Centro",
      address: "Av. Universidad 123",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 8500,
      initialOffer: 8000,
    },
    status: "en_proceso",
    offerStatus: "contraoferta_por_revisar",
    offerAmount: 7800,
    counterOffersMade: 1,
    createdAt: "2024-01-10",
    message: "Te envié una contraoferta, revísala cuando puedas.",
  },
  {
    id: 2,
    landlord: {
      name: "María Fernanda López",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "maferlop@hotmail.com",
      phone: "81 2345 6789",
    },
    property: {
      title: "Casa Norte",
      address: "Calle Roble 456",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 12000,
      initialOffer: 11000,
    },
    status: "en_proceso",
    offerStatus: "sin_oferta",
    offerAmount: null,
    createdAt: "2024-01-15",
    message: "Tu solicitud está siendo revisada.",
  },
  {
    id: 3,
    landlord: {
      name: "Carlos Vega",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "cvega@outlook.com",
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
    message: "Recibí tu solicitud, te contacto pronto.",
  },

  // APROBADOS (2 solicitudes)
  {
    id: 4,
    landlord: {
      name: "Ana Gutiérrez",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "ana.gtz@gmail.com",
      phone: "81 4567 8901",
    },
    property: {
      title: "Depto. Este",
      address: "Blvd. Constitución 321",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: 9000,
      initialOffer: 8800,
    },
    status: "aprobada",
    offerStatus: "oferta_aceptada",
    offerAmount: 8500,
    counterOffersMade: 2,
    createdAt: "2024-01-05",
    message: "Solicitud aprobada. Contáctame para firmar contrato.",
  },
  {
    id: 5,
    landlord: {
      name: "Jorge Ramírez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "jorge.ramirez@live.com",
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
    message: "Bienvenido, agenda una visita para entregarte las llaves.",
  },

  // RECHAZADOS (1 solicitud)
  {
    id: 6,
    landlord: {
      name: "Patricia Núñez",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "paty.nunez@yahoo.com",
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
    message: "Lo siento, la propiedad ya fue rentada a otro estudiante.",
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
