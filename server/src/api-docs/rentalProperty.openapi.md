# Propiedades de Renta API - Documentación de Endpoints

## Descripción General

El módulo de Propiedades de Renta gestiona el catálogo público de propiedades disponibles, búsqueda avanzada para
clientes, y CRUD completo para arrendadores. Incluye búsqueda pública, filtros avanzados, favoritos, recomendaciones y
funcionalidades de cliente.

**Base Path:** `/api/propiedades-renta`

---

## Sección 1: Búsqueda Pública (Sin Autenticación)

Estas rutas son públicas y permiten a cualquier usuario buscar y navegar propiedades disponibles.

| **Método** | **Endpoint**                | **Descripción**                                                | **Body Params**  | **Query Params**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Middleware / Restrictions** | **Respuestas**                                                                                             |
|------------|-----------------------------|----------------------------------------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|------------------------------------------------------------------------------------------------------------|
| **GET**    | `/`                         | Obtener todas las propiedades activas con filtros y paginación | - *(sin params)* | - `page`: number (default: 1)<br>- `limit`: number (default: 20, max: 100)<br>- `campus`: string ("Guadalajara" \| "Monterrey" \| "Ciudad de México" \| "Otro")<br>- `tipoPropiedad`: string<br>- `tipoRenta`: string<br>- `precioMinimo`: number<br>- `precioMaximo`: number<br>- `amueblado`: boolean<br>- `mascotasPermitidas`: boolean<br>- `serviciosIncluidos`: boolean<br>- `numeroBanos`: number<br>- `numeroRecamaras`: number<br>- `generoPreferido`: string                              | —                             | `200`: Lista de propiedades<br>`400`: Parámetros inválidos<br>`500`: Error interno                         |
| **GET**    | `/:propertyId`              | Obtener detalles completos de una propiedad específica         | - *(sin params)* | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | —                             | `200`: Detalles de propiedad (incrementa vistas)<br>`404`: Propiedad no encontrada<br>`500`: Error interno |
| **GET**    | `/arrendador/:arrendadorId` | Obtener todas las propiedades de un arrendador específico      | - *(sin params)* | - `page`: number<br>- `limit`: number                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                             | `200`: Lista de propiedades del arrendador<br>`404`: Arrendador no encontrado<br>`500`: Error interno      |
| **GET**    | `/catalogo`                 | Catálogo principal para homepage (propiedades más populares)   | - *(sin params)* | - `page`: number (default: 1)<br>- `limit`: number (default: 20, max: 100)                                                                                                                                                                                                                                                                                                                                                                                                                          | —                             | `200`: Catálogo de propiedades destacadas<br>`500`: Error interno                                          |
| **GET**    | `/buscar`                   | Búsqueda avanzada con múltiples filtros y ordenamiento         | - *(sin params)* | - `campus`: string<br>- `tipoPropiedad`: string<br>- `tipoRenta`: string<br>- `precioMinimo`: number<br>- `precioMaximo`: number<br>- `amueblado`: boolean<br>- `mascotasPermitidas`: boolean<br>- `serviciosIncluidos`: boolean<br>- `numeroBanos`: number<br>- `numeroRecamaras`: number<br>- `generoPreferido`: string<br>- `distanciaMaxima`: number<br>- `page`: number<br>- `limit`: number<br>- `ordenarPor`: "precio_asc" \| "precio_desc" \| "distancia" \| "calificacion" \| "fecha_desc" | —                             | `200`: Resultados de búsqueda<br>`400`: Parámetros inválidos<br>`500`: Error interno                       |
| **GET**    | `/campus/:campus`           | Filtrar propiedades por campus específico                      | - *(sin params)* | - `page`: number (default: 1)<br>- `limit`: number (default: 20)<br>- `ordenarPor`: "precio_asc" \| "precio_desc" \| "distancia" \| "calificacion"                                                                                                                                                                                                                                                                                                                                                  | —                             | `200`: Propiedades del campus<br>`400`: Campus inválido<br>`500`: Error interno                            |
| **GET**    | `/:propertyId/similares`    | Obtener propiedades similares en el mismo campus               | - *(sin params)* | - `limit`: number (default: 6, max: 20)                                                                                                                                                                                                                                                                                                                                                                                                                                                             | —                             | `200`: Propiedades similares<br>`404`: Propiedad no encontrada<br>`500`: Error interno                     |

