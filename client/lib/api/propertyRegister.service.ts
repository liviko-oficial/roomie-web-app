import apiClient from "./client";

export const registerProperty = async (formData: FormData) => {
  const get = (key: string) => formData.get(key) as string | null;
  const getJson = (key: string) => {
    try { return JSON.parse(get(key) || "[]"); } catch { return []; }
  };

  const titulo = get("title") || "Propiedad sin título";
  const descripcion = get("description") || titulo;
  const tipoPropiedad = get("propertyType") || "Casa";
  const price = Number(get("price")) || 5000;
  const campus = get("campus") || "Guadalajara";
  const petFriendly = get("petFriendly") === "true";
  const servicesIncluded = get("servicesIncluded") === "true";
  const genderCompatible = get("genderCompatible") || "Sin preferencia";
  const includedServices: string[] = getJson("includedServices");
  const mascotasPermitidas: string[] = getJson("mascotasPermitidas");

  const tipoRentaMap: Record<string, string> = {
    Casa: "Propiedad completa",
    Departamento: "Propiedad completa",
    Cuarto: "Cuarto privado",
    Loft: "Propiedad completa",
  };

  const body = {
    titulo,
    descripcion: descripcion.padEnd(50, "."),
    resumen: titulo.padEnd(20, "."),
    tipoPropiedad,
    tipoRenta: tipoRentaMap[tipoPropiedad] || "Propiedad completa",
    generoPreferido: genderCompatible,
    capacidadMaxima: Number(get("numRooms")) || 1,
    direccion: {
      calle: get("calle") || "Sin calle",
      numero: get("numero") || "",
      colonia: get("colonia") || "Sin colonia",
      ciudad: get("ciudad") || "Sin ciudad",
      estado: get("estado") || "Jalisco",
      codigoPostal: get("codigoPostal") || "44100",
    },
    caracteristicas: {
      numeroBanos: Number(get("banosCompletos")) || 1,
      numeroRecamaras: Number(get("numRooms")) || 1,
      amueblado: false,
      mascotasPermitidas: petFriendly,
      tiposMascotas: petFriendly ? mascotasPermitidas.filter((m: string) =>
        ["Perros", "Gatos", "Aves", "Peces", "Otros"].includes(m)
      ) : [],
    },
    servicios: {
      serviciosIncluidos: servicesIncluded,
      listaServicios: servicesIncluded ? includedServices.filter((s: string) =>
        ["Luz", "Agua", "Gas", "Internet", "Cable/TV", "Limpieza", "Mantenimiento", "Seguridad", "Estacionamiento", "Lavandería"].includes(s)
      ) : [],
    },
    politicas: {},
    ubicacion: {
      campus: ["Guadalajara", "Monterrey", "Ciudad de México"].includes(campus) ? campus : "Otro",
      distanciaCampus: 1,
    },
    informacionFinanciera: {
      precioMensual: price,
    },
    disponibilidad: {
      fechaDisponible: new Date().toISOString(),
    },
    imagenes: {
      principal: "https://placehold.co/800x600/1a365d/f6e05e?text=Propiedad",
      galeria: [],
    },
  };

  const multipart = new FormData();
  multipart.append("titulo", body.titulo);
  multipart.append("descripcion", body.descripcion);
  multipart.append("resumen", body.resumen);
  multipart.append("tipoPropiedad", body.tipoPropiedad);
  multipart.append("tipoRenta", body.tipoRenta);
  multipart.append("generoPreferido", body.generoPreferido);
  multipart.append("capacidadMaxima", String(body.capacidadMaxima));
  multipart.append("direccion", JSON.stringify(body.direccion));
  multipart.append("caracteristicas", JSON.stringify(body.caracteristicas));
  multipart.append("servicios", JSON.stringify(body.servicios));
  multipart.append("politicas", JSON.stringify(body.politicas));
  multipart.append("ubicacion", JSON.stringify(body.ubicacion));
  multipart.append("informacionFinanciera", JSON.stringify(body.informacionFinanciera));
  multipart.append("disponibilidad", JSON.stringify({ fechaDisponible: new Date().toISOString() }));

  const banosRaw = get("banos");
  if (banosRaw) multipart.append("banos", banosRaw);
  const habsRaw = get("habitaciones");
  if (habsRaw) multipart.append("habitaciones", habsRaw);

  formData.getAll("photos").forEach((f) => multipart.append("imagenes", f));
  for (const key of Array.from(formData.keys())) {
    if (key.startsWith("banoPhotos_") || key.startsWith("habPhotos_")) {
      formData.getAll(key).forEach((f) => multipart.append(key, f));
    }
  }

  const response = await apiClient.post("/api/propiedades-renta", multipart, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
