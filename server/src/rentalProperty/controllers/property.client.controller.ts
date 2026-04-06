import { Request, Response } from "express";
import { PropiedadRentaDB, PropiedadRenta } from "../models/rentalProperty.schema";
import { MENSAJES_ERROR, LIMITES, ESTADOS_PROPIEDAD } from "../lib/constants";
import { PeticionDB, PeticionUsuarioVisible, PeticionOferta } from "../models";
import { extractVisibleUserData } from "../lib/extractVisibleUserData";
import { Types } from "mongoose";

/**
 * Controlador de búsqueda de propiedades para clientes/estudiantes
 * Endpoints públicos para buscar y explorar propiedades
 */
export class PropertyClientController {
  /**
   * GET /api/propiedades-renta/catalogo
   * Catálogo principal para homepage
   * - Muestra propiedades con orden inteligente
   * - Si el usuario está autenticado, prioriza su campus
   * - Si no está autenticado, muestra todas ordenadas por popularidad
   */
  static async getCatalogo(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      // Detectar campus del usuario si está autenticado
      const userCampus = (req as any).user?.preferences?.campus;
      const isAuthenticated = !!(req as any).user;

      // Query base: solo propiedades activas y disponibles
      const baseQuery: any = {
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        "disponibilidad.disponible": true
      };

      let propiedades;
      let sortOrder: any = {};

      if (userCampus) {
        // Usuario autenticado con campus definido: priorizar su campus
        const userCampusNormalized = userCampus.charAt(0).toUpperCase() + userCampus.slice(1).toLowerCase();

        // Primero propiedades del campus del usuario
        const propiedadesCampusUsuario = await PropiedadRentaDB.find({
          ...baseQuery,
          "ubicacion.campus": userCampusNormalized
        })
          .sort({ calificacion: -1, vistas: -1, fechaPublicacion: -1 })
          .limit(limit)
          .select("-historialInquilinos -aplicaciones")
          .populate("propietarioId", "email profile.fullName profile.phone")
          .lean();

        // Si no hay suficientes del campus del usuario, rellenar con otros
        if (propiedadesCampusUsuario.length < limit) {
          const remaining = limit - propiedadesCampusUsuario.length;
          const propiedadesOtrasCampus = await PropiedadRentaDB.find({
            ...baseQuery,
            "ubicacion.campus": { $ne: userCampusNormalized }
          })
            .sort({ calificacion: -1, vistas: -1, fechaPublicacion: -1 })
            .limit(remaining)
            .select("-historialInquilinos -aplicaciones")
            .populate("propietarioId", "email profile.fullName profile.phone")
            .lean();

          propiedades = [...propiedadesCampusUsuario, ...propiedadesOtrasCampus];
        } else {
          propiedades = propiedadesCampusUsuario;
        }
      } else {
        // Usuario no autenticado: mostrar todas ordenadas por popularidad
        propiedades = await PropiedadRentaDB.find(baseQuery)
          .sort({ destacada: -1, calificacion: -1, vistas: -1, fechaPublicacion: -1 })
          .skip(skip)
          .limit(limit)
          .select("-historialInquilinos -aplicaciones")
          .populate("propietarioId", "email profile.fullName profile.phone")
          .lean();
      }

      // Contar total de propiedades
      const total = await PropiedadRentaDB.countDocuments(baseQuery);
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: {
          propiedades,
          userCampus: userCampus || null,
          sugerenciasPersonalizadas: isAuthenticated && !!userCampus,
          paginacion: {
            paginaActual: page,
            totalPaginas: totalPages,
            totalPropiedades: total,
            propiedadesPorPagina: limit,
            tieneSiguiente: page < totalPages,
            tieneAnterior: page > 1
          }
        }
      });

    } catch (error: any) {
      console.error("Error al obtener catálogo:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener el catálogo de propiedades",
        error: error.message
      });
    }
  }

  /**
   * GET /api/propiedades-renta/buscar
   * Búsqueda avanzada con múltiples filtros
   */
  static async searchProperties(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      // Construir query de búsqueda
      const query: any = {
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        "disponibilidad.disponible": true
      };

      // Filtros básicos
      if (req.query.campus) {
        query["ubicacion.campus"] = req.query.campus;
      }

      if (req.query.tipoPropiedad) {
        query.tipoPropiedad = req.query.tipoPropiedad;
      }

      if (req.query.tipoRenta) {
        query.tipoRenta = req.query.tipoRenta;
      }

      if (req.query.generoPreferido) {
        query.generoPreferido = req.query.generoPreferido;
      }

      // Filtros de precio
      if (req.query.precioMinimo || req.query.precioMaximo) {
        query["informacionFinanciera.precioMensual"] = {};
        if (req.query.precioMinimo) {
          query["informacionFinanciera.precioMensual"].$gte = parseFloat(req.query.precioMinimo as string);
        }
        if (req.query.precioMaximo) {
          query["informacionFinanciera.precioMensual"].$lte = parseFloat(req.query.precioMaximo as string);
        }
      }

      // Filtros de características
      if (req.query.amueblado !== undefined) {
        query["caracteristicas.amueblado"] = req.query.amueblado === "true";
      }

      if (req.query.mascotasPermitidas !== undefined) {
        query["caracteristicas.mascotasPermitidas"] = req.query.mascotasPermitidas === "true";
      }

      if (req.query.serviciosIncluidos !== undefined) {
        query["servicios.serviciosIncluidos"] = req.query.serviciosIncluidos === "true";
      }

      // Filtros de habitaciones (mínimo)
      if (req.query.numeroBanos) {
        query["caracteristicas.numeroBanos"] = { $gte: parseInt(req.query.numeroBanos as string) };
      }

      if (req.query.numeroRecamaras) {
        query["caracteristicas.numeroRecamaras"] = { $gte: parseInt(req.query.numeroRecamaras as string) };
      }

      // Filtro de distancia
      if (req.query.distanciaMaxima) {
        query["ubicacion.distanciaCampus"] = { $lte: parseFloat(req.query.distanciaMaxima as string) };
      }

      // Ordenamiento
      let sortOrder: any = {};
      const ordenarPor = req.query.ordenarPor as string;

      switch (ordenarPor) {
        case "precio_asc":
          sortOrder = { "informacionFinanciera.precioMensual": 1 };
          break;
        case "precio_desc":
          sortOrder = { "informacionFinanciera.precioMensual": -1 };
          break;
        case "distancia":
          sortOrder = { "ubicacion.distanciaCampus": 1 };
          break;
        case "calificacion":
          sortOrder = { calificacion: -1, numeroReviews: -1 };
          break;
        case "fecha_desc":
          sortOrder = { fechaPublicacion: -1 };
          break;
        default:
          sortOrder = { destacada: -1, calificacion: -1, fechaPublicacion: -1 };
      }

      // Ejecutar búsqueda
      const propiedades = await PropiedadRentaDB.find(query)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .select("-historialInquilinos -aplicaciones")
        .populate("propietarioId", "email profile.fullName profile.phone")
        .lean();

      const total = await PropiedadRentaDB.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: {
          propiedades,
          filtrosAplicados: {
            campus: req.query.campus,
            tipoPropiedad: req.query.tipoPropiedad,
            tipoRenta: req.query.tipoRenta,
            precioMinimo: req.query.precioMinimo,
            precioMaximo: req.query.precioMaximo,
            amueblado: req.query.amueblado,
            mascotasPermitidas: req.query.mascotasPermitidas,
            serviciosIncluidos: req.query.serviciosIncluidos,
            ordenarPor: ordenarPor
          },
          totalResultados: total,
          paginacion: {
            paginaActual: page,
            totalPaginas: totalPages,
            totalPropiedades: total,
            propiedadesPorPagina: limit,
            tieneSiguiente: page < totalPages,
            tieneAnterior: page > 1
          }
        }
      });

    } catch (error: any) {
      console.error("Error en búsqueda de propiedades:", error);
      return res.status(500).json({
        success: false,
        message: "Error al buscar propiedades",
        error: error.message
      });
    }
  }

  /**
   * GET /api/propiedades-renta/campus/:campus
   * Filtrar propiedades por campus (uso común)
   */
  static async getPropertiesByCampus(req: Request, res: Response) {
    try {
      const { campus } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;

      // Validar campus
      const campusValidos = ["Guadalajara", "Monterrey", "Ciudad de México", "Otro"];
      if (!campusValidos.includes(campus)) {
        return res.status(400).json({
          success: false,
          message: `Campus inválido. Debe ser uno de: ${campusValidos.join(", ")}`
        });
      }

      const query = {
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        "disponibilidad.disponible": true,
        "ubicacion.campus": campus
      };

      // Ordenamiento
      let sortOrder: any = {};
      const ordenarPor = req.query.ordenarPor as string;

      switch (ordenarPor) {
        case "precio_asc":
          sortOrder = { "informacionFinanciera.precioMensual": 1 };
          break;
        case "precio_desc":
          sortOrder = { "informacionFinanciera.precioMensual": -1 };
          break;
        case "distancia":
          sortOrder = { "ubicacion.distanciaCampus": 1 };
          break;
        case "calificacion":
          sortOrder = { calificacion: -1, numeroReviews: -1 };
          break;
        default:
          sortOrder = { destacada: -1, calificacion: -1, "ubicacion.distanciaCampus": 1 };
      }

      const propiedades = await PropiedadRentaDB.find(query)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .select("-historialInquilinos -aplicaciones")
        .populate("propietarioId", "email profile.fullName profile.phone")
        .lean();

      const total = await PropiedadRentaDB.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        data: {
          campus,
          propiedades,
          total,
          paginacion: {
            paginaActual: page,
            totalPaginas: totalPages,
            totalPropiedades: total,
            propiedadesPorPagina: limit,
            tieneSiguiente: page < totalPages,
            tieneAnterior: page > 1
          }
        }
      });

    } catch (error: any) {
      console.error("Error al obtener propiedades por campus:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener propiedades por campus",
        error: error.message
      });
    }
  }

  /**
   * GET /api/propiedades-renta/:propertyId/similares
   * Obtener propiedades similares en el mismo campus
   */
  static async getSimilarProperties(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

      // Buscar la propiedad original
      const propiedadOriginal = await PropiedadRentaDB.findById(propertyId).lean<PropiedadRenta>();

      if (!propiedadOriginal) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      // Calcular rango de precio (±20%)
      const precioOriginal = (propiedadOriginal as any).informacionFinanciera?.precioMensual || 0;
      const precioMin = precioOriginal * 0.8;
      const precioMax = precioOriginal * 1.2;

      // Query para propiedades similares
      const query: any = {
        _id: { $ne: propertyId }, // Excluir la original
        estado: ESTADOS_PROPIEDAD.ACTIVA,
        "disponibilidad.disponible": true,
        "ubicacion.campus": (propiedadOriginal as any).ubicacion?.campus, // Mismo campus (REQUERIDO)
        "informacionFinanciera.precioMensual": {
          $gte: precioMin,
          $lte: precioMax
        }
      };

      // Buscar candidatos
      const candidatos = await PropiedadRentaDB.find(query)
        .select("-historialInquilinos -aplicaciones")
        .populate("propietarioId", "email profile.fullName profile.phone")
        .lean() as any[];

      // Calcular score de similitud para cada candidato
      const propiedadesConScore = candidatos.map((candidato: any) => {
        let score = 0;
        const razones: string[] = [];
        const propOriginal = propiedadOriginal as any;

        // Precio similar (40 puntos)
        const precioCandidato = candidato.informacionFinanciera?.precioMensual || 0;
        const priceDiff = Math.abs(precioOriginal - precioCandidato);
        const pricePercent = priceDiff / precioOriginal;
        if (pricePercent <= 0.20) {
          const priceScore = 40 * (1 - pricePercent / 0.20);
          score += priceScore;
          if (pricePercent <= 0.10) {
            razones.push("Precio muy similar");
          } else {
            razones.push("Precio similar");
          }
        }

        // Mismo tipo de propiedad (30 puntos)
        if (candidato.tipoPropiedad === propOriginal.tipoPropiedad) {
          score += 20;
          razones.push(`Mismo tipo (${candidato.tipoPropiedad})`);
        }

        // Mismo tipo de renta (10 puntos)
        if (candidato.tipoRenta === propOriginal.tipoRenta) {
          score += 10;
          razones.push(`Mismo tipo de renta`);
        }

        // Baños similares (10 puntos)
        const banosOriginal = propOriginal.caracteristicas?.numeroBanos || 0;
        const banosCandidato = candidato.caracteristicas?.numeroBanos || 0;
        const bathDiff = Math.abs(banosOriginal - banosCandidato);
        if (bathDiff === 0) {
          score += 10;
          razones.push("Mismo número de baños");
        } else if (bathDiff === 1) {
          score += 5;
        }

        // Recámaras similares (10 puntos)
        const recamarasOriginal = propOriginal.caracteristicas?.numeroRecamaras || 0;
        const recamarasCandidato = candidato.caracteristicas?.numeroRecamaras || 0;
        const bedDiff = Math.abs(recamarasOriginal - recamarasCandidato);
        if (bedDiff === 0) {
          score += 10;
          razones.push("Mismo número de recámaras");
        } else if (bedDiff === 1) {
          score += 5;
        }

        // Amueblado igual (5 puntos bonus)
        if (candidato.caracteristicas?.amueblado === propOriginal.caracteristicas?.amueblado) {
          score += 5;
        }

        // Servicios incluidos igual (5 puntos bonus)
        if (candidato.servicios?.serviciosIncluidos === propOriginal.servicios?.serviciosIncluidos) {
          score += 5;
        }

        return {
          ...candidato,
          scoreSimitud: Math.round(score * 10) / 10, // Redondear a 1 decimal
          razonSimilitud: razones.join(", ")
        };
      });

      // Ordenar por score y tomar top N
      const similares = propiedadesConScore
        .sort((a, b) => b.scoreSimitud - a.scoreSimitud)
        .slice(0, limit);

      const propOriginal = propiedadOriginal as any;
      return res.status(200).json({
        success: true,
        data: {
          propiedadOriginal: {
            _id: propOriginal._id,
            titulo: propOriginal.titulo,
            campus: propOriginal.ubicacion?.campus,
            precio: propOriginal.informacionFinanciera?.precioMensual
          },
          similares,
          total: similares.length
        }
      });

    } catch (error: any) {
      console.error("Error al obtener propiedades similares:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener propiedades similares",
        error: error.message
      });
    }
  }

  /**
   * POST /api/propiedades-renta/:propertyId/solicitar
   * Crear una petición de renta para una propiedad
   * - Requiere autenticación de usuario
   * - El userId se toma desde la sesión autenticada
   * - Evita solicitudes duplicadas a la misma propiedad
   * - Solo permite aplicar a propiedades activas y disponibles
   *
   * Request body:
   * - oferta?: Información de la oferta económica (opcional)
   *
   
   * Ahorita req.user no está tipado en este controller, por eso se está usando:

    const userId = (req as any).user?._id;

    Para salir rápido, está bien.

    esto es temporal
    luego podría tipar RequestWithUser
   * 
   */
