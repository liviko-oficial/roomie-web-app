import {Request, Response} from "express";
import {PropiedadRentaDB} from "../models/rentalProperty.schema.ts";
import {ArrendadorDB} from "../../arrendador/models/arrendador.schema.ts";
import {PeticionDB} from "../models/peticion.schema.ts";

export class PetitionController {

    /**
     * PUT /api/propiedades/peticiones/:petitionId/aceptar
     * Finalize rental agreement by accepting a student request
     * - Validates that the petition exists and is currently "En proceso"
     * - Verifies that the requesting landlord owns the property
     * - Performs a multi-document update (Petition, Property, and Landlord)
     * - Moves Student ID to 'inquilinosActuales' and 'historialInquilinos'
     */
    static async aceptarSolicitud(req: Request, res: Response) {
        
        try{
            // Get petition ID and landlord ID from request parameters
            const { petitionId } = req.params;
            const { landlordId } = req.body;

            // Find the petition by ID and verify its existence
            const petition = await PeticionDB.findById(petitionId);

            if (!petition) {
                return res.status(404).json({ message: "Solicitud no encontrada." });
            }   

            // Verify that the petition is in 'En proceso' status
            if (petition.contexto.estatus !== "En proceso") {
                return res.status(400).json({ 
                    message: `La solicitud ya tiene el estatus: ${petition.contexto.estatus}` 
                });
            }

            // Extract student ID and property ID from the petition context
            const studentId = petition.contexto.usuarioId;
            const propertyId = petition.contexto.propertyId;

            // Verify the existence of the landlord and the ownership of the property
            const property = await PropiedadRentaDB.findById(propertyId);
            if (!property || property.propietarioId.toString() !== landlordId) {
                return res.status(403).json({ 
                    message: "No tienes permiso para aceptar solicitudes de esta propiedad."
                });
            }

            // Update status and relationships
            await Promise.all([
                // Update petition status to 'Aceptada'
                PeticionDB.findByIdAndUpdate(petitionId, {
                    "contexto.estatus": "Aceptada",
                    updatedAt: new Date()
                }),

                // Add Student to Property's current and historic tenants
                PropiedadRentaDB.findByIdAndUpdate(propertyId, {
                    $addToSet: { 
                        inquilinosActuales: studentId,
                        historialInquilinos: studentId
                     }
                }),

                // Add Student to Landlord's tenants list
                ArrendadorDB.findByIdAndUpdate(landlordId, {
                    $addToSet: { tenants: studentId }
                })
            ])

            // Return success response
            return res.status(200).json({
                message: "Solicitud aceptada.",
                data: {
                    studentId,
                    propertyId,
                    status: "Aceptada"
                }
            });
            } catch (error) {
                console.error("Error al aceptar la solicitud:", error);
                return res.status(500).json({ 
                    message: "Error interno del servidor al aceptar la solicitud." 
                });
        }
    }

    /**
     * PUT /api/propiedades/peticiones/:petitionId/rechazar
     * Reject a rental petition
     * - Validates that the petition exists and is currently "En proceso"
     * - Verifies that the requesting landlord owns the property
     * - Updates petition status to "Rechazada" with reason
     */
    static async rechazarSolicitud(req: Request, res: Response) {
        try {
            // Get petition ID, landlord ID and reason from request parameters
            const { petitionId } = req.params;
            const { landlordId, motivo } = req.body;

            // Find the petition by ID and verify its existence
            const petition = await PeticionDB.findById(petitionId);
            
            if (!petition) {
                return res.status(404).json({ message: "Solicitud no encontrada." });
            }

            // Verify that the petition is in 'En proceso' status
            if (petition.contexto.estatus !== "En proceso") {
                return res.status(400).json({
                    success: false, 
                    message: `La solicitud ya tiene el estatus: ${petition.contexto.estatus}` 
                });
            }

            // Verify the existence of the landlord and the ownership of the property
            const property = await PropiedadRentaDB.findById(petition.propertyId);
            if (!property || property.propietarioId.toString() !== landlordId) {
                return res.status(403).json({ 
                    message: "No tienes permiso para rechazar solicitudes de esta propiedad."
                });
            }

            // Update petition status to 'Rechazada' with reason
            await PeticionDB.findByIdAndUpdate(petitionId, {
                "contexto.estatus": "Rechazada",
                "contexto.motivo": motivo,
                updatedAt: new Date()
            });

            // Return success response
            return res.status(200).json({
                message: "Solicitud rechazada.",
                data: {
                    petitionId,
                    status: "Rechazada",
                    motivo: motivo
                }
            });

        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            return res.status(500).json({ 
                success: false,
                message: "Error interno del servidor al rechazar la solicitud." 
            });
        }
    }

