// utils/mappers/propertySummary.js
export function propertySummary(raw) {
  if (!raw) return null;

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

