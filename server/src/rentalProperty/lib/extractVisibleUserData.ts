import { UserDB } from "@/user/models/userMissing.schema.ts";
import { PeticionUsuarioVisible } from "../models";


/**
 * Extrae solo los datos permitidos de un usuario para mostrar al arrendador
 *
 * CRÍTICO PARA PRIVACIDAD: Esta función garantiza que solo datos sanitizados
 * se envíen al arrendador. TODO (PRODUCCIÓN): Auditar y logs regularmente para asegurar
 * que no se filtran datos sensibles.
 *
 * Datos que SE ENVÍAN al arrendador:
 * - Nombres
 * - Apellido paterno
 * - Foto de perfil (solo si está aprobada)
 * - Edad
 * - Género
 * - Nacionalidad
 * - Estado de origen
 * - Hobbies (hasta 5)
 * - No-negociables (3-5)
 * - Preferencia de roomies
 * - Mascota (sí/no y tipo)
 * - Nivel educativo
 * - Área/programa (4 letras mayúsculas)
 * - Semestre o año de graduación
 * - Contacto de emergencia (nombre y teléfono)
 *
 * Datos que NO se envían (PRIVACIDAD - CRÍTICO):
 * - Apellido materno
 * - Matrícula
 * - Teléfono personal
 * - Correo institucional
 * - Documentos personales
 * - Dirección particular
 * - Email
 * - Contraseña
 *
 * TODO (PRODUCCIÓN): Considerar implementar:
 * - Whitelist enforcement (validar cada campo)
 * - Auditoría de acceso a esta función
 * - Versionado de campos permitidos
 * - Validación de fotoPerfilUrl (asegurar aprobada)
 * - Rate limiting en esta operación (para evitar scrapin
 * - Semestre o año de graduación
 * - Contacto de emergencia (nombre y teléfono)
 *
 * Datos que NO se envían:
 * - Apellido materno
 * - Matrícula
 * - Teléfono personal
 * - Correo institucional
 * - Documentos personales
 * - Dirección particular
 */
export async function extractVisibleUserData(userId: string): Promise<PeticionUsuarioVisible> {
    try {
        const user = await UserDB.findById(userId).lean();

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const userPreferences = (user as any).preferences || {};

        const nombres = userPreferences.nombres || "";
        const apellidoPaterno = userPreferences.apellidoPaterno || "";

        if (!nombres || !apellidoPaterno) {
            throw new Error("Usuario debe tener nombre y apellido paterno completados");
        }

        const usuarioVisible: PeticionUsuarioVisible = {
            nombres,
            apellidoPaterno,
            // Datos opcionales que pueden no existir
            // TODO:
            ...(userPreferences.fotoPerfilUrl && {fotoPerfilUrl: userPreferences.fotoPerfilUrl}),
            ...(userPreferences.edad && {edad: userPreferences.edad}),
            ...(userPreferences.genero && {genero: userPreferences.genero}),
            ...(userPreferences.nacionalidad && {nacionalidad: userPreferences.nacionalidad}),
            ...(userPreferences.estadoOrigen && {estadoOrigen: userPreferences.estadoOrigen}),
            ...(userPreferences.hobbies && Array.isArray(userPreferences.hobbies) && {hobbies: userPreferences.hobbies.slice(0, 5)}),
            ...(userPreferences.noNegociables && Array.isArray(userPreferences.noNegociables) && {noNegociables: userPreferences.noNegociables.slice(0, 5)}),
            ...(userPreferences.preferenciaRoomies && {preferenciaRoomies: userPreferences.preferenciaRoomies}),
            ...(typeof userPreferences.tieneMascota === "boolean" && {tieneMascota: userPreferences.tieneMascota}),
            ...(userPreferences.tipoMascota && {tipoMascota: userPreferences.tipoMascota}),
            ...(userPreferences.nivelEducativo && {nivelEducativo: userPreferences.nivelEducativo}),
            ...(userPreferences.areaPrograma && {areaPrograma: userPreferences.areaPrograma}),
            ...(userPreferences.semestreOGraduacion && {semestreOGraduacion: userPreferences.semestreOGraduacion}),
            ...(userPreferences.contactoEmergencia && {
                contactoEmergencia: {
                    nombre: userPreferences.contactoEmergencia.nombre || "",
                    telefono: userPreferences.contactoEmergencia.telefono || ""
                }
            })
        };

        return usuarioVisible;
    } catch (error: any) {
        throw new Error(`Error al extraer datos visibles del usuario: ${error.message}`);
    }
}

