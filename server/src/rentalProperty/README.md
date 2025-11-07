# Sistema de Propiedades de Renta - API Backend

Sistema completo de gestión de propiedades para arrendadores con autenticación protegida.



#### CREATE - Crear Propiedades
- **Endpoint**: `POST /api/propiedades-renta`
- **Autenticación**: Requerida (arrendador)
- **Funcionalidad**:
  - Validación completa con Zod usando `PropiedadCreacionSchema`
  - Verificación de arrendador activo
  - Asociación automática con el arrendador autenticado
  - Inicialización de campos predeterminados
  - Manejo robusto de errores

#### READ - Leer Propiedades
- **Endpoints públicos**:
  - `GET /api/propiedades-renta` - Lista todas las propiedades activas
  - `GET /api/propiedades-renta/:propertyId` - Detalles de una propiedad
  - `GET /api/propiedades-renta/arrendador/:arrendadorId` - Propiedades de un arrendador

- **Funcionalidad**:
  - Sistema de filtros avanzados (tipo, precio, campus, servicios, etc.)
  - Paginación completa
  - Ordenamiento múltiple (precio, distancia, calificación, fecha)
  - Contador de vistas automático
  - Populate de datos del arrendador
  - Ocultación de datos sensibles en listados públicos

### (TODO)

#### UPDATE - Actualizar Propiedades
**Archivo**: `controllers/property.update.controller.ts`

Funcionalidades a implementar:
- Actualización completa de propiedad
- Cambio de estado (Activa, Inactiva, Rentada, En mantenimiento, Pausada)
- Actualización de disponibilidad
- Actualización de imágenes

#### DELETE - Eliminar Propiedades
**Archivo**: `controllers/property.delete.controller.ts`

Funcionalidades a implementar:
- Eliminación lógica (soft delete)
- Eliminación permanente (solo administradores)
- Restauración de propiedades eliminadas

#### READ - Funcionalidad para Inquilinos/Clientes
**Estado**: Esqueleto implementado - Endpoints devuelven 501 hasta que se implemente autenticación de clientes

**Archivos**:
- `controllers/property.customer.controller.ts` - Controlador con TODOs en español
- `routes/property.customer.routes.ts` - Rutas definidas pero no funcionales

**Funcionalidades preparadas** (ver sección "Filtros Especiales para Clientes" más abajo):
- Búsqueda personalizada y recomendaciones
- Sistema de favoritos
- Historial de vistas recientes
- Búsqueda por compatibilidad de roommate
- Búsquedas guardadas con alertas
- Comparación de propiedades
- Vista de mapa interactivo
- Propiedades similares

**Nota**: Todos los endpoints están estructurados y documentados. Solo requieren:
1. Implementación del módulo de autenticación de clientes
2. Descomentar middleware de autenticación en las rutas
3. Implementar la lógica en cada método del controlador

## Estructura de Archivos

```
rentalProperty/
├── controllers/
│   ├── property.controller.ts          # CREATE y READ implementados
│   ├── property.customer.controller.ts # Búsquedas para clientes (esqueleto)
│   ├── property.update.controller.ts   # TODO: UPDATE
│   └── property.delete.controller.ts   # TODO: DELETE
├── routes/
│   ├── index.ts                        # Exportación de rutas
│   ├── property.routes.ts              # Endpoints para arrendadores
│   └── property.customer.routes.ts     # Endpoints para clientes (esqueleto)
├── middleware/
│   └── property.middleware.ts          # Verificación de propiedad
├── models/
│   ├── rentalProperty.schema.ts        # Esquema Mongoose y Zod
│   ├── propiedadAuth.schema.ts         # Esquemas de validación
│   └── index.ts                        # Exportaciones
├── lib/
│   └── constants.ts                    # Constantes y configuración
└── index.ts                            # Punto de entrada del módulo
```

## Endpoints API

### Públicos (sin autenticación)

#### GET /api/propiedades-renta
Obtener todas las propiedades activas con filtros opcionales.

