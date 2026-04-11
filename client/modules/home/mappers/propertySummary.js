// este es el mapper, sirve como un tipo de filtro para hacer una lista con las propiedades que uno desea de un json que viene del back
// esto para que si algún día una propiedad cambia en el back solamente se tiene que cambiar el nombre en este mapper y no en todos los componentes donde se usó
export function propertySummary(raw) {
  if (!raw) return null;

  // Build features array from backend fields (or fall back to mock features array)
  let features = [];
  if (raw.tipoPropiedad || raw.caracteristicas || raw.servicios) {
    // Backend format: construct features from individual fields
    if (raw.caracteristicas?.amueblado) features.push("Amueblada");
    if (raw.servicios?.serviciosIncluidos) features.push("Servicios incluidos");
    if (raw.caracteristicas?.mascotasPermitidas) features.push("Pet Friendly");
    const gender = raw.generoPreferido;
    if (gender && gender !== "Sin preferencia") features.push(gender);
  } else {
    // Mock format: use features array directly
    features = Array.isArray(raw.features) ? raw.features : [];
  }

  // Build location string from backend direccion/ubicacion, or use mock location string
  const location = raw.direccion
    ? [raw.direccion.colonia, raw.ubicacion?.campus || raw.direccion.ciudad].filter(Boolean).join(", ")
    : raw.location ?? "Ubicación no disponible";

  // Build owner from populated propietarioId (backend) or raw.owner (mock)
  const ownerRaw = raw.propietarioId;
  const owner =
    ownerRaw && typeof ownerRaw === "object" && (ownerRaw.email || ownerRaw.profile)
      ? {
          name: ownerRaw.profile?.fullName || "Propietario",
          contact: ownerRaw.email || "",
          avatar: ownerRaw.profile?.profilePicture || "",
        }
      : raw.owner ?? { name: "Propietario", contact: "", avatar: "" };

  const id = (raw._id ?? raw.id)?.toString() ?? "";
  const type = raw.tipoPropiedad ?? raw.type ?? "Desconocido";
  const isVerified = raw.disponibilidad?.disponible ?? Boolean(raw.isVerified);
  const isFeatured = raw.destacada ?? Boolean(raw.isFeatured);

  const base = {
    id,
    title: raw.titulo ?? raw.title ?? "Propiedad sin título",
    type,
    price: raw.informacionFinanciera?.precioMensual ?? raw.price ?? 0,
    location,
    image: raw.imagenes?.principal ?? raw.image ?? "https://via.placeholder.com/400x300",
    features,
    rating: raw.calificacion ?? raw.rating ?? 0,
    isVerified,
    isFeatured,
    bathrooms: raw.caracteristicas?.numeroBanos ?? raw.bathrooms ?? 1,
    petFriendly: raw.caracteristicas?.mascotasPermitidas ?? Boolean(raw.petFriendly),
    description: raw.descripcion ?? raw.description ?? "",
    images: raw.imagenes?.galeria ?? (Array.isArray(raw.images) ? raw.images : []),
    owner,
    includedServices: raw.servicios?.listaServicios ?? raw.includedServices ?? [],
    securityType: raw.securityType ?? null,
    parkingSpaces: raw.parkingSpaces ?? 0,
  };

  if (type === "Casa") {
    return {
      ...base,
      comuneAreas: raw.comuneAreas ?? [],
      propertyRequirements: raw.propertyRequirements ?? null,
      essentialRequirements: raw.essentialRequirements ?? [],
      securityDeposit: raw.informacionFinanciera?.deposito ?? raw.securityDeposit ?? 0,
      contractDuration: raw.disponibilidad?.duracionMinimaContrato ?? raw.contractDuration ?? null,
    };
  }

  return base;
}

// para usarlo se haría de la siguiente manera, siendo raw el json que viene del back:
//import { propertySummary } from "@/modules/home/mappers/propertySummary";
//const property = propertySummary(raw);