---

## Sección 2: Gestión CRUD de Propiedades (Protegido - Arrendadores)

Endpoints para que los arrendadores administren sus propiedades. Requieren autenticación y verificación de propiedad.

| **Método** | **Endpoint**                  | **Descripción**                                               | **Body Params**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Query Params** | **Middleware / Restrictions**        | **Respuestas**                                                                                                                                                              |
|------------|-------------------------------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **POST**   | `/`                           | Crear una nueva propiedad                                     | - `tipoPropiedad`: string (requerido)<br>- `tipoRenta`: string (requerido)<br>- `campus`: string (requerido)<br>- `precioMensual`: number (requerido)<br>- `direccion.calle`: string<br>- `direccion.ciudad`: string<br>- `direccion.estado`: string<br>- `direccion.codigoPostal`: string<br>- `amueblado`: boolean<br>- `mascotasPermitidas`: boolean<br>- `serviciosIncluidos`: boolean<br>- `servicios`: array<br>- `numeroBanos`: number<br>- `numeroRecamaras`: number<br>- `metrosCuadrados`: number<br>- `generoPreferido`: string<br>- `descripcion`: string<br>- `imagenes`: array de URLs | - *(sin params)* | Requiere token JWT de arrendador     | `201`: Propiedad creada<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`404`: Arrendador no encontrado<br>`500`: Error interno                                      |
| **PUT**    | `/:propertyId`                | Actualizar una propiedad existente                            | - Todos los campos son opcionales (mismos que en POST)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Propiedad actualizada<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno                |
| **PATCH**  | `/:propertyId/estado`         | Cambiar estado de propiedad (Activa, Inactiva, Rentada, etc.) | - `estado`: string ("Activa" \| "Inactiva" \| "Rentada" \| "En mantenimiento" \| "Pausada")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Estado actualizado<br>`400`: Estado inválido<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno                   |
| **PATCH**  | `/:propertyId/disponibilidad` | Actualizar disponibilidad y duración de contrato              | - `fechaDisponibilidad`: date<br>- `duracionMinima`: number (meses)<br>- `duracionMaxima`: number (meses)<br>- `renovacionAutomatica`: boolean                                                                                                                                                                                                                                                                                                                                                                                                                                                       | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Disponibilidad actualizada<br>`400`: Datos inválidos<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno           |
| **PATCH**  | `/:propertyId/imagenes`       | Actualizar imágenes de la propiedad                           | - `imagenes`: array de URLs (máximo 20)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Imágenes actualizadas<br>`400`: Array inválido o excede límite<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno |
| **DELETE** | `/:propertyId`                | Eliminar propiedad (soft delete)                              | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Propiedad eliminada<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno                                            |
| **DELETE** | `/:propertyId/permanente`     | Eliminar permanentemente (hard delete, IRREVERSIBLE)          | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Propiedad eliminada permanentemente<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno                            |
| **PATCH**  | `/:propertyId/restaurar`      | Restaurar propiedad eliminada lógicamente                     | - *(sin params)*                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | - *(sin params)* | Requiere token JWT + ser propietario | `200`: Propiedad restaurada<br>`401`: Token no válido<br>`403`: No es propietario<br>`404`: No encontrada<br>`500`: Error interno                                           |

---

## Sección 3: Funcionalidades de Cliente (Esqueleto - Futuro)

**ESTADO:** Todos estos endpoints están en esqueleto y devuelven 501 (Not Implemented). Requieren implementación de
autenticación de clientes.