**Query Parameters**:
- `tipoPropiedad`: Array de tipos ["Casa", "Departamento", "Cuarto", etc.]
- `tipoRenta`: Array de tipos de renta
- `generoPreferido`: Array de preferencias de género
- `precioMinimo`: Número
- `precioMaximo`: Número
- `campus`: "Guadalajara" | "Monterrey" | "Ciudad de México" | "Otro"
- `distanciaMaxima`: Número en kilómetros
- `amueblado`: Boolean
- `mascotasPermitidas`: Boolean
- `serviciosIncluidos`: Boolean
- `numeroBanos`: Número mínimo
- `numeroRecamaras`: Número mínimo
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 10, max: 100)
- `ordenarPor`: "precio_asc" | "precio_desc" | "distancia" | "calificacion" | "fecha_desc"

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "propiedades": [...],
    "paginacion": {
      "paginaActual": 1,
      "totalPaginas": 5,
      "totalPropiedades": 47,
      "propiedadesPorPagina": 10,
      "tieneSiguiente": true,
      "tieneAnterior": false
    },
    "filtrosAplicados": {...}
  }
}
```

#### GET /api/propiedades-renta/:propertyId
Obtener detalles de una propiedad específica.

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "titulo": "...",
    "descripcion": "...",
    "propietarioId": {
      "nombre": "...",
      "email": "...",
      "calificacion": 4.5
    },
    ...
  }
}
```

#### GET /api/propiedades-renta/arrendador/:arrendadorId
Obtener propiedades de un arrendador específico.

**Query Parameters**:
- `page`: Número de página
- `limit`: Resultados por página

### Protegidos (requieren autenticación)

#### POST /api/propiedades-renta
Crear una nueva propiedad.

**Headers**:
```
Authorization: Bearer <token>
```

**Body** (ejemplo simplificado):
```json
{
  "titulo": "Habitación cerca del Tec",
  "descripcion": "Habitación amplia y luminosa...",
  "resumen": "Habitación ideal para estudiantes",
  "tipoPropiedad": "Cuarto",
  "tipoRenta": "Cuarto privado",
  "capacidadMaxima": 1,
  "direccion": {
    "calle": "Av. General Ramón Corona",
    "colonia": "Centro",
    "ciudad": "Guadalajara",
    "estado": "Jalisco",
    "codigoPostal": "44100"
  },
  "caracteristicas": {
    "numeroBanos": 1,
    "numeroRecamaras": 1,
    "amueblado": true,
    "muebles": ["Cama", "Escritorio", "Armario"]
  },
  "servicios": {
    "serviciosIncluidos": true,
    "listaServicios": ["Internet", "Luz", "Agua"]
  },
  "ubicacion": {
    "campus": "Guadalajara",
    "distanciaCampus": 2.5,
    "transporte": ["Camión urbano", "Uber/DiDi"]
  },
  "informacionFinanciera": {
    "precioMensual": 5000,
    "deposito": 5000
  },
  "disponibilidad": {
    "fechaDisponible": "2025-01-01",
    "duracionMinimaContrato": 6
  },
  "imagenes": {
    "principal": "https://...",
    "galeria": ["https://..."]
  }
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Propiedad creada exitosamente",
  "data": {...}
}
```

## Filtros Especiales para Clientes

**ESTADO ACTUAL**: Todos los endpoints devuelven `501 Not Implemented` hasta que se complete la autenticación de clientes.

Los siguientes endpoints están completamente estructurados y documentados. Una vez implementada la autenticación de clientes, solo se necesita implementar la lógica en cada método del controlador.

### Resumen de Endpoints para Clientes

| Endpoint | Método | Autenticación | Estado | Descripción |
|----------|--------|---------------|--------|-------------|
| `/cliente/recomendaciones` | GET | Requerida | Esqueleto | Propiedades recomendadas por perfil |
| `/cliente/busqueda-avanzada` | GET | Opcional | Esqueleto | Búsqueda con filtros especiales |
| `/cliente/favoritos` | GET | Requerida | Esqueleto | Listar propiedades favoritas |
| `/cliente/favoritos/:id` | POST | Requerida | Esqueleto | Agregar a favoritos |
| `/cliente/favoritos/:id` | DELETE | Requerida | Esqueleto | Quitar de favoritos |
| `/cliente/vistas-recientes` | GET | Requerida | Esqueleto | Historial de vistas |
| `/cliente/compatibilidad-roommate` | GET | Opcional | Esqueleto | Búsqueda por compatibilidad |
| `/cliente/similares/:id` | GET | No | Esqueleto | Propiedades similares |
| `/cliente/busquedas-guardadas` | GET | Requerida | Esqueleto | Listar búsquedas guardadas |
| `/cliente/busquedas-guardadas` | POST | Requerida | Esqueleto | Guardar nueva búsqueda |
| `/cliente/comparar` | POST | No | Esqueleto | Comparar propiedades |
| `/cliente/mapa` | GET | No | Esqueleto | Vista optimizada para mapa |

