// Maps API petition status to UI status keys
const STATUS_MAP = {
  "En proceso": "en_proceso",
  "Aceptada": "aprobada",
  "Rechazada": "rechazada",
};

// Derives offer status from petition data
function deriveOfferStatus(estatus, oferta) {
  if (!oferta?.montoOfrecidoMXN) return "sin_oferta";
  switch (estatus) {
    case "En proceso": return "contraoferta_por_revisar";
    case "Aceptada": return "oferta_aceptada";
    case "Rechazada": return "oferta_rechazada";
    default: return "sin_oferta";
  }
}

// Transform API petition → student dashboard request shape
export function mapStudentPetition(pet) {
  const estatus = pet.contexto?.estatus || "En proceso";
  return {
    id: pet._id,
    landlord: {
      name: pet.landlordData?.nombre || "Arrendador",
      avatar: pet.landlordData?.foto || "",
      email: pet.landlordData?.email || "",
      phone: pet.landlordData?.telefono || "",
    },
    property: {
      title: pet.propertyData?.titulo || "Propiedad",
      address: pet.propertyData?.direccion || pet.propertyData?.campus || "",
      image: pet.propertyData?.imagen || "",
      price: pet.propertyData?.precioMensual || 0,
      initialOffer: pet.oferta?.historialOfertas?.[0] || null,
    },
    status: STATUS_MAP[estatus] || "en_proceso",
    offerStatus: deriveOfferStatus(estatus, pet.oferta),
    offerAmount: pet.oferta?.montoOfrecidoMXN || null,
    counterOffersMade: (pet.oferta?.numeroOfertas || 1) - 1,
    createdAt: pet.createdAt || pet.contexto?.fechaSolicitud,
    message: pet.contexto?.motivo || "",
  };
}

// Transform API petition → landlord dashboard request shape
export function mapLandlordPetition(pet) {
  const estatus = pet.contexto?.estatus || "En proceso";
  const uv = pet.usuarioVisible || {};
  return {
    id: pet._id,
    tenant: {
      name: [uv.nombres, uv.apellidoPaterno].filter(Boolean).join(" ") || "Estudiante",
      avatar: uv.fotoPerfilUrl || "",
      email: "",
      phone: "",
      edad: uv.edad,
      genero: uv.genero,
      hobbies: uv.hobbies || [],
      noNegociables: uv.noNegociables || [],
      areaPrograma: uv.areaPrograma,
      semestre: uv.semestreOGraduacion,
      tieneMascota: uv.tieneMascota,
    },
    property: {
      title: pet.propertyData?.titulo || "Propiedad",
      address: pet.propertyData?.direccion || "",
      image: pet.propertyData?.imagen || "",
      price: pet.propertyData?.precioMensual || 0,
    },
    status: STATUS_MAP[estatus] || "en_proceso",
    offerStatus: deriveOfferStatus(estatus, pet.oferta),
    offerAmount: pet.oferta?.montoOfrecidoMXN || null,
    counterOffersMade: (pet.oferta?.numeroOfertas || 1) - 1,
    createdAt: pet.createdAt || pet.contexto?.fechaSolicitud,
    message: pet.contexto?.motivo || "",
  };
}
