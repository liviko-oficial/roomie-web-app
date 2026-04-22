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

  const response = await apiClient.post("/api/propiedades-renta", body);
  return response.data;
};
