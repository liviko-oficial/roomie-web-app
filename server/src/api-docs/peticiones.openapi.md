# Peticiones de Renta - Documentación de Endpoints

## Descripción General

El sistema de **Peticiones** permite que usuarios (estudiantes) soliciten vivir en una propiedad específica. Los
arrendadores pueden revisar todas las peticiones de sus propiedades y ver información sanitizada del solicitante.

**Base Path:** `/api/propiedades-renta`

**Versión:** 1.0.0  
**Estado:** Prototipado (Con TODOs mencionados abajo)  
**Última actualizacion:** Enero 9, 2026

---

## CAN DO - Funcionalidades Implementadas

### Usuario puede crear petición

- **Endpoint:** `POST /api/propiedades-renta/:propertyId/solicitar`
- **Autenticación:** ❌ **NO REQUIERE** (IMPORTANTE: Ver nota de seguridad abajo)
- **Lo que funciona:**
    - Enviar `userId` (ID del usuario en la BD)
    - El sistema extrae automáticamente datos visibles del usuario
    - Incluir información económica opcional (oferta de precio)
    - Sistema valida que la propiedad existe
    - Sistema valida que el usuario existe en BD
    - Crea registro con timestamp automático
    - Retorna petición creada con ID

### Arrendador puede listar todas sus peticiones

- **Endpoint:** `GET /api/propiedades/:arrendadorId/peticiones`
- **Autenticación:** **SÍ REQUIERE** Token JWT del arrendador
- **Lo que funciona:**
    - Listar TODAS las peticiones de TODAS sus propiedades
    - Filtrar por propertyId específico (query param)
    - Paginación automática (page, limit)
    - Ordenado por fecha más reciente primero
    - Ver información sanitizada del usuario
    - Ver información de contexto (propiedad, fecha solicitud, status)
    - Ver oferta económica si existe

### Arrendador puede ver detalle de una petición

- **Endpoint:** `GET /api/propiedades/:arrendadorId/peticiones/:peticionId`
- **Autenticación:** **SÍ REQUIERE** Token JWT del arrendador
- **Lo que funciona:**
    - Ver TODA la información sanitizada del solicitante
    - Ver hobbies, preferencias de roomie
    - Ver información educativa
    - Ver contacto de emergencia
    - Ver información de mascota si aplica
    - Ver contexto de la solicitud
    - Ver oferta económica si fue incluida

### Arrendador puede ver aceptar una petición

- **Endpoint:** `PUT /api/propiedades/peticiones/:petitionId/aceptar`
- **Autenticación:** **SÍ REQUIERE** Token JWT del arrendador
- **Lo que funciona:**
    - Valida que la petición exista y no haya sido procesada previamente.
    - Valida que el arrendador autenticado sea el dueño real de la propiedad.
    - Cambia el estatus de la petición a `"Aceptada"`.
    - Agrega al estudiante a `inquilinosActuales` y `historialInquilinos` de la propiedad.
    - Vincula al estudiante con la lista de `tenants` del arrendador.
    - Retorna éxito y los IDs vinculados.

### Arrendador puede rechazar una petición

- **Endpoint:** `PUT /api/propiedades/peticiones/:petitionId/rechazar`
- **Autenticación:** **SÍ REQUIERE** Token JWT del arrendador
- **Lo que funciona:**
    - Valida que la petición exista y esté en estatus `"En proceso"`.
    - Valida que el arrendador sea el propietario del inmueble.
    - Cambia el estatus de la petición a `"Rechazada"`.
    - Permite incluir un campo de `motivo` para dar feedback al estudiante.
    - No afecta la disponibilidad de la propiedad ni vincula inquilinos.

---

## CANNOT DO - Limitaciones y Restricciones

### Usuario NO puede

- **Ver peticiones** que ha hecho (funcionalidad futura)
- **Cancelar peticiones** (funcionalidad futura)
- **Editar peticiones** después de crearlas (funcionalidad futura)
- **Ver respuestas del arrendador** (no implementado)
- **Hacer petición sin userId válido** → Error 400
- **Hacer petición a propiedad inexistente** → Error 404
- **Hacer petición con usuario inexistente** → Error 404
- **Acceder a endpoints de arrendador** (sin token JWT)

### Arrendador NO puede

- **Ver peticiones** de otros arrendadores
- **Ver información personal completa** del solicitante (por privacidad)
    - NO: apellido materno
    - NO: matrícula
    - NO: teléfono personal
    - NO: correo institucional
    - NO: documentos personales (INE, pasaporte, etc.)
    - NO: dirección particular
