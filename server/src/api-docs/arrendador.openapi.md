# Arrendadores API - Documentación de Endpoints

## Descripción General

El módulo de Arrendadores gestiona la autenticación, perfiles y propiedades de los propietarios inmobiliarios. Incluye
endpoints públicos para registro/login y endpoints protegidos para gestión de perfiles y propiedades.

**Base Path:** `/api`

---

## Sección 1: Autenticación de Arrendadores

| **Método** | **Endpoint**             | **Descripción**                             | **Body Params**                                                                                                                                                                                                | **Query Params** | **Middleware / Restrictions** | **Respuestas**                                                                                                                                                           |
|------------|--------------------------|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **POST**   | `/arrendadores/registro` | Registrar un nuevo arrendador en el sistema | - `email`: string (email válido)<br>- `password`: string (8-32 caracteres, mayúscula, minúscula, número, carácter especial)<br>- `profile.fullName`: string (opcional)<br>- `profile.phone`: string (opcional) | - *(sin params)* | —                             | `201`: Registro exitoso con token JWT<br>`400`: Email ya registrado o datos inválidos<br>`500`: Error interno del servidor                                               |
| **POST**   | `/arrendadores/login`    | Iniciar sesión como arrendador              | - `email`: string (email válido)<br>- `password`: string (8-32 caracteres)                                                                                                                                     | - *(sin params)* | —                             | `200`: Login exitoso con token JWT<br>`401`: Credenciales inválidas o arrendador inactivo<br>`400`: Datos de validación incorrectos<br>`500`: Error interno del servidor |

---

## Sección 2: Gestión de Perfiles de Arrendadores (Protegido)

| **Método** | **Endpoint**                         | **Descripción**                                                  | **Body Params**                                                                                                                                                                                                                                                                                                                                            | **Query Params**                                                 | **Middleware / Restrictions**                                          | **Respuestas**                                                                                                                                                        |
|------------|--------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GET**    | `/arrendadores`                      | Obtener lista de todos los arrendadores activos (paginada)       | - *(sin params)*                                                                                                                                                                                                                                                                                                                                           | - `page`: number (default: 1)<br>- `limit`: number (default: 10) | Requiere token JWT de arrendador                                       | `200`: Lista de arrendadores<br>`401`: Token no válido<br>`500`: Error interno del servidor                                                                           |
| **GET**    | `/arrendadores/:id`                  | Obtener perfil completo de un arrendador específico              | - *(sin params)*                                                                                                                                                                                                                                                                                                                                           | - *(sin params)*                                                 | Requiere token JWT + Verificación de propiedad (solo su propio perfil) | `200`: Perfil del arrendador<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: Arrendador no encontrado<br>`500`: Error interno del servidor              |
| **PUT**    | `/arrendadores/:id`                  | Actualizar información general del arrendador                    | - `email`: string (opcional)<br>- `profile.fullName`: string (opcional)<br>- `profile.phone`: string (opcional)<br>- `profile.gender`: string (opcional)                                                                                                                                                                                                   | - *(sin params)*                                                 | Requiere token JWT + Verificación de propiedad                         | `200`: Arrendador actualizado<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno           |
| **PUT**    | `/arrendadores/:id/perfil`           | Actualizar perfil detallado (foto, documentos, datos personales) | - `profilePicture`: string (URL, opcional)<br>- `officialId.type`: string ("INE" \| "passport" \| "license")<br>- `officialId.fileUrl`: string (URL)<br>- `officialId.fileName`: string<br>- `dateOfBirth.day`: number<br>- `dateOfBirth.month`: number<br>- `dateOfBirth.year`: number<br>- `gender`: string<br>- `phone`: string<br>- `fullName`: string | - *(sin params)*                                                 | Requiere token JWT + Verificación de propiedad                         | `200`: Perfil actualizado<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno               |
| **PUT**    | `/arrendadores/:id/cambiar-password` | Cambiar contraseña del arrendador                                | - `currentPassword`: string<br>- `newPassword`: string (8-32 caracteres, mayúscula, minúscula, número, carácter especial)                                                                                                                                                                                                                                  | - *(sin params)*                                                 | Requiere token JWT + Verificación de propiedad                         | `200`: Contraseña cambiada<br>`400`: Contraseña actual incorrecta<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno |
| **DELETE** | `/arrendadores/:id`                  | Eliminar o desactivar cuenta del arrendador (soft delete)        | - *(sin params)*                                                                                                                                                                                                                                                                                                                                           | - *(sin params)*                                                 | Requiere token JWT + Verificación de propiedad                         | `200`: Arrendador eliminado<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno                                       |

---

## Sección 3: Gestión de Propiedades (Público + Protegido)

