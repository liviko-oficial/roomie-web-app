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

    static async crearOferta(req: Request, res: Response) {
      try{
        const {PetitionId} = req.params;
        const {propertyId, montoOferta, motivo} = req.body;

        const petition = await PeticionDB.findById(PetitionId);
        const studentId = petition.contexto.usuarioId;

        if(!petition){
          return res.status(400).json({message: "Solicitud no encontrada"})
        }

        if(petition.contexto.estatus !== "En proceso"){
          return res.status(400).json({
            message: `La solicitud ya tiene el estatus: ${petition.contexto.estatus}`
          });
        }

        if(!petition.oferta){
          const nuevaOferta = new PeticionDB({
            montoOfrecidoMXN:Number(montoOferta),
            numeroOfertas: 1,
            historialOfertas:[],
            motivo: motivo,
          });

          await nuevaOferta.save();

          await PeticionDB.findByIdAndUpdate(PetitionId,{
            $push: {oferta: nuevaOferta},
          });

          return res.status(200).json({
            message: "Oferta creada.",
            data:{
              studentId,
              propertyId,
              motivo
            }
          });
        } else if (petition.oferta && Number(petition.oferta.numeroOfertas) <= 4){
          await PeticionDB.findByIdAndUpdate(PetitionId, {
            "oferta.montoOfrecidoMXN": Number(montoOferta),
            "oferta.numeroOfertas": Number(petition.oferta.numeroOfertas) + 1,
            $addToSet:{
              "oferta.historialOfertas": Number(montoOferta),
              "oferta.motivo": motivo, 
              }
            });

            return res.status(200).json({
              message: "Contraoferta enviada.",
              data:{
                studentId,
                propertyId,
                motivo
              }
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "Cantidad de ofertas maxima alcanzada."
            });
        }
        } catch(error){
        console.error("Error al crear oferta:", error);

        return res.status(500).json({
          message: "Error interno de servidor",
          error: error.message
        });
      }
    }
    
    static async aceptarOferta(req: Request, res: Response) {
      try{
        const {PetitionId} = req.params;
        const {landlordId} = req.body;

        const petition = await PeticionDB.findById(PetitionId);

        if(!petition){
          return res.status(400).json({message: "Solicitud no encontrada"})
        }

        if(petition.contexto.estatus !== "En proceso"){
          return res.status(400).json({
            message: `La solicitud ya tiene el estatus: ${petition.contexto.estatus}`
          });
        }

        if(!petition.oferta){
          return res.status(400).json({message: "Oferta no encontrada"})
        }

        const studentId = petition.contexto.usuarioId;
        const propertyId = petition.contexto.propertyId;

        const property = await PropiedadRentaDB.findById(propertyId);
        if(!property || property.propietarioId.toString() !== landlordId){
          return res.status(403).json({
            message: "No tienes permiso para aceptar ofertas de esta propiedad"
          });
        }

        await Promise.all([
          PeticionDB.findByIdAndUpdate(PetitionId,{
            "oferta.estatusOferta": "Aceptada",
            updatedAt: new Date()
          })
        ])

        return res.status(200).json({
          message: "Oferta/contraoferta aceptada.",
          data:{
            studentId,
            propertyId,
            estatus: "Aceptada"
          }
        });
      } catch (error){
        console.error("Error al aceptar la oferta:", error);
        return res.status(500).json({
          message: "Error interno del servidor al aceptar la oferta"
        });
      }
    }


    static async rechazarOferta(req: Request, res: Response) {
      try{

        const { PetitionId } = req.params;
        const { landlordId, motivo } = req.body;

        const petition = await PeticionDB.findById(PetitionId);

        if(!petition){
          return res.status(400).json({ message: "Solicitud no encontrada" });
        }

        if(!petition.oferta){
          return res.status(400).json({message: "Oferta no encontrada."})
        }

        if (petition.contexto.estatus !== "En proceso"){
          return res.status(400).json({
            message: `La solicitud ya tiene el estatus: ${petition.contexto.estatus}`
          });
        }

        const property = await PropiedadRentaDB.findById(petition.propertyId);
        if (!property || property.propietarioId.toString() !== landlordId){
          return res.status(403).json({
            message: "No tienes permiso para rechazar ofertas de esta propiedad"
          });
        }

        await PeticionDB.findByIdAndUpdate(PetitionId, {
          "oferta.estatusOferta": "Rechazada",
          "contexto.motivo": motivo,
          updatedAt: new Date()
        });

        return res.status(200).json({
          message: "Oferta rechazada.",
          data:{
            PetitionId,
            status: "Rechazada",
            motivo: motivo
          }
        });

      } catch (error){
        console.error("Error al rechazar la oferta:", error);
        return res.status(500).json({
          message: "Error interno del servidor al rechazar la oferta"
        })
      }
    }
}