- **Modificar o eliminar peticiones** (solo lectura)
- **Contactar directamente** al solicitante (no hay email/teléfono)
- **Responder peticiones** (funcionalidad futura)
- **Filtrar peticiones** por criterios avanzados (solo por propertyId)

---

## Información Visible al Arrendador (Data Privacy)

### Datos que SÍ se envían

```json
{
  "usuarioVisible": {
    "nombres": "Juan Carlos",
    "apellidoPaterno": "González",
    "fotoPerfilUrl": "https://...",
    "edad": 22,
    "genero": "Masculino",
    "nacionalidad": "Mexicano",
    "estadoOrigen": "Jalisco",
    "hobbies": [
      "Futbol",
      "Lectura"
    ],
    "noNegociables": [
      "No fumadores",
      "Limpieza"
    ],
    "preferenciaRoomies": "Mixto",
    "tieneMascota": false,
    "tipoMascota": null,
    "nivelEducativo": "Licenciatura",
    "areaPrograma": "ITCS",
    "semestreOGraduacion": "8vo semestre",
    "contactoEmergencia": {
      "nombre": "María González",
      "telefono": "+52 33 9999 8888"
    }
  }
}
```

### Datos que NO se incluyen (Privacidad)

```text

apellidoMaterno
matrícula
teléfono personal
correo institucional
documentos (INE, pasaporte, licencia)
dirección particular
email
contraseña
```

---

## Autorización y Seguridad

### Usuario Creando Petición

- **Requiere:** UserId válido en la BD
- **No requiere:** Autenticación
- **PRODUCCIÓN TODO:** Implementar autenticación de usuario
    - Actualmente acepta cualquier userId
    - DEBE validar que userid == usuario autenticado
    - DEBE implementar rate limiting (eg: máx 10 peticiones/usuario/día)

### Arrendador Viendo Peticiones

- **Requiere:** Token JWT válido
- **Requiere:** Ser el propietario de la propiedad
- **Comportamiento actual:** Valida token pero NO valida propiedad
- **PRODUCCIÓN TODO:** Validar que arrendador es dueño de propiedad
  ```typescript
  // Ejemplo
  // TODO: Agregar validación
  const propiedad = await PropiedadRentaDB.findById(propertyId);
  if (!propiedad || propiedad.propietarioId !== arrendadorId) {
    return res.status(403).json({ success: false });
  }
  ```

---

## Endpoints Completos

### POST - Crear Petición

```
POST /api/propiedades-renta/:propertyId/solicitar
```

**Descripción:** Usuario solicita vivir en una propiedad

**Request Body:**

```json
{
  "userId": "64a7b8c9d1e2f3a4b5c6d7e9",
  "oferta": {
    "montoOfrecidoMXN": 8500,
    "numeroOfertas": 1,
    "historialOfertas": [
      8500
    ]
  }
}
```

**Parámetros:**

| Campo                     | Tipo   | Requerido | Descripción                                |
|---------------------------|--------|-----------|--------------------------------------------|
| `userId`                  | string | SÍ        | ID del usuario en la BD (MongoDB ObjectId) |
| `oferta`                  | object | NO        | Info económica (opcional)                  |
| `oferta.montoOfrecidoMXN` | number | Cond.     | Cantidad en pesos mexicanos                |
| `oferta.numeroOfertas`    | number | Cond.     | Cuántas ofertas ha hecho                   |
| `oferta.historialOfertas` | array  | Cond.     | Listado de ofertas anteriores              |

**Responses:**

**201 Created** - Éxito

```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
    "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "usuarioVisible": {
      "nombres": "Juan Carlos",
      "apellidoPaterno": "González",
      ...
    },
    "contexto": {
      "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
      "fechaSolicitud": "2026-01-09T12:00:00Z",
      "estatus": "En proceso"
    },
    "oferta": {
      "montoOfrecidoMXN": 8500,
      "numeroOfertas": 1,
      "historialOfertas": [
        8500
      ]
    },
    "createdAt": "2026-01-09T12:00:00Z"
  }
}
```

**400 Bad Request** - UserId falta o inválido

```json
{
  "success": false,
  "message": "El ID del usuario es requerido"
}
```

**404 Not Found** - Propiedad no existe

```json
{
  "success": false,
  "message": "Propiedad no encontrada"
}
```

**404 Not Found** - Usuario no existe en BD

