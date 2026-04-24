import { Request, Response } from "express";
import { PropiedadRentaDB } from "../models/rentalProperty.schema";
import { ArrendadorDB } from "../../arrendador/models/arrendador.schema";
import { PropiedadCreacionSchema, PropiedadFiltrosSchema } from "../models/propiedadAuth.schema";
import { MENSAJES_ERROR, LIMITES, ESTADOS_PROPIEDAD } from "../lib/constants";

function safeJsonParse(value: string | undefined): unknown {
  if (!value) return undefined;
  try { return JSON.parse(value); } catch { return undefined; }
}

/**
 * Controlador de propiedades
 * Maneja las operaciones CREATE y READ para propiedades de renta
 */
export class PropertyController {
  /**
   * Crear una nueva propiedad
   * POST /api/propiedades-renta
   * - Requiere autenticación de arrendador
   * - Valida los datos de entrada usando PropiedadCreacionSchema
   * - Asocia la propiedad con el arrendador autenticado
   * - Guarda la propiedad en la base de datos
   */
  static async createProperty(req: Request, res: Response) {
    try {
      // Obtener ID del arrendador autenticado desde el middleware de autenticación
      const arrendadorId = req.arrendador?.id;

      if (!arrendadorId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // Parsear arrays enviados como JSON strings vía FormData
      const bodyNormalizado = { ...req.body };
      if (typeof bodyNormalizado.banos === "string") {
        bodyNormalizado.banos = safeJsonParse(bodyNormalizado.banos) ?? [];
      }
      if (typeof bodyNormalizado.habitaciones === "string") {
        bodyNormalizado.habitaciones = safeJsonParse(bodyNormalizado.habitaciones) ?? [];
      }

      // Validar datos de entrada con Zod
      const validacionResultado = PropiedadCreacionSchema.safeParse(bodyNormalizado);

      if (!validacionResultado.success) {
        return res.status(400).json({
          success: false,
          message: MENSAJES_ERROR.DATOS_INVALIDOS,
          errors: validacionResultado.error.errors
        });
      }

      const datosPropiedad = validacionResultado.data;

      // Verificar que el arrendador existe y está activo
      const arrendador = await ArrendadorDB.findOne({
        _id: arrendadorId,
        isActive: true
      });

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado o inactivo"
        });
      }

      // Derivar numeroBanos del catálogo de baños (retrocompat con filtros existentes)
      const caracteristicasDerivadas = {
        ...datosPropiedad.caracteristicas,
        numeroBanos: datosPropiedad.banos?.length ?? datosPropiedad.caracteristicas.numeroBanos,
        numeroRecamaras:
          datosPropiedad.habitaciones?.length || datosPropiedad.caracteristicas.numeroRecamaras,
      };

      // Crear nueva propiedad con los datos validados
      const nuevaPropiedad = new PropiedadRentaDB({
        ...datosPropiedad,
        caracteristicas: caracteristicasDerivadas,
        propietarioId: arrendadorId,
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        calificacion: 0,
        numeroReviews: 0,
        vistas: 0,
        favoritos: 0,
        verificada: false,
        destacada: false,
        inquilinosActuales: [],
        aplicaciones: [],
        historialInquilinos: []
      });

      // Guardar en la base de datos
      await nuevaPropiedad.save();

      // Asociar la propiedad al arrendador
      await ArrendadorDB.findByIdAndUpdate(arrendadorId, {
        $push: { properties: nuevaPropiedad._id },
        updatedAt: new Date()
      });

      return res.status(201).json({
        success: true,
        message: "Propiedad creada exitosamente",
        data: nuevaPropiedad
      });

    } catch (error: any) {
      console.error("Error al crear propiedad:", error);

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener todas las propiedades públicas con filtros
   * GET /api/propiedades-renta
   * - No requiere autenticación (público)
   * - Soporta múltiples filtros: tipo, precio, campus, etc.
   * - Incluye paginación y ordenamiento
   */
  static async getAllProperties(req: Request, res: Response) {
    try {
      // Validar parámetros de filtro usando el schema
      const validacionFiltros = PropiedadFiltrosSchema.safeParse({
        tipoPropiedad: safeJsonParse(req.query.tipoPropiedad as string),
        tipoRenta: safeJsonParse(req.query.tipoRenta as string),
        generoPreferido: safeJsonParse(req.query.generoPreferido as string),
        precioMinimo: req.query.precioMinimo ? parseFloat(req.query.precioMinimo as string) : undefined,
        precioMaximo: req.query.precioMaximo ? parseFloat(req.query.precioMaximo as string) : undefined,
        campus: req.query.campus as string,
        distanciaMaxima: req.query.distanciaMaxima ? parseFloat(req.query.distanciaMaxima as string) : undefined,
        amueblado: req.query.amueblado ? req.query.amueblado === 'true' : undefined,
        mascotasPermitidas: req.query.mascotasPermitidas ? req.query.mascotasPermitidas === 'true' : undefined,
        serviciosIncluidos: req.query.serviciosIncluidos ? req.query.serviciosIncluidos === 'true' : undefined,
        numeroBanos: req.query.numeroBanos ? parseInt(req.query.numeroBanos as string) : undefined,
        numeroRecamaras: req.query.numeroRecamaras ? parseInt(req.query.numeroRecamaras as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : LIMITES.DEFAULT_ITEMS_POR_PAGINA,
        ordenarPor: req.query.ordenarPor as any
      });

      if (!validacionFiltros.success) {
        return res.status(400).json({
          success: false,
          message: "Parámetros de filtro inválidos",
          errors: validacionFiltros.error.errors
        });
      }

      const filtros = validacionFiltros.data;
      const { page, limit, ordenarPor, ...criteriosBusqueda } = filtros;
      const skip = (page - 1) * limit;

      // Construir query de MongoDB
      const query: any = {
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        "disponibilidad.disponible": true
      };

      // Aplicar filtros
      if (criteriosBusqueda.tipoPropiedad) {
        query.tipoPropiedad = { $in: criteriosBusqueda.tipoPropiedad };
      }

      if (criteriosBusqueda.tipoRenta) {
        query.tipoRenta = { $in: criteriosBusqueda.tipoRenta };
      }

      if (criteriosBusqueda.generoPreferido) {
        query.generoPreferido = { $in: criteriosBusqueda.generoPreferido };
      }

      if (criteriosBusqueda.precioMinimo || criteriosBusqueda.precioMaximo) {
        query["informacionFinanciera.precioMensual"] = {};
        if (criteriosBusqueda.precioMinimo) {
          query["informacionFinanciera.precioMensual"].$gte = criteriosBusqueda.precioMinimo;
        }
        if (criteriosBusqueda.precioMaximo) {
          query["informacionFinanciera.precioMensual"].$lte = criteriosBusqueda.precioMaximo;
        }
      }

      if (criteriosBusqueda.campus) {
        query["ubicacion.campus"] = criteriosBusqueda.campus;
      }

      if (criteriosBusqueda.distanciaMaxima) {
        query["ubicacion.distanciaCampus"] = { $lte: criteriosBusqueda.distanciaMaxima };
      }

      if (criteriosBusqueda.amueblado !== undefined) {
        query["caracteristicas.amueblado"] = criteriosBusqueda.amueblado;
      }

      if (criteriosBusqueda.mascotasPermitidas !== undefined) {
        query["caracteristicas.mascotasPermitidas"] = criteriosBusqueda.mascotasPermitidas;
      }

      if (criteriosBusqueda.serviciosIncluidos !== undefined) {
        query["servicios.serviciosIncluidos"] = criteriosBusqueda.serviciosIncluidos;
      }

      if (criteriosBusqueda.numeroBanos) {
        query["caracteristicas.numeroBanos"] = { $gte: criteriosBusqueda.numeroBanos };
      }

      if (criteriosBusqueda.numeroRecamaras !== undefined) {
        query["caracteristicas.numeroRecamaras"] = { $gte: criteriosBusqueda.numeroRecamaras };
      }

      // Definir ordenamiento
      let ordenamiento: any = { fechaCreacion: -1 }; // Por defecto, más recientes primero

      if (ordenarPor) {
        switch (ordenarPor) {
          case "precio_asc":
            ordenamiento = { "informacionFinanciera.precioMensual": 1 };
            break;
          case "precio_desc":
            ordenamiento = { "informacionFinanciera.precioMensual": -1 };
            break;
          case "distancia":
            ordenamiento = { "ubicacion.distanciaCampus": 1 };
            break;
          case "calificacion":
            ordenamiento = { calificacion: -1 };
            break;
          case "fecha_desc":
            ordenamiento = { fechaCreacion: -1 };
            break;
        }
      }

      // Ejecutar consulta con paginación
      const [propiedades, total] = await Promise.all([
        PropiedadRentaDB.find(query)
          .sort(ordenamiento)
          .skip(skip)
          .limit(limit)
          .select("-inquilinosActuales -aplicaciones -historialInquilinos") // Ocultar datos sensibles
          .lean(),
        PropiedadRentaDB.countDocuments(query)
      ]);

      const totalPaginas = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: {
          propiedades,
          paginacion: {
            paginaActual: page,
            totalPaginas,
            totalPropiedades: total,
            propiedadesPorPagina: limit,
            tieneSiguiente: page < totalPaginas,
            tieneAnterior: page > 1
          },
          filtrosAplicados: criteriosBusqueda
        }
      });

    } catch (error: any) {
      console.error("Error al obtener propiedades:", error);

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener una propiedad específica por ID
   * GET /api/propiedades-renta/:propertyId
   * - No requiere autenticación (público)
   * - Incrementa el contador de vistas
   * - Devuelve todos los detalles de la propiedad
   */
  static async getPropertyById(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;

      // Buscar propiedad y aumentar contador de vistas
      const propiedad = await PropiedadRentaDB.findByIdAndUpdate(
        propertyId,
        { $inc: { vistas: 1 } },
        { new: true }
      )
        .populate("propietarioId", "nombre apellido email telefono fotoPerfil calificacion")
        .lean();

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      return res.status(200).json({
        success: true,
        data: propiedad
      });

    } catch (error: any) {
      console.error("Error al obtener propiedad:", error);

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  /**
   * Obtener propiedades de un arrendador específico
   * GET /api/propiedades-renta/arrendador/:arrendadorId
   * - Requiere autenticación
   * - Solo el arrendador puede ver todas sus propiedades (incluyendo inactivas)
   * - Otros usuarios solo ven propiedades activas
   */
  static async getPropertiesByArrendador(req: Request, res: Response) {
    try {
      const { arrendadorId } = req.params;
      const arrendadorAutenticado = req.arrendador?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || LIMITES.DEFAULT_ITEMS_POR_PAGINA;
      const skip = (page - 1) * limit;

      // Verificar que el arrendador existe
      const arrendador = await ArrendadorDB.findById(arrendadorId);

      if (!arrendador) {
        return res.status(404).json({
          success: false,
          message: "Arrendador no encontrado"
        });
      }

      // Construir query base
      const query: any = { propietarioId: arrendadorId };

      // Si es el propietario autenticado, puede ver todas sus propiedades
      // Si no, solo puede ver las activas
      if (arrendadorId !== arrendadorAutenticado) {
        query.estado = ESTADOS_PROPIEDAD.ACTIVA;
        query["disponibilidad.disponible"] = true;
      }

      // Obtener propiedades con paginación
      const [propiedades, total] = await Promise.all([
        PropiedadRentaDB.find(query)
          .sort({ fechaCreacion: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        PropiedadRentaDB.countDocuments(query)
      ]);

      const totalPaginas = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: {
          propiedades,
          paginacion: {
            paginaActual: page,
            totalPaginas,
            totalPropiedades: total,
            propiedadesPorPagina: limit,
            tieneSiguiente: page < totalPaginas,
            tieneAnterior: page > 1
          }
        }
      });

    } catch (error: any) {
      console.error("Error al obtener propiedades del arrendador:", error);

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }
}