    /**
     * PUT /api/propiedades/peticiones/:petitionId/contraoferta
     * Student sends a counter-offer after rejection (max 2 total offers)
     */
    static async contraoferta(req: Request, res: Response) {
        try {
            const { petitionId } = req.params;
            const { montoOfrecidoMXN } = req.body;

            if (!montoOfrecidoMXN || typeof montoOfrecidoMXN !== "number" || montoOfrecidoMXN <= 0) {
                return res.status(400).json({ success: false, message: "Monto inválido" });
            }

            const petition = await PeticionDB.findById(petitionId);
            if (!petition) {
                return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
            }

            if (petition.contexto.estatus !== "Rechazada") {
                return res.status(400).json({
                    success: false,
                    message: "Solo puedes hacer contraoferta cuando la solicitud fue rechazada"
                });
            }

            const currentOffers = petition.oferta?.numeroOfertas || 0;
            if (currentOffers >= 2) {
                return res.status(400).json({
                    success: false,
                    message: "Ya alcanzaste el máximo de 2 ofertas"
                });
            }

            const historial = petition.oferta?.historialOfertas || [];
            historial.push(montoOfrecidoMXN);

            await PeticionDB.findByIdAndUpdate(petitionId, {
                "contexto.estatus": "En proceso",
                "contexto.motivo": null,
                "oferta.montoOfrecidoMXN": montoOfrecidoMXN,
                "oferta.numeroOfertas": currentOffers + 1,
                "oferta.historialOfertas": historial,
                updatedAt: new Date()
            });

            return res.status(200).json({
                success: true,
                message: "Contraoferta enviada",
                data: { petitionId, montoOfrecidoMXN, numeroOfertas: currentOffers + 1 }
            });
        } catch (error) {
            console.error("Error al enviar contraoferta:", error);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    /**
     * GET /api/propiedades/peticiones/usuario/:userId
     * List all petitions for a student, with property + landlord data populated
     */
    static async listByStudent(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

            const peticiones = await PeticionDB.find({ "contexto.usuarioId": userId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            const total = await PeticionDB.countDocuments({ "contexto.usuarioId": userId });

            // Populate property + landlord data for each petition
            const populated = await Promise.all(
                peticiones.map(async (pet: any) => {
                    const property = await PropiedadRentaDB.findById(pet.propertyId)
                        .select("titulo tipoPropiedad ubicacion informacionFinanciera imagenes propietarioId")
                        .lean() as any;

                    let landlord = null;
                    if (property?.propietarioId) {
                        landlord = await ArrendadorDB.findById(property.propietarioId)
                            .select("email profile.fullName profile.phone profile.profilePicture")
                            .lean() as any;
                    }

                    return {
                        ...pet,
                        propertyData: property ? {
                            titulo: property.titulo,
                            tipoPropiedad: property.tipoPropiedad,
                            direccion: property.ubicacion?.direccion || property.ubicacion?.calle || "",
                            campus: property.ubicacion?.campus,
                            precioMensual: property.informacionFinanciera?.precioMensual,
                            imagen: property.imagenes?.fachada?.[0] || property.imagenes?.interior?.[0] || "",
                        } : null,
                        landlordData: landlord ? {
                            nombre: landlord.profile?.fullName || landlord.email,
                            email: landlord.email,
                            telefono: landlord.profile?.phone,
                            foto: landlord.profile?.profilePicture,
                        } : null,
                    };
                })
            );

            return res.status(200).json({
                success: true,
                data: populated,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
            });
        } catch (error: any) {
            console.error("Error al listar peticiones del estudiante:", error);
            return res.status(500).json({ success: false, message: "Error al listar peticiones" });
        }
    }
}