### Pasos para Activar Estos Endpoints

1. **Implementar módulo de clientes**: Crear schema, autenticación y middleware
2. **Descomentar middleware**: En `routes/property.customer.routes.ts`
3. **Implementar lógica**: En cada método de `controllers/property.customer.controller.ts`
4. **Crear modelos adicionales**: Favoritos, búsquedas guardadas, historial de vistas
5. **Testing**: Validar cada endpoint

---

### 1. Recomendaciones Personalizadas

**Endpoint**: `GET /api/propiedades-renta/cliente/recomendaciones`
**Autenticación**: Requerida (cliente)
**Estado**: Esqueleto implementado

**Descripción**: Obtiene propiedades recomendadas basadas en el perfil del cliente autenticado.

**Parámetros del perfil del cliente** (obtenidos del token/sesión):
- `campus`: Campus al que asiste
- `presupuestoMaximo`: Presupuesto máximo mensual
- `genero`: Género del cliente
- `edad`: Edad del cliente
- `preferencias`: Objeto con preferencias (mascotas, amueblado, etc.)

**Query Parameters**:
- `limit`: Número de recomendaciones (default: 10, max: 50)
- `page`: Página de resultados

**Algoritmo de recomendación a implementar**:
1. Filtrar por compatibilidad de género
2. Filtrar por rango de edad
3. Filtrar por campus cercano
4. Filtrar por presupuesto
5. Priorizar por coincidencia de preferencias
6. Excluir propiedades ya aplicadas o rechazadas

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "recomendaciones": [...],
    "razonRecomendacion": {
      "propiedadId": "Cerca de tu campus y dentro de tu presupuesto"
    },
    "scoreCompatibilidad": {
      "propiedadId": 0.85
    }
  }
}
```

---

### 2. Búsqueda Avanzada

**Endpoint**: `GET /api/propiedades-renta/cliente/busqueda-avanzada`
**Autenticación**: Opcional (requerida para guardar búsquedas)
**Estado**: Esqueleto implementado

**Query Parameters especiales**:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `textoLibre` | string | Búsqueda en título y descripción | "cerca del tec" |
| `fechaMudanza` | date | Fecha deseada de entrada | "2025-02-01" |
| `tiempoMaximoTraslado` | number | Minutos máximos al campus | 30 |
| `requiereRoommate` | boolean | Si busca compartir con roommates | true |
| `estiloVida` | string[] | Estilo de vida | ["Estudiante"] |
| `amenidades` | string[] | Amenidades requeridas | ["Gym", "Lavandería"] |
| `guardarBusqueda` | boolean | Si se debe guardar esta búsqueda | true |
| `nombreBusqueda` | string | Nombre para búsqueda guardada | "Mi búsqueda" |

**Además acepta todos los filtros del endpoint público estándar**.

**Implementación Backend**:
```javascript
// Pseudo-código de cómo usar estos parámetros
if (req.query.textoLibre) {
  query.$text = { $search: req.query.textoLibre };
}

if (req.query.fechaMudanza) {
  query["disponibilidad.fechaDisponible"] = {
    $lte: new Date(req.query.fechaMudanza)
  };
}

if (req.query.tiempoMaximoTraslado) {
  query["ubicacion.tiempoTraslado"] = {
    $lte: req.query.tiempoMaximoTraslado
  };
}

if (req.query.amenidades && req.query.amenidades.length > 0) {
  query["servicios.listaServicios"] = {
    $all: req.query.amenidades
  };
}
```

---

### 3. Sistema de Favoritos

**Endpoints**:
- `GET /api/propiedades-renta/cliente/favoritos` - Listar favoritos
- `POST /api/propiedades-renta/cliente/favoritos/:propertyId` - Agregar
- `DELETE /api/propiedades-renta/cliente/favoritos/:propertyId` - Eliminar

**Autenticación**: Requerida (cliente)
**Estado**: Esqueleto implementado

**Modelo requerido** (a crear):
```javascript
{
  clienteId: ObjectId,
  propiedadId: ObjectId,
  fechaAgregado: Date,
  precioAlAgregar: Number, // Para detectar cambios
  notificacionesCambios: Boolean
}
```

**Funcionalidad al obtener favoritos**:
- Incluir información de cambios de precio
- Notificar si la disponibilidad cambió
- Ordenar por fecha de agregado o relevancia
- Paginación

---

### 4. Compatibilidad de Roommate

**Endpoint**: `GET /api/propiedades-renta/cliente/compatibilidad-roommate`
**Autenticación**: Opcional pero recomendada
**Estado**: Esqueleto implementado

**Query Parameters**:
- `soloCompatibles`: Boolean - Solo mostrar alta compatibilidad (score > 0.7)
- `mostrarScore`: Boolean - Incluir score numérico de compatibilidad

**Algoritmo de compatibilidad a implementar**:

```javascript
function calcularCompatibilidad(cliente, inquilinosActuales, politicasPropiedad) {
  let score = 1.0;

  // Compatibilidad de género
  if (politicasPropiedad.generoPreferido !== "Sin preferencia") {
    if (cliente.genero !== politicasPropiedad.generoPreferido) score *= 0.3;
  }

  // Compatibilidad de edad
  if (cliente.edad < politicasPropiedad.edadMinima ||
      cliente.edad > politicasPropiedad.edadMaxima) {
    score *= 0.1;
  }

  // Compatibilidad de hábitos
  if (politicasPropiedad.fumar && !cliente.preferencias.toleraFumadores) {
    score *= 0.5;
  }

  if (politicasPropiedad.fiestas && !cliente.preferencias.toleraFiestas) {
    score *= 0.6;
  }

  // Compatibilidad de mascotas
  if (cliente.tieneMascotas && !politicasPropiedad.mascotasPermitidas) {
    score = 0;
  }

  return score;
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "propiedades": [...],
    "compatibilidad": {
      "propiedadId": {
        "score": 0.85,
        "factores": {
          "genero": "compatible",
          "edad": "compatible",
          "habitos": "parcialmente compatible",
          "mascotas": "compatible"
        }
      }
    }
  }
}
```

---

### 5. Búsquedas Guardadas

**Endpoints**:
- `GET /api/propiedades-renta/cliente/busquedas-guardadas` - Listar
- `POST /api/propiedades-renta/cliente/busquedas-guardadas` - Guardar nueva

**Autenticación**: Requerida (cliente)
**Estado**: Esqueleto implementado

**Modelo requerido**:
```javascript
{
  clienteId: ObjectId,
  nombre: String,
  criterios: {
    // Todos los parámetros de búsqueda
  },
  alertasActivas: Boolean,
  fechaCreacion: Date,
  ultimaEjecucion: Date,
  resultadosAnteriores: Number
}
```

**Funcionalidad**:
- Al listar, ejecutar cada búsqueda y mostrar cantidad de nuevos resultados
- Permitir activar alertas por email/push cuando haya nuevas propiedades
- Editar o eliminar búsquedas guardadas

---

### 6. Comparación de Propiedades

**Endpoint**: `POST /api/propiedades-renta/cliente/comparar`
**Autenticación**: No requerida
**Estado**: Esqueleto implementado

**Body**:
```json
{
  "propiedadesIds": ["id1", "id2", "id3", "id4"]
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "comparacion": {
      "caracteristicas": {
        "precio": [5000, 6000, 5500, 7000],
        "banos": [1, 2, 1, 2],
        "recamaras": [1, 1, 2, 2],
        "amueblado": [true, true, false, true]
      },
      "mejorValor": "id3", // Basado en precio vs amenidades
      "masCercano": "id1", // Más cerca del campus
      "masBarato": "id1"
    }
  }
}
```

---

### 7. Vista de Mapa

**Endpoint**: `GET /api/propiedades-renta/cliente/mapa`
**Autenticación**: No requerida
**Estado**: Esqueleto implementado

**Query Parameters**:
- `latMin`, `latMax`, `lngMin`, `lngMax`: Bounds del mapa visible
- `zoom`: Nivel de zoom (1-20) para clustering
- Más todos los filtros estándar

**Funcionalidad**:
- Devolver solo información esencial para marcadores (reduce payload)
- Clustering automático de propiedades cercanas en zoom bajo
- Formato optimizado para Google Maps / Mapbox

**Requiere**: Geocodificación de direcciones (agregar lat/lng a schema)

---

### 8. Propiedades Similares

**Endpoint**: `GET /api/propiedades-renta/cliente/similares/:propertyId`
**Autenticación**: No requerida
**Estado**: Esqueleto implementado

**Query Parameters**:
- `limit`: Número de resultados (default: 10, max: 20)

**Algoritmo de similitud**:
1. Rango de precio ±20%
2. Mismo campus o zona cercana
3. Mismo tipo de propiedad o similar
4. Características similares (baños, recámaras)
5. Score de similitud basado en coincidencias

---

### 9. Historial de Vistas

**Endpoint**: `GET /api/propiedades-renta/cliente/vistas-recientes`
**Autenticación**: Requerida (cliente)
**Estado**: Esqueleto implementado

**Query Parameters**:
- `limit`: Número de vistas (default: 20, max: 50)

**Requiere**:
- Tracking de vistas por cliente (modelo o colección adicional)
- Timestamp de cada vista
- Limpieza periódica de vistas antiguas

---

## Esquema de Datos

### Campos Principales

- **Información Básica**: título, descripción, resumen
- **Tipo**: tipoPropiedad, tipoRenta
- **Preferencias**: generoPreferido, capacidadMaxima, edadMinima, edadMaxima
- **Dirección**: calle, número, colonia, ciudad, estado, codigoPostal
- **Características**: metrosCuadrados, numeroBanos, numeroRecamaras, amueblado, muebles, mascotasPermitidas
- **Servicios**: serviciosIncluidos, listaServicios, costoServicios
- **Políticas**: reglasConvivencia, horarioVisitas, fiestas, fumar, alcohol
- **Ubicación**: campus, distanciaCampus, transporte, tiempoTraslado
- **Financiero**: precioMensual, deposito, comisionAgencia, incrementoAnual, descuentos
- **Disponibilidad**: fechaDisponible, duracionMinimaContrato, disponible
- **Multimedia**: imagenes (principal, galeria, tour360)
- **Estadísticas**: calificacion, numeroReviews, vistas, favoritos
- **Estado**: estado, verificada, destacada

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. El arrendador debe iniciar sesión y obtener un token
2. El token debe incluirse en el header `Authorization: Bearer <token>`
3. El middleware `authenticateArrendador` verifica el token
4. El middleware `verificarPropiedadPropiedad` verifica la propiedad de recursos

## Validación

Todas las operaciones están protegidas por validación Zod:

- **PropiedadCreacionSchema**: Validación estricta para crear propiedades
- **PropiedadActualizacionSchema**: Validación flexible para actualizaciones parciales
- **PropiedadFiltrosSchema**: Validación de parámetros de búsqueda

## Próximos Pasos

Para completar el sistema CRUD y filtros especiales:

### Prioridad Alta

1. **Implementar UPDATE**:
   - Editar `controllers/property.update.controller.ts`
   - Agregar middleware de verificación de propiedad a las rutas
   - Implementar métodos de actualización

2. **Implementar DELETE**:
   - Editar `controllers/property.delete.controller.ts`
   - Agregar verificaciones de seguridad
   - Implementar soft delete y restauración

### Prioridad Media - Depende de Módulo de Clientes

3. **Activar Filtros Especiales para Clientes** (ver sección "Filtros Especiales para Clientes"):
   - **Paso 1**: Implementar módulo de autenticación de clientes
     - Crear schema de Cliente
     - Implementar middleware `authenticateCliente`
     - Sistema de JWT para clientes

   - **Paso 2**: Crear modelos auxiliares
     - Modelo de Favoritos (Cliente-Propiedad)
     - Modelo de Búsquedas Guardadas
     - Modelo de Historial de Vistas

   - **Paso 3**: Implementar lógica en controladores
     - Descomentar middleware en `routes/property.customer.routes.ts`
     - Implementar cada método en `controllers/property.customer.controller.ts`
     - Seguir las especificaciones en los comentarios TODO

   - **Paso 4**: Funcionalidades avanzadas
     - Algoritmo de recomendaciones personalizadas
     - Sistema de compatibilidad de roommates
     - Geocodificación para vista de mapa
     - Sistema de alertas para búsquedas guardadas

4. **Integrar funcionalidad adicional para Inquilinos**:
   - Sistema de aplicaciones a propiedades
   - Gestión de contratos activos
   - Sistema de mensajería con arrendadores
   - Reviews y calificaciones

### Prioridad Baja

5. **Testing**:
   - Tests unitarios para cada controlador
   - Tests de integración para endpoints
   - Tests de seguridad y autenticación
   - Tests de performance para búsquedas

6. **Optimizaciones**:
   - Índices de MongoDB para búsquedas
   - Caché para recomendaciones
   - Paginación cursor-based para mejor performance
   - Rate limiting en endpoints públicos

7. **Documentación adicional**:
   - Colección de Postman/Insomnia
   - Swagger/OpenAPI specification
   - Guías de uso para frontend
   - Ejemplos de integración