| **Método** | **Endpoint**                       | **Descripción**                                                | **Body Params**                                                                      | **Query Params**                                                                                                                                                                                                                                               | **Middleware / Restrictions**                                                      | **Respuestas**         |
|------------|------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|------------------------|
| **GET**    | `/cliente/recomendaciones`         | Obtener propiedades recomendadas basadas en perfil del cliente | - *(sin params)*                                                                     | - `limit`: number (default: 10, max: 50)<br>- `page`: number                                                                                                                                                                                                   | Requiere autenticación de cliente (futuro)                                         | `501`: No implementado |
| **GET**    | `/cliente/busqueda-avanzada`       | Búsqueda avanzada con filtros especiales y búsqueda por texto  | - *(sin params)*                                                                     | - `textoLibre`: string<br>- `fechaMudanza`: date (YYYY-MM-DD)<br>- `tiempoMaximoTraslado`: number (minutos)<br>- `requiereRoommate`: boolean<br>- `estiloVida`: array ["Estudiante", "Trabajador", "Ambos"]<br>- `amenidades`: array<br>- Más filtros estándar | Requiere autenticación de cliente (opcional para búsqueda, requerido para guardar) | `501`: No implementado |
| **GET**    | `/cliente/favoritos`               | Obtener lista de propiedades favoritas del cliente             | - *(sin params)*                                                                     | - `limit`: number<br>- `page`: number                                                                                                                                                                                                                          | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **POST**   | `/cliente/favoritos/:propertyId`   | Agregar propiedad a favoritos                                  | - *(sin params)*                                                                     | - *(sin params)*                                                                                                                                                                                                                                               | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **DELETE** | `/cliente/favoritos/:propertyId`   | Eliminar propiedad de favoritos                                | - *(sin params)*                                                                     | - *(sin params)*                                                                                                                                                                                                                                               | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **GET**    | `/cliente/vistas-recientes`        | Obtener historial de propiedades vistas recientemente          | - *(sin params)*                                                                     | - `limit`: number (default: 20, max: 50)                                                                                                                                                                                                                       | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **GET**    | `/cliente/compatibilidad-roommate` | Buscar propiedades con roommates compatibles                   | - *(sin params)*                                                                     | - `soloCompatibles`: boolean<br>- `mostrarScore`: boolean<br>- Más filtros estándar                                                                                                                                                                            | Requiere autenticación de cliente (opcional)                                       | `501`: No implementado |
| **GET**    | `/cliente/similares/:propertyId`   | Obtener propiedades similares a una específica                 | - *(sin params)*                                                                     | - `limit`: number (default: 10, max: 20)                                                                                                                                                                                                                       | —                                                                                  | `501`: No implementado |
| **GET**    | `/cliente/busquedas-guardadas`     | Obtener búsquedas guardadas del cliente                        | - *(sin params)*                                                                     | - `ejecutar`: boolean (ejecutar búsquedas y mostrar resultados nuevos)                                                                                                                                                                                         | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **POST**   | `/cliente/busquedas-guardadas`     | Guardar una nueva búsqueda                                     | - `nombre`: string<br>- `criterios`: object (filtros)<br>- `alertasActivas`: boolean | - *(sin params)*                                                                                                                                                                                                                                               | Requiere autenticación de cliente                                                  | `501`: No implementado |
| **POST**   | `/cliente/comparar`                | Comparar hasta 4 propiedades lado a lado                       | - `propiedadesIds`: array of IDs (máximo 4)                                          | - *(sin params)*                                                                                                                                                                                                                                               | —                                                                                  | `501`: No implementado |
| **GET**    | `/cliente/mapa`                    | Obtener propiedades en formato optimizado para mapa            | - *(sin params)*                                                                     | - `latMin`: number<br>- `latMax`: number<br>- `lngMin`: number<br>- `lngMax`: number<br>- `zoom`: number<br>- Más filtros estándar                                                                                                                             | —                                                                                  | `501`: No implementado |

---

## Ejemplos de Respuesta