```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### GET - Listar Peticiones del Arrendador

```
GET /api/propiedades/:arrendadorId/peticiones[?propertyId=...&page=1&limit=20]
```

**Descripción:** Arrendador ve todas sus peticiones

**Autenticación:** Token JWT requerido  
**Header:**

```
Authorization: Bearer <token_jwt>
```

**Query Parameters:**
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `propertyId` | string | null | Filtrar por propiedad (opcional) |
| `page` | number | 1 | Número de página |
| `limit` | number | 20 | Resultados por página |

**Responses:**

**200 OK** - Lista de peticiones

```json
{
  "success": true,
  "data": [
    {
      "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
      "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
      "usuarioVisible": {
        "nombres": "Juan Carlos",
        "apellidoPaterno": "González",
        ...
      },
      "contexto": {
        "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
        "fechaSolicitud": "2026-01-09T12:00:00Z",
        "estatus": "En proceso"
      },
      "createdAt": "2026-01-09T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**401 Unauthorized** - Token inválido o vencido

```json
{
  "success": false,
  "message": "Autenticación requerida"
}
```

**404 Not Found** - Arrendador no existe

```json
{
  "success": false,
  "message": "Arrendador no encontrado o inactivo"
}
```

---

### GET - Ver Detalle de Petición

```
GET /api/propiedades/:arrendadorId/peticiones/:peticionId
```

**Descripción:** Arrendador ve detalle completo de una petición

**Autenticación:** Token JWT requerido

**Responses:**

**200 OK** - Detalle de petición

```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
    "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "usuarioVisible": {
      "nombres": "Juan Carlos",
      "apellidoPaterno": "González",
      "fotoPerfilUrl": "https://...",
      "edad": 22,
      "genero": "Masculino",
      "nacionalidad": "Mexicano",
      "estadoOrigen": "Jalisco",
      "hobbies": [
        "Futbol",
        "Lectura",
        "Videojuegos"
      ],
      "noNegociables": [
        "No fumadores",
        "Limpieza",
        "Respeto"
      ],
      "preferenciaRoomies": "Mixto",
      "tieneMascota": false,
      "tipoMascota": null,
      "nivelEducativo": "Licenciatura",
      "areaPrograma": "ITCS",
      "semestreOGraduacion": "8vo semestre",
      "contactoEmergencia": {
        "nombre": "María González",
        "telefono": "+52 33 9999 8888"
      }
    },
    "contexto": {
      "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
      "fechaSolicitud": "2026-01-09T12:00:00Z",
      "estatus": "En proceso"
    },
    "oferta": {
      "montoOfrecidoMXN": 8500,
      "numeroOfertas": 1,
      "historialOfertas": [
        8500
      ]
    },
    "createdAt": "2026-01-09T12:00:00Z",
    "updatedAt": "2026-01-09T12:00:00Z"
  }
}
```

**404 Not Found** - Petición no existe

```json
{
  "success": false,
  "message": "Petición no encontrada"
}
```

**403 Forbidden** - Arrendador no es dueño de propiedad

```json
{
  "success": false,
  "message": "No tienes permiso para ver esta petición"
}
```

---

### PUT - Aceptar Petición
```
PUT /api/propiedades/peticiones/:petitionId/aceptar
```

**Descripción:** El arrendador formaliza la renta aceptando al estudiante. Este proceso vincula permanentemente al estudiante con la propiedad y actualiza el historial de inquilinos.

**Autenticación:** **SÍ REQUIERE** Token JWT del arrendador.

**Request Body:**

```json
{
  "landlordId": "64a7b8c9d1e2f3a4b5c6d7e8"
}
```

**Parámetros de Ruta:**

| Campo        | Tipo   | Requerido | Descripción                                  |
|--------------|--------|-----------|----------------------------------------------|
| `petitionId` | string | SÍ        | ID único de la petición (MongoDB ObjectId)   |

**Responses:**

**200 OK - Éxito en la vinculación**
{
  "success": true,
  "message": "¡Solicitud aceptada! El estudiante ha sido vinculado a la propiedad.",
  "data": {
    "studentId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "propertyId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "status": "Aceptada"
  }
}

**400 Bad Request - Solicitud ya procesada**
```json
{
  "success": false,
  "message": "La solicitud ya tiene el estatus: Aceptada"
}
```

**403 Forbidden - El arrendador no es el dueño**
```json
{
  "success": false,
  "message": "No tienes permiso para aceptar solicitudes de esta propiedad."
}
```

**404 Not Found - No existe la petición o la propiedad**
```json
{
  "success": false,
  "message": "Solicitud no encontrada."
}
```

**500 Internal Server Error - Error de servidor**
```json
{
  "success": false,
  "message": "Error interno del servidor al aceptar la solicitud."
}
```

### PUT - Rechazar Petición
```
PUT /api/propiedades/peticiones/:petitionId/rechazar
```
**Descripción:** El arrendador declina formalmente la solicitud del estudiante. Este proceso marca la petición como finalizada, impidiendo futuras acciones de aceptación o negociación sobre la misma y notificando el cierre del proceso al solicitante.

**Autenticación:** ✅ **SÍ REQUIERE** Token JWT del arrendador.

**Request Body:**

```json
{
  "landlordId": "64a7b8c9d1e2f3a4b5c6d7e8",
  "motivo": "El perfil no se ajusta a las reglas de convivencia actuales o la habitación ya no está disponible."
}
```
**Parámetros de Ruta:**

| Campo        | Tipo   | Requerido | Descripción                                  |
|--------------|--------|-----------|----------------------------------------------|
| `petitionId` | string | SÍ        | ID único de la petición (MongoDB ObjectId)   |
**Responses:**

**200 OK - Solicitud Rechazada**
```json
{
  "success": true,
  "message": "La solicitud ha sido rechazada exitosamente.",
  "data": {
    "petitionId": "64a7b8c9d1e2f3a4b5c6d7ea",
    "status": "Rechazada",
    "motivoRechazo": "El perfil no se ajusta a las reglas de convivencia actuales."
  }
}
```

**400 Bad Request: Petición ya Rechazada**
```json
{
  "success": false,
  "message": "No se puede rechazar. La solicitud ya tiene el estatus: Aceptada/Rechazada"
}
```

**403 Forbidden - No autorizado (Ownership error)**
```json
{
  "success": false,
  "message": "No tienes permiso para gestionar esta solicitud."
}
```

**404 Not Found - Petición no encontrada**
```json
{
  "success": false,
  "message": "Solicitud no encontrada."
}
```

**500 Internal Server Error - Error de servidor**
```json
{
  "success": false,
  "message": "Error interno del servidor al procesar el rechazo."
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Usuario crea petición

```bash
curl -X POST http://localhost:3000/api/propiedades-renta/64a7b8c9d1e2f3a4b5c6d7e9/solicitar \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "oferta": {
      "montoOfrecidoMXN": 8500,
      "numeroOfertas": 1,
      "historialOfertas": [8500]
    }
  }'
```

### Ejemplo 2: Arrendador lista sus peticiones

```bash
curl -X GET "http://localhost:3000/api/propiedades/64a7b8c9d1e2f3a4b5c6d7e8/peticiones?page=1&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Ejemplo 3: Arrendador filtra peticiones por propiedad

```bash
curl -X GET "http://localhost:3000/api/propiedades/64a7b8c9d1e2f3a4b5c6d7e8/peticiones?propertyId=64a7b8c9d1e2f3a4b5c6d7e9" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Ejemplo 4: Arrendador ve detalle de petición

```bash
curl -X GET http://localhost:3000/api/propiedades/64a7b8c9d1e2f3a4b5c6d7e8/peticiones/64a7b8c9d1e2f3a4b5c6d7ea \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Ejemplo 5: Arrendador acepta petición

```bash
curl -X PATCH http://localhost:3000/api/propiedades/peticiones/64a7b8c9d1e2f3a4b5c6d7ea/aceptar \
  -H "Authorization: Bearer <token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "landlordId": "64a7b8c9d1e2f3a4b5c6d7e8"
  }'
```

### Ejemplo 6: Arrendador rechaza petición

```bash
curl -X PUT http://localhost:3000/api/propiedades/peticiones/64a7b8c9d1e2f3a4b5c6d7ea/rechazar \
  -H "Authorization: Bearer <token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "landlordId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "motivo": "El perfil no se ajusta a las reglas de convivencia actuales."
  }'
```
---

## Notas Importantes para Producción

### Seguridad

1. **Auth en creación de petición:** Actualmente NO requiere autenticación. En producción:
    - DEBE verificar que `userId` pertenece al usuario autenticado
    - DEBE implementar JWT para usuarios también
    - DEBE implementar rate limiting

2. **Validación de propiedad:** Actualmente NO valida que arrendador es dueño de propiedad
    - DEBE agregar validación en endpoints GET

3. **Data sanitization:** Usar `extractVisibleUserData()` para garantizar privacidad
    - Ya implementado, pero DEBE auditarse regularmente

### Performance

- Peticiones almacenadas en MongoDB
- Índices recomendados: `propertyId`, `arrendadorId`, `createdAt`
- Paginación implementada (eg: máx 100 por página)

### Logging y Auditoría

- **TODO:** Implementar logging de todas las acciones
- **TODO:** Agregar auditoria para ver quién accedió qué petición
- **TODO:** Alertas para múltiples peticiones del mismo usuario

### Data Retention

- **TODO:** Definir política de retención (ej: borrar después de 2 años)
- **TODO:** GDPR: Implementar "derecho al olvido"
- **TODO:** Backup periódico de peticiones