| **Método** | **Endpoint**                                              | **Descripción**                                              | **Body Params**                                                                                                                                                                                                                                                                                                                                                                                                                                                             | **Query Params**                                                                                                                                                                                                                                                                                                               | **Middleware / Restrictions**                                    | **Respuestas**                                                                                                                                                   |
|------------|-----------------------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GET**    | `/propiedades`                                            | Obtener todas las propiedades activas con filtros opcionales | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                            | - `page`: number (default: 1)<br>- `limit`: number (default: 10)<br>- `propertyType`: string ("Casa" \| "Departamento" \| "Loft")<br>- `rentalType`: string<br>- `genderPreference`: string<br>- `minPrice`: number (opcional)<br>- `maxPrice`: number (opcional)<br>- `includesServices`: boolean<br>- `isFurnished`: boolean | —                                                                | `200`: Lista de propiedades<br>`400`: Parámetros inválidos<br>`500`: Error interno                                                                               |
| **GET**    | `/propiedades/:propertyId`                                | Obtener información detallada de una propiedad específica    | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                            | - *(sin params)*                                                                                                                                                                                                                                                                                                               | —                                                                | `200`: Detalles de propiedad<br>`404`: No encontrada<br>`500`: Error interno                                                                                     |
| **POST**   | `/propiedades/:arrendadorId`                              | Crear nueva propiedad                                        | - `propertyType`: string<br>- `rentalType`: string<br>- `genderPreference`: string<br>- `monthlyPrice`: number<br>- `includesServices`: boolean<br>- `services`: array of strings (opcional)<br>- `isFurnished`: boolean<br>- `furniture`: array of strings (opcional)<br>- `address.street`: string<br>- `address.city`: string<br>- `address.state`: string<br>- `address.zipCode`: string<br>- `address.country`: string<br>- `images`: array<br>- `description`: string | - *(sin params)*                                                                                                                                                                                                                                                                                                               | Requiere token JWT + Verificación de propiedad (ser propietario) | `201`: Propiedad creada<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: Arrendador no encontrado<br>`500`: Error interno |
| **GET**    | `/propiedades/:arrendadorId/mis-propiedades`              | Obtener todas las propiedades del arrendador (paginada)      | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                            | - `page`: number (default: 1)<br>- `limit`: number (default: 10)                                                                                                                                                                                                                                                               | Requiere token JWT + Verificación de propiedad                   | `200`: Lista de propiedades<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno                                  |
| **PUT**    | `/propiedades/:arrendadorId/propiedad/:propertyId`        | Actualizar propiedad específica                              | - Todos los campos son opcionales (propertyType, rentalType, monthlyPrice, etc.)                                                                                                                                                                                                                                                                                                                                                                                            | - *(sin params)*                                                                                                                                                                                                                                                                                                               | Requiere token JWT + Verificación de propiedad (ser propietario) | `200`: Propiedad actualizada<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno       |
| **DELETE** | `/propiedades/:arrendadorId/propiedad/:propertyId`        | Eliminar propiedad (soft delete)                             | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                            | - *(sin params)*                                                                                                                                                                                                                                                                                                               | Requiere token JWT + Verificación de propiedad                   | `200`: Propiedad eliminada<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno                                   |
| **PATCH**  | `/propiedades/:arrendadorId/propiedad/:propertyId/estado` | Cambiar estado activo/inactivo de la propiedad               | - `isActive`: boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                       | - *(sin params)*                                                                                                                                                                                                                                                                                                               | Requiere token JWT + Verificación de propiedad                   | `200`: Estado actualizado<br>`400`: Body inválido<br>`401`: Token no válido<br>`403`: Acceso denegado<br>`404`: No encontrado<br>`500`: Error interno            |

---

## Ejemplos de Respuesta

### Registro Exitoso (201)

```json
{
  "success": true,
  "message": "Arrendador registrado exitosamente",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "arrendador@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTdiOGM5ZDFlMmYzYTRiNWM2ZDdlOCIsImVtYWlsIjoiYXJyZW5kYWRvckBlamVtcGxvLmNvbSIsImlhdCI6MTcwNDcwMzYwMH0.xxx"
  }
}
```

### Login Exitoso (200)

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "arrendador@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTdiOGM5ZDFlMmYzYTRiNWM2ZDdlOCIsImVtYWlsIjoiYXJyZW5kYWRvckBlamVtcGxvLmNvbSIsImlhdCI6MTcwNDcwMzYwMH0.xxx",
    "isEmailVerified": true
  }
}
```

### Propiedad Creada (201)

```json
{
  "success": true,
  "message": "Propiedad creada exitosamente",
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "propertyType": "Departamento",
    "rentalType": "Departamento completo",
    "genderPreference": "Mixto",
    "monthlyPrice": 8500,
    "includesServices": true,
    "services": [
      "Luz",
      "Agua",
      "Internet"
    ],
    "isFurnished": true,
    "furniture": [
      "Cama",
      "Escritorio"
    ],
    "address": {
      "street": "Av. Insurgentes Sur 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zipCode": "03100",
      "country": "México"
    },
    "images": [
      "https://ejemplo.com/img1.jpg",
      "https://ejemplo.com/img2.jpg"
    ],
    "description": "Hermoso departamento en zona céntrica",
    "isActive": true,
    "createdAt": "2024-01-08T12:00:00Z",
    "updatedAt": "2024-01-08T12:00:00Z"
  }
}
```

### Error de Validación (400)

```json
{
  "success": false,
  "message": "Datos de validación incorrectos",
  "errors": [
    {
      "path": [
        "email"
      ],
      "message": "Email inválido"
    }
  ]
}
```

### Error de Autorización (403)

```json
{
  "success": false,
  "message": "Acceso denegado (no tienes permisos)"
}
```

---

## Notas Importantes

- **Autenticación:** Todos los endpoints protegidos requieren header `Authorization: Bearer {JWT_TOKEN}`
- **Ownership Check:** El middleware `checkOwnership` verifica que el usuario autenticado sea el propietario
- **Hashing:** Las contraseñas se hashean con bcrypt antes de guardarse
- **Soft Delete:** Las eliminaciones marcan como inactivo, no eliminan definitivamente
- **IDs:** Los IDs de MongoDB se devuelven como strings en respuestas
- **Paginación:** Los endpoints GET de listas soportan `page` y `limit`

