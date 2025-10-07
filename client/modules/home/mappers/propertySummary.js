// este es el mapper, sirve como un tipo de filtro para hacer una lista con las propiedades que uno desea de un json que viene del back
// esto para que si algún día una propiedad cambia en el back solamente se tiene que cambiar el nombre en este mapper y no en todos los componentes donde se usó
export function propertySummary(raw) {
  if (!raw) return null;
  if (raw.type == "Casa") {
      return {
        // aqui por ejemplo si la id cambia de nombre a "identificación" solamente basta con hacer lo siguiente:
        // id: raw.identidad
        id: raw.id,
        title: raw.title ?? "Propiedad sin título",
        type: raw.type ?? "Desconocido",
        price: raw.price ?? 0,
        location: raw.location ?? "Ubicación no disponible",
        image: raw.image ?? "https://via.placeholder.com/400x300",
        features: Array.isArray(raw.features) ? raw.features : [],
        rating: raw.rating ?? 0,
        isVerified: Boolean(raw.isVerified),
        bathrooms: raw.bathrooms ?? 1,
        petFriendly: Boolean(raw.petFriendly),
        description: raw.description ?? "",
        images: Array.isArray(raw.images) ? raw.images : [],
        owner: raw.owner ?? { name: "Propietario", contact: "", avatar: "" },
        includedServices: raw.includedServices ?? [],
        comuneAreas: raw.comuneAreas ?? [],
        parkingSpaces: raw.parkingSpaces ?? null,
        propertyRequirements: raw.propertyRequirements ?? null,
        essentialRequirements: raw.essentialRequirements ?? [],  
        securityDeposit: raw.securityDeposit ?? [],
        contractDuration: raw.contractDuration ?? [],
        securityType: raw.securityType ?? null
      };
  };

  return {
    id: raw.id,
    title: raw.title ?? "Propiedad sin título",
    type: raw.type ?? "Desconocido",
    price: raw.price ?? 0,
    location: raw.location ?? "Ubicación no disponible",
    image: raw.image ?? "https://via.placeholder.com/400x300",
    features: Array.isArray(raw.features) ? raw.features : [],
    rating: raw.rating ?? 0,
    isVerified: Boolean(raw.isVerified),
    bathrooms: raw.bathrooms ?? 1,
    petFriendly: Boolean(raw.petFriendly),
    description: raw.description ?? "",
    images: Array.isArray(raw.images) ? raw.images : [],
    owner: raw.owner ?? { name: "Propietario", contact: "", avatar: "" },
    includedServices: raw.includedServices ?? [],
    securityType: raw.securityType ?? null,
  };
}

// para usarlo se haría de la siguiente manera, siendo raw el json que viene del back:
//import { propertySummary } from "@/modules/home/mappers/propertySummary";
//const property = propertySummary(raw);

