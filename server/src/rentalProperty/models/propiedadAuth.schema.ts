import { z } from "zod";

/* ----------------------------------------------
   🔹 Esquemas de validación para propiedades de renta
   - Validación estricta para creación y actualización de propiedades
   - Se utiliza durante el proceso de registro y edición
------------------------------------------------ */

// Validación para creación de nueva propiedad
export const PropiedadCreacionSchema = z.object({
  // Información básica (requerida)
  titulo: z.string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(100, "El título no puede exceder 100 caracteres")
    .refine(
      (titulo) => !/[<>\"'&]/.test(titulo),
      "El título contiene caracteres no permitidos"
    ),

  descripcion: z.string()
    .min(50, "La descripción debe tener al menos 50 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),

  resumen: z.string()
    .min(20, "El resumen debe tener al menos 20 caracteres")
    .max(200, "El resumen no puede exceder 200 caracteres"),

  // Tipo de propiedad y renta (requerido)
  tipoPropiedad: z.enum([
    "Casa",
    "Departamento",
    "Cuarto",
    "Studio",
    "Loft",
    "Casa de huéspedes"
  ], {
    errorMap: () => ({ message: "Tipo de propiedad no válido" })
  }),

  tipoRenta: z.enum([
    "Propiedad completa",
    "Cuarto privado",
    "Cuarto compartido",
    "Cama en dormitorio"
  ], {
    errorMap: () => ({ message: "Tipo de renta no válido" })
  }),

  // Preferencias de inquilinos
  generoPreferido: z.enum([
    "Solo hombres",
    "Solo mujeres",
    "Mixto",
    "Sin preferencia"
  ]).default("Sin preferencia"),

  capacidadMaxima: z.number()
    .int("La capacidad debe ser un número entero")
    .min(1, "La capacidad máxima debe ser al menos 1")
    .max(20, "La capacidad máxima no puede exceder 20"),

  edadMinima: z.number()
    .int("La edad mínima debe ser un número entero")
    .min(17, "La edad mínima debe ser al menos 17")
    .default(18),

  edadMaxima: z.number()
    .int("La edad máxima debe ser un número entero")
    .min(18, "La edad máxima debe ser al menos 18")
    .default(30),

  // Dirección (requerida)
  direccion: z.object({
    calle: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    numero: z.string().optional(),
    colonia: z.string().min(2, "La colonia es requerida"),
    ciudad: z.string().min(2, "La ciudad es requerida"),
    estado: z.string().min(2, "El estado es requerido"),
    codigoPostal: z.string()
      .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos")
      .refine(
        (cp) => parseInt(cp) >= 10000 && parseInt(cp) <= 99999,
        "Código postal no válido para México"
      ),
    pais: z.string().default("México"),
    referencias: z.string().optional(),
  }),

  // Características (requeridas)
  caracteristicas: z.object({
    metrosCuadrados: z.number()
      .min(1, "Los metros cuadrados deben ser mayor a 0")
      .max(1000, "Los metros cuadrados no pueden exceder 1000")
      .optional(),
    numeroBanos: z.number()
      .int("El número de baños debe ser un entero")
      .min(1, "Debe tener al menos 1 baño")
      .max(10, "No puede tener más de 10 baños"),
    numeroRecamaras: z.number()
      .int("El número de recámaras debe ser un entero")
      .min(0, "El número de recámaras no puede ser negativo")
      .max(20, "No puede tener más de 20 recámaras"),
    piso: z.number()
      .int("El piso debe ser un número entero")
      .min(0, "El piso no puede ser negativo")
      .max(50, "El piso no puede exceder 50")
      .optional(),
    amueblado: z.boolean().default(false),
    muebles: z.array(z.enum([
      "Cama", "Escritorio", "Silla", "Armario", "Refrigerador",
      "Microondas", "Lavadora", "Secadora", "Televisión", "Sofa",
      "Mesa de comedor", "Estufa", "Aire acondicionado"
    ])).default([]),
    mascotasPermitidas: z.boolean().default(false),
    tiposMascotas: z.array(z.enum([
      "Perros", "Gatos", "Aves", "Peces", "Otros"
    ])).default([]),
  }),

  // Servicios
  servicios: z.object({
    serviciosIncluidos: z.boolean().default(false),
    listaServicios: z.array(z.enum([
      "Luz", "Agua", "Gas", "Internet", "Cable/TV",
      "Limpieza", "Mantenimiento", "Seguridad", "Estacionamiento", "Lavandería"
    ])).default([]),
    costoServicios: z.number()
      .min(0, "El costo de servicios no puede ser negativo")
      .max(50000, "El costo de servicios es demasiado alto")
      .default(0),
  }),

  // Políticas
  politicas: z.object({
    reglasConvivencia: z.array(z.string()).default([]),
    horarioVisitas: z.string().optional(),
    fiestas: z.boolean().default(false),
    fumar: z.boolean().default(false),
    alcohol: z.boolean().default(false),
    parejasPermitidas: z.boolean().default(true),
  }),

  // Ubicación (requerida)
  ubicacion: z.object({
    campus: z.enum([
      "Guadalajara", "Monterrey", "Ciudad de México", "Otro"
    ]).default("Guadalajara"),
    distanciaCampus: z.number()
      .min(0, "La distancia no puede ser negativa")
      .max(100, "La distancia no puede exceder 100 km"),
    unidadDistancia: z.enum(["metros", "kilómetros"]).default("kilómetros"),
    transporte: z.array(z.enum([
      "Camión urbano", "Metro", "Metrobús", "Taxi",
      "Uber/DiDi", "Bicicleta", "A pie"
    ])).default([]),
    tiempoTraslado: z.number()
      .min(1, "El tiempo de traslado debe ser mayor a 0")
      .max(300, "El tiempo de traslado no puede exceder 300 minutos")
      .optional(),
  }),

  // Información financiera (requerida)
  informacionFinanciera: z.object({
    precioMensual: z.number()
      .min(1, "El precio mensual debe ser mayor a 0")
      .max(100000, "El precio mensual no puede exceder $100,000"),
    deposito: z.number()
      .min(0, "El depósito no puede ser negativo")
      .max(200000, "El depósito no puede exceder $200,000")
      .default(0),
    comisionAgencia: z.number()
      .min(0, "La comisión no puede ser negativa")
      .max(50000, "La comisión no puede exceder $50,000")
      .default(0),
    incrementoAnual: z.number()
      .min(0, "El incremento anual no puede ser negativo")
      .max(50, "El incremento anual no puede exceder 50%")
      .default(0),
    descuentos: z.object({
      estudiantil: z.number().min(0).max(100).default(0),
      pronto: z.number().min(0).max(100).default(0),
      largo: z.number().min(0).max(100).default(0),
    }).default({}),
  }),

  // Disponibilidad
  disponibilidad: z.object({
    fechaDisponible: z.date()
      .min(new Date(), "La fecha disponible no puede ser en el pasado")
      .default(() => new Date()),
    duracionMinimaContrato: z.number()
      .int("La duración mínima debe ser un número entero")
      .min(1, "La duración mínima debe ser al menos 1 mes")
      .max(24, "La duración mínima no puede exceder 24 meses")
      .default(6),
    duracionMaximaContrato: z.number()
      .int("La duración máxima debe ser un número entero")
      .min(1, "La duración máxima debe ser al menos 1 mes")
      .max(48, "La duración máxima no puede exceder 48 meses")
      .default(12),
    renovacionAutomatica: z.boolean().default(false),
    disponible: z.boolean().default(true),
  }),

  // Imágenes (requerida al menos la principal)
  imagenes: z.object({
    principal: z.string()
      .url("La imagen principal debe ser una URL válida")
      .refine(
        (url) => /\.(jpg|jpeg|png|webp)$/i.test(url),
        "La imagen debe ser un archivo jpg, jpeg, png o webp"
      ),
    galeria: z.array(
      z.string()
        .url("Todas las imágenes deben ser URLs válidas")
        .refine(
          (url) => /\.(jpg|jpeg|png|webp)$/i.test(url),
          "Las imágenes deben ser archivos jpg, jpeg, png o webp"
        )
    ).max(20, "No se pueden subir más de 20 imágenes").default([]),
    tour360: z.string()
      .url("El tour 360 debe ser una URL válida")
      .optional(),
  }),
})
.refine(
  (data) => data.edadMinima <= data.edadMaxima,
  {
    message: "La edad mínima no puede ser mayor que la edad máxima",
    path: ["edadMaxima"]
  }
)
.refine(
  (data) => data.disponibilidad.duracionMinimaContrato <= data.disponibilidad.duracionMaximaContrato,
  {
    message: "La duración mínima no puede ser mayor que la duración máxima",
    path: ["disponibilidad", "duracionMaximaContrato"]
  }
)
.refine(
  (data) => {
    if (data.caracteristicas.mascotasPermitidas && data.caracteristicas.tiposMascotas.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: "Debe especificar los tipos de mascotas permitidas",
    path: ["caracteristicas", "tiposMascotas"]
  }
)
.refine(
  (data) => {
    if (data.servicios.serviciosIncluidos && data.servicios.listaServicios.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: "Debe especificar qué servicios están incluidos",
    path: ["servicios", "listaServicios"]
  }
);

/* ----------------------------------------------
   🔹 Esquema de validación para actualización de propiedad
   - Versión más flexible para actualizaciones parciales
------------------------------------------------ */
export const PropiedadActualizacionSchema = PropiedadCreacionSchema.partial();

/* ----------------------------------------------
   🔹 Esquema de validación para filtros de búsqueda
   - Se utiliza para validar parámetros de búsqueda
------------------------------------------------ */
export const PropiedadFiltrosSchema = z.object({
  tipoPropiedad: z.array(z.enum([
    "Casa", "Departamento", "Cuarto", "Studio", "Loft", "Casa de huéspedes"
  ])).optional(),

  tipoRenta: z.array(z.enum([
    "Propiedad completa", "Cuarto privado", "Cuarto compartido", "Cama en dormitorio"
  ])).optional(),

  generoPreferido: z.array(z.enum([
    "Solo hombres", "Solo mujeres", "Mixto", "Sin preferencia"
  ])).optional(),

  precioMinimo: z.number().min(0).optional(),
  precioMaximo: z.number().min(0).optional(),

  campus: z.enum([
    "Guadalajara", "Monterrey", "Ciudad de México", "Otro"
  ]).optional(),

  distanciaMaxima: z.number().min(0).optional(),

  amueblado: z.boolean().optional(),
  mascotasPermitidas: z.boolean().optional(),
  serviciosIncluidos: z.boolean().optional(),

  numeroBanos: z.number().int().min(1).optional(),
  numeroRecamaras: z.number().int().min(0).optional(),

  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),

  ordenarPor: z.enum([
    "precio_asc", "precio_desc", "distancia", "calificacion", "fecha_desc"
  ]).optional(),
})
.refine(
  (data) => {
    if (data.precioMinimo && data.precioMaximo) {
      return data.precioMinimo <= data.precioMaximo;
    }
    return true;
  },
  {
    message: "El precio mínimo no puede ser mayor que el precio máximo",
    path: ["precioMaximo"]
  }
);

/* ----------------------------------------------
    Tipos de TypeScript (inferidos desde Zod)
   - Facilitan el tipado estático en controladores y servicios
------------------------------------------------ */
export type PropiedadCreacionSchema = z.infer<typeof PropiedadCreacionSchema>;
export type PropiedadActualizacionSchema = z.infer<typeof PropiedadActualizacionSchema>;
export type PropiedadFiltrosSchema = z.infer<typeof PropiedadFiltrosSchema>;