### Búsqueda Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "tipoPropiedad": "Departamento",
      "tipoRenta": "Departamento completo",
      "campus": "Guadalajara",
      "precioMensual": 8500,
      "amueblado": true,
      "numeroBanos": 2,
      "numeroRecamaras": 1,
      "metrosCuadrados": 75,
      "generoPreferido": "Mixto",
      "calificacion": 4.5,
      "numeroReviews": 12,
      "vistas": 345,
      "imagenes": [
        "https://ejemplo.com/img1.jpg"
      ],
      "estado": "Activa",
      "fechaCreacion": "2024-01-08T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
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
    "tipoPropiedad": "Departamento",
    "tipoRenta": "Departamento completo",
    "campus": "Guadalajara",
    "precioMensual": 8500,
    "direccion": {
      "calle": "Av. Guadalupe 123",
      "ciudad": "Guadalajara",
      "estado": "Jalisco",
      "codigoPostal": "44100"
    },
    "amueblado": true,
    "mascotasPermitidas": false,
    "serviciosIncluidos": true,
    "servicios": [
      "Luz",
      "Agua",
      "Internet"
    ],
    "numeroBanos": 2,
    "numeroRecamaras": 1,
    "metrosCuadrados": 75,
    "generoPreferido": "Mixto",
    "descripcion": "Hermoso departamento céntrico",
    "imagenes": [
      "https://ejemplo.com/img1.jpg"
    ],
    "estado": "Activa",
    "propietarioId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "verificada": false,
    "destacada": false,
    "fechaCreacion": "2024-01-08T12:00:00Z",
    "fechaActualizacion": "2024-01-08T12:00:00Z"
  }
}
```

### Detalles de Propiedad (200)

```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "tipoPropiedad": "Departamento",
    "tipoRenta": "Departamento completo",
    "campus": "Guadalajara",
    "precioMensual": 8500,
    "direccion": {
      "calle": "Av. Guadalupe 123",
      "ciudad": "Guadalajara",
      "estado": "Jalisco",
      "codigoPostal": "44100",
      "latitud": 20.6596,
      "longitud": -103.2494
    },
    "amueblado": true,
    "muebles": [
      "Cama",
      "Escritorio",
      "Refrigerador"
    ],
    "mascotasPermitidas": false,
    "serviciosIncluidos": true,
    "servicios": [
      {
        "nombre": "Luz",
        "costoAdicional": 0
      },
      {
        "nombre": "Agua",
        "costoAdicional": 0
      },
      {
        "nombre": "Internet",
        "costoAdicional": 0
      }
    ],
    "numeroBanos": 2,
    "numeroRecamaras": 1,
    "metrosCuadrados": 75,
    "generoPreferido": "Mixto",
    "edadMinima": 18,
    "edadMaxima": 65,
    "descripcion": "Hermoso departamento céntrico con buena ubicación",
    "imagenes": [
      "https://ejemplo.com/img1.jpg",
      "https://ejemplo.com/img2.jpg"
    ],
    "estado": "Activa",
    "propietarioId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "propietario": {
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "+52 55 1234 5678"
    },
    "disponibilidad": {
      "fechaDisponibilidad": "2024-02-01",
      "duracionMinima": 6,
      "duracionMaxima": 24,
      "renovacionAutomatica": true
    },
    "verificada": true,
    "destacada": false,
    "calificacion": 4.5,
    "numeroReviews": 12,
    "vistas": 345,
    "favoritos": 28,
    "inquilinosActuales": [
      "userId1",
      "userId2"
    ],
    "fechaCreacion": "2024-01-08T12:00:00Z",
    "fechaActualizacion": "2024-01-08T12:00:00Z"
  }
}
```

### Error - No Autorizado (403)

```json
{
  "success": false,
  "message": "No eres propietario de esta propiedad"
}
```

---

## Notas Importantes

- **Autenticación:** Endpoints protegidos requieren `Authorization: Bearer {JWT_TOKEN}`
- **Ownership:** Se verifica que el usuario sea propietario de la propiedad
- **Soft Delete:** Los deletes marcan como inactivo por defecto
- **Hard Delete:** El delete permanente es irreversible
- **Paginación:** Máximo 100 resultados por página en búsqueda pública
- **Estados Válidos:** Activa, Inactiva, Rentada, En mantenimiento, Pausada
- **Campus:** Guadalajara, Monterrey, Ciudad de México, Otro
- **Vistas:** Se incrementan automáticamente al acceder a detalles de propiedad
- **Cliente Endpoints:** Todos están en esqueleto (501) - pendiente de implementación de autenticación de clientes

