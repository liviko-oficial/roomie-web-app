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

    static async enviarOferta(req: Request, res: Response) {
        /*
         * Función para que, como arrendador o Estudiante, pueda enviar una oferta o contraoferta
         * Pd: Sólo pueden realizar un mázimo de 2 contraofertas por ID
         * */
    }

    static async aceptarOferta(req: Request, res: Response) {
        /*
         *Función para que, como arrendador o estudiante, pueda aceptar una oferta o
         contraoferta
        */
    }

    static async rechazarOferta(req: Request, res: Response) {
        /*
         * Función para que, como arrendador o estudiante, pueda rechazar una oferta o 
         * contraoferta*/
    }
}