// ...existing code...

  static async createPeticion(req: Request, res: Response) {
    try {
      // 1. Obtener el ID de la propiedad desde la URL
      const { propertyId } = req.params;

      // 2. Del body solo tomamos la oferta
      const { oferta } = req.body as {
        oferta?: PeticionOferta;
      };

      // 3. Tomar el usuario autenticado desde req.user
      // Temporalmente usamos req as any porque este controller aún no tipa RequestWithUser
      const userId = (req as any).user?._id;

      // 4. Si no hay usuario autenticado, bloquear la operación
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Autenticación requerida"
        });
      }

      // 5. Validar formato de IDs antes de usarlos
      if (!Types.ObjectId.isValid(String(userId)) || !Types.ObjectId.isValid(propertyId)) {
        return res.status(400).json({
          success: false,
          message: "ID inválido"
        });
      }

      // 6. Convertir una sola vez a ObjectId y reutilizar
      const userObjectId = new Types.ObjectId(String(userId));
      const propertyObjectId = new Types.ObjectId(propertyId);

      // 7. Buscar la propiedad
      const propiedad = await PropiedadRentaDB.findById(propertyObjectId);

      if (!propiedad) {
        return res.status(404).json({
          success: false,
          message: MENSAJES_ERROR.PROPIEDAD_NO_ENCONTRADA
        });
      }

      // 8. Convertir temporalmente a any para evitar problemas de tipado
      const propiedadData = propiedad as any;

      // 9. Validar que la propiedad esté activa
      if (propiedadData.estado !== ESTADOS_PROPIEDAD.ACTIVA) {
        return res.status(400).json({
          success: false,
          message: "La propiedad no está activa"
        });
      }

      // 10. Validar que la propiedad siga disponible
      if (!propiedadData.disponibilidad?.disponible) {
        return res.status(400).json({
          success: false,
          message: "La propiedad no está disponible"
        });
      }

      // 11. Evitar solicitudes duplicadas del mismo usuario a la misma propiedad
      const peticionExistente = await PeticionDB.findOne({
        userId: userObjectId,
        propertyId: propertyObjectId
      });

      if (peticionExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya aplicaste a esta propiedad"
        });
      }

      // 12. Extraer la versión visible del perfil del usuario
      let usuarioVisible: PeticionUsuarioVisible;
      try {
        usuarioVisible = await extractVisibleUserData(String(userId));
      } catch (error: any) {
        return res.status(404).json({
          success: false,
          message: error.message || "Error al extraer datos del usuario"
        });
      }

      // 13. Crear la petición usando ObjectId reales
      const peticion = await PeticionDB.create({
        userId: userObjectId,
        propertyId: propertyObjectId,
        usuarioVisible,
        contexto: {
          fechaSolicitud: new Date(),
          estatus: "En proceso"
        },
        oferta
      });

      // 14. Responder con la petición creada
      return res.status(201).json({
        success: true,
        data: peticion
      });
    } catch (error: any) {
      console.error("Error al crear petición:", error);

      return res.status(500).json({
        success: false,
        message: "Error al crear la petición",
        error: error.message
      });
    }
  }
} 