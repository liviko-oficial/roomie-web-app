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
**Estado**: Pendiente - esperando implementación completa del módulo de clientes/inquilinos

Funcionalidades planeadas para cuando el módulo de clientes esté implementado:
- Endpoints específicos para inquilinos autenticados
- Visualización de propiedades aplicadas
- Historial de aplicaciones y rentas
- Sistema de favoritos personalizados
- Recomendaciones basadas en preferencias del inquilino
- Gestión de contratos activos desde la perspectiva del inquilino
- Sistema de mensajería entre inquilino y arrendador

**Nota**: Esta funcionalidad se integrará una vez que el sistema de clientes/inquilinos esté completamente implementado para mantener consistencia en la arquitectura.

## Estructura de Archivos

```
rentalProperty/
├── controllers/
│   ├── property.controller.ts          # CREATE y READ implementados
│   ├── property.update.controller.ts   # TODO: UPDATE
│   └── property.delete.controller.ts   # TODO: DELETE
├── routes/
│   ├── index.ts                        # Exportación de rutas
│   └── property.routes.ts              # Definición de endpoints
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

Para completar el sistema CRUD:

1. **Implementar UPDATE**:
   - Editar `controllers/property.update.controller.ts`
   - Agregar middleware de verificación de propiedad a las rutas
   - Implementar métodos de actualización

2. **Implementar DELETE**:
   - Editar `controllers/property.delete.controller.ts`
   - Agregar verificaciones de seguridad
   - Implementar soft delete y restauración

3. **Integrar funcionalidad para Inquilinos/Clientes**:
   - Esperar a que el módulo de clientes esté completamente implementado
   - Crear endpoints específicos para inquilinos autenticados
   - Implementar sistema de aplicaciones y favoritos
   - Integrar gestión de contratos y mensajería

4. **Testing**:
   - Crear tests de integración
   - Validar todos los endpoints
   - Verificar seguridad y autenticación

5. **Documentación adicional**:
   - Ejemplos de uso con Postman/Insomnia
   - Swagger/OpenAPI specification
