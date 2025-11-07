# Propiedades de Renta - Documentación

Esta documentación describe el módulo de propiedades de renta para el sistema Liviko.

## Estructura del Módulo

```
rentalProperty/
├── models/
│   ├── index.ts                    # Exportaciones principales de modelos
│   ├── rentalProperty.schema.ts    # Esquema principal de MongoDB y Zod
│   └── propiedadAuth.schema.ts     # Validaciones para creación/actualización
├── lib/
│   └── constants.ts                # Constantes y configuraciones del sistema
├── test/                           # Tests existentes
├── index.ts                        # Punto de entrada principal del módulo
└── docs.md                         # Esta documentación
```

## Mejoras Implementadas

### Problemas del Modelo Anterior
- Errores tipográficos: "rateting", "imgPrincipal", "prodived", "caraters", "exided"
- Validación incorrecta: `.refine((n) => n.toFixed(2))` no validaba correctamente
- Estructura desorganizada: archivos sin patrón de organización
- Falta de relaciones: propertyOwner comentado, sin conexión con arrendadores
- Enums inconsistentes: mezcla de español e inglés, conflictos con otros modelos
- Campos faltantes: sin dirección estructurada, sin timestamps, sin estado
- MongoDB mal configurado: colecciones dinámicas, modelo inadecuado

### Soluciones Implementadas

#### 1. Estructura Organizada
- Separación clara entre esquemas de autenticación, esquemas principales y constantes
- Nomenclatura consistente en español, sin errores tipográficos
- Archivos de índice para facilitar importaciones
- Documentación clara en cada sección

#### 2. Validación Robusta
- Esquemas Zod apropiados con validación funcional
- Validaciones cruzadas: edadMinima menor o igual a edadMaxima, duraciones de contrato consistentes
- Validaciones de negocio: mascotas permitidas requiere especificar tipos, servicios incluidos requiere lista
- Rangos apropiados para precios, distancias y capacidades

#### 3. Modelo de Datos Completo
- Dirección estructurada: calle, colonia, ciudad, estado, código postal
- Características detalladas: metros cuadrados, baños, recámaras, muebles
- Servicios organizados: lista predefinida con costos opcionales
- Políticas definidas: reglas de convivencia, horarios, restricciones
- Información financiera: precios, depósitos, descuentos, incrementos
- Disponibilidad: fechas, duraciones de contrato, renovación automática

#### 4. Relaciones Apropiadas
- Propietario: referencia correcta a Arrendador
- Inquilinos actuales: array de referencias a User
- Aplicaciones: sistema de solicitudes de renta
- Historial: seguimiento de inquilinos anteriores

#### 5. Estados y Metadata
- Estados definidos: Activa, Inactiva, Rentada, En mantenimiento, Pausada
- Sistema de verificación de propiedades
- Propiedades destacadas
- Estadísticas: calificaciones, reseñas, vistas, favoritos

#### 6. MongoDB Apropiado
- Subdocumentos: estructura anidada para datos relacionados
- Validaciones de base de datos: restricciones a nivel de BD
- Referencias para optimización de consultas
- Middleware: actualización automática de fechaActualizacion

## Esquemas Disponibles

### PropiedadRentaSchema (Principal)
Esquema completo para propiedades de renta con todas las validaciones y subdocumentos.

### PropiedadCreacionSchema (Validación)
Validación para crear nuevas propiedades que incluye:
- Validaciones de formato para URLs, códigos postales y caracteres especiales
- Rangos apropiados para precios y capacidades
- Validaciones cruzadas para consistencia de datos
- Mensajes de error en español

### PropiedadActualizacionSchema (Validación)
Versión parcial del esquema de creación para actualizaciones flexibles.

### PropiedadFiltrosSchema (Búsqueda)
Validación para parámetros de búsqueda y filtrado que incluye:
- Filtros por tipo, precio y ubicación
- Paginación con límites
- Opciones de ordenamiento
- Validaciones de rangos de búsqueda

## Constantes Organizadas

### Enums Consistentes
```typescript
TIPOS_PROPIEDAD: "Casa" | "Departamento" | "Cuarto" | "Studio" | "Loft"
GENERO_PREFERIDO: "Solo hombres" | "Solo mujeres" | "Mixto" | "Sin preferencia"
ESTADOS_PROPIEDAD: "Activa" | "Inactiva" | "Rentada" | "En mantenimiento"
```

### Límites del Sistema
```typescript
MAX_PRECIO_MENSUAL: 100000  // $100,000 MXN
MAX_CAPACIDAD: 20           // 20 personas
MAX_DISTANCIA_CAMPUS: 100   // 100 km
MAX_IMAGENES_GALERIA: 20    // 20 imágenes
```

### Configuraciones por Defecto
```typescript
DEFAULTS: {
  CAMPUS: "Guadalajara",
  GENERO_PREFERIDO: "Sin preferencia",
  EDAD_MINIMA: 18,
  DURACION_CONTRATO: 6, // meses
}
```

## Integración con Otros Módulos

### Compatibilidad con Arrendador
- Referencias correctas a ArrendadorDB
- Enums consistentes con sistema de arrendadores
- Misma estructura de validación y organización

### Compatibilidad con User
- Referencias a inquilinos actuales e históricos
- Sistema de aplicaciones para solicitudes de renta
- Integración con sistema de favoritos

### Preparado para CRUD
- Esquemas listos para controllers
- Validaciones preparadas para routes
- Constantes organizadas para middlewares
- Tipos TypeScript para servicios

## Próximos Pasos

Con esta estructura, el módulo está preparado para:

1. Controllers: Crear, leer, actualizar, eliminar propiedades
2. Routes: Endpoints organizados con validaciones
3. Middleware: Autenticación, autorización, validación
4. Services: Lógica de negocio para búsquedas y filtros
5. Tests: Suite de pruebas con datos consistentes

## Beneficios de la Refactorización

- Mantenibilidad: Código organizado y documentado
- Escalabilidad: Estructura preparada para expansión
- Consistencia: Mismos patrones que módulo de Arrendador
- Robustez: Validaciones completas y manejo de errores
- Experiencia de desarrollo: Imports claros, tipos TypeScript, documentación
- Rendimiento: Estructura optimizada para MongoDB