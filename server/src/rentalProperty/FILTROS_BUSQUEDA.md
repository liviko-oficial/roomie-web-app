# Guía Completa de Filtros de Búsqueda - Sistema de Propiedades

## Introducción

Este documento describe todos los filtros y parámetros disponibles para buscar propiedades en el sistema Liviko. Los endpoints están diseñados para clientes/estudiantes que buscan alojamiento.

---

## Endpoints Disponibles

### 1. Catálogo Principal (Homepage)
**Endpoint:** `GET /api/propiedades-renta/catalogo`
**Autenticación:** Opcional (mejora la experiencia si está autenticado)

### 2. Búsqueda Avanzada
**Endpoint:** `GET /api/propiedades-renta/buscar`
**Autenticación:** No requerida

### 3. Filtro Rápido por Campus
**Endpoint:** `GET /api/propiedades-renta/campus/:campus`
**Autenticación:** No requerida

### 4. Propiedades Similares
**Endpoint:** `GET /api/propiedades-renta/:propertyId/similares`
**Autenticación:** No requerida

---

## Parámetros de Búsqueda Avanzada

### Filtros de Ubicación

#### `campus`
**Tipo:** String
**Valores permitidos:**
- `"Guadalajara"`
- `"Monterrey"`
- `"Ciudad de México"`
- `"Otro"`

**Descripción:** Filtra propiedades por campus del Tec de Monterrey.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?campus=Guadalajara
```

---

#### `distanciaMaxima`
**Tipo:** Number
**Unidad:** Kilómetros
**Rango:** 0 - 50 (recomendado)

**Descripción:** Filtra propiedades que estén a una distancia máxima del campus (en km).

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?campus=Guadalajara&distanciaMaxima=3
```

---

### Filtros de Tipo de Propiedad

#### `tipoPropiedad`
**Tipo:** String
**Valores permitidos:**
- `"Casa"`
- `"Departamento"`
- `"Cuarto"`
- `"Studio"`
- `"Loft"`
- `"Casa de huéspedes"`

**Descripción:** Filtra por el tipo de inmueble.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?tipoPropiedad=Departamento
```

---

#### `tipoRenta`
**Tipo:** String
**Valores permitidos:**
- `"Propiedad completa"`
- `"Cuarto privado"`
- `"Cuarto compartido"`
- `"Cama en dormitorio"`

**Descripción:** Filtra por el tipo de arrendamiento.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?tipoRenta=Cuarto privado
```

**Casos de uso:**
- **Propiedad completa:** Estudiante busca rentar todo un departamento/casa para él y compañeros
- **Cuarto privado:** Estudiante busca habitación propia en propiedad compartida
- **Cuarto compartido:** Comparte habitación con otro estudiante
- **Cama en dormitorio:** Estilo dormitorio compartido (múltiples camas)

---

### Filtros de Precio

#### `precioMinimo`
**Tipo:** Number
**Unidad:** Pesos mexicanos (MXN)
**Rango:** 0 - 100,000

**Descripción:** Precio mínimo mensual de renta.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?precioMinimo=3000
```

---

#### `precioMaximo`
**Tipo:** Number
**Unidad:** Pesos mexicanos (MXN)
**Rango:** 0 - 100,000

**Descripción:** Precio máximo mensual de renta.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?precioMaximo=6000
```

---

**Búsqueda por rango de precio:**
```
GET /api/propiedades-renta/buscar?precioMinimo=3000&precioMaximo=6000
```

---

### Filtros de Características

#### `amueblado`
**Tipo:** Boolean
**Valores permitidos:** `true` | `false`

**Descripción:** Filtra por propiedades amuebladas.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?amueblado=true
```

---

#### `mascotasPermitidas`
**Tipo:** Boolean
**Valores permitidos:** `true` | `false`

**Descripción:** Filtra por propiedades que permiten mascotas.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?mascotasPermitidas=true
```

---

#### `serviciosIncluidos`
**Tipo:** Boolean
**Valores permitidos:** `true` | `false`

**Descripción:** Filtra por propiedades con servicios (agua, luz, internet, etc.) incluidos en el precio.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?serviciosIncluidos=true
```

---

#### `numeroBanos`
**Tipo:** Number
**Rango:** 1 - 10

**Descripción:** Número **mínimo** de baños requeridos.

**Importante:** Este filtro busca propiedades con **al menos** el número especificado de baños.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?numeroBanos=2
```
Resultado: Propiedades con 2 o más baños.

---

#### `numeroRecamaras`
**Tipo:** Number
**Rango:** 1 - 10

**Descripción:** Número **mínimo** de recámaras requeridas.

**Importante:** Este filtro busca propiedades con **al menos** el número especificado de recámaras.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?numeroRecamaras=3
```
Resultado: Propiedades con 3 o más recámaras.

---

### Filtros de Preferencias

#### `generoPreferido`
**Tipo:** String
**Valores permitidos:**
- `"Solo hombres"`
- `"Solo mujeres"`
- `"Mixto"`
- `"Sin preferencia"`

**Descripción:** Preferencia de género de los inquilinos que el arrendador acepta.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?generoPreferido=Mixto
```

---

### Parámetros de Paginación

#### `page`
**Tipo:** Number
**Valor por defecto:** 1
**Rango:** 1 - ∞

**Descripción:** Número de página actual.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?page=2
```

---

#### `limit`
**Tipo:** Number
**Valor por defecto:** 20
**Máximo:** 100

**Descripción:** Número de resultados por página.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?limit=50
```

---

### Parámetros de Ordenamiento

#### `ordenarPor`
**Tipo:** String
**Valores permitidos:**
- `"precio_asc"` - Precio ascendente (menor a mayor)
- `"precio_desc"` - Precio descendente (mayor a menor)
- `"distancia"` - Distancia al campus (menor a mayor)
- `"calificacion"` - Calificación (mayor a menor)
- `"fecha_desc"` - Fecha de publicación (más reciente primero)

**Valor por defecto:** Destacadas primero, luego por calificación y fecha.

**Ejemplo:**
```
GET /api/propiedades-renta/buscar?ordenarPor=precio_asc
```

---

## Ejemplos de Uso Completos

### Caso 1: Estudiante Busca Departamento Amueblado en Guadalajara

**Requisitos:**
- Campus Guadalajara
- Tipo: Departamento
- Amueblado
- Presupuesto: $4,000 - $7,000 MXN
- Con mascotas

**Request:**
```http
GET /api/propiedades-renta/buscar?campus=Guadalajara&tipoPropiedad=Departamento&amueblado=true&precioMinimo=4000&precioMaximo=7000&mascotasPermitidas=true&ordenarPor=precio_asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "propiedades": [
      {
        "_id": "64abc123...",
        "titulo": "Departamento amueblado cerca del Tec",
        "tipoPropiedad": "Departamento",
        "ubicacion": {
          "campus": "Guadalajara",
          "distanciaCampus": 1.5
        },
        "informacionFinanciera": {
          "precioMensual": 5500
        },
        "caracteristicas": {
          "amueblado": true,
          "mascotasPermitidas": true,
          "numeroRecamaras": 2,
          "numeroBanos": 1
        }
      }
    ],
    "filtrosAplicados": {
      "campus": "Guadalajara",
      "tipoPropiedad": "Departamento",
      "amueblado": "true",
      "precioMinimo": "4000",
      "precioMaximo": "7000",
      "mascotasPermitidas": "true",
      "ordenarPor": "precio_asc"
    },
    "totalResultados": 12,
    "paginacion": {
      "paginaActual": 1,
      "totalPaginas": 1,
      "totalPropiedades": 12,
      "propiedadesPorPagina": 20,
      "tieneSiguiente": false,
      "tieneAnterior": false
    }
  }
}
```

---

### Caso 2: Cuarto Privado Económico en Monterrey

**Requisitos:**
- Campus Monterrey
- Tipo de renta: Cuarto privado
- Presupuesto máximo: $3,500 MXN
- Servicios incluidos

**Request:**
```http
GET /api/propiedades-renta/buscar?campus=Monterrey&tipoRenta=Cuarto privado&precioMaximo=3500&serviciosIncluidos=true&ordenarPor=distancia
```

---

### Caso 3: Casa Grande para Compartir con Amigos

**Requisitos:**
- Campus Ciudad de México
- Tipo: Casa
- Mínimo 4 recámaras
- Mínimo 2 baños
- Presupuesto: hasta $15,000 MXN

**Request:**
```http
GET /api/propiedades-renta/buscar?campus=Ciudad de México&tipoPropiedad=Casa&numeroRecamaras=4&numeroBanos=2&precioMaximo=15000&ordenarPor=precio_asc
```

---

### Caso 4: Solo Mujeres, Cerca del Campus

**Requisitos:**
- Campus Guadalajara
- Preferencia de género: Solo mujeres
- Máximo 2 km del campus
- Servicios incluidos

**Request:**
```http
GET /api/propiedades-renta/buscar?campus=Guadalajara&generoPreferido=Solo mujeres&distanciaMaxima=2&serviciosIncluidos=true
```

---

## Catálogo Homepage con Personalización

### Endpoint: `GET /api/propiedades-renta/catalogo`

**Características especiales:**
- Si el usuario está **autenticado**, el sistema detecta su campus desde `user.preferences.campus`
- Prioriza propiedades del campus del usuario
- Si no hay suficientes propiedades del campus del usuario, rellena con otras
- Si no está autenticado, muestra todas ordenadas por popularidad

**Ejemplo - Usuario Autenticado:**
```http
GET /api/propiedades-renta/catalogo?page=1&limit=20
Headers: { Authorization: "Bearer <token>" }
```

**Response con personalización:**
```json
{
  "success": true,
  "data": {
    "propiedades": [ /* Guadalajara primero */ ],
    "userCampus": "Guadalajara",
    "sugerenciasPersonalizadas": true,
    "paginacion": { ... }
  }
}
```

**Ejemplo - Usuario No Autenticado:**
```http
GET /api/propiedades-renta/catalogo?page=1&limit=20
```

**Response sin personalización:**
```json
{
  "success": true,
  "data": {
    "propiedades": [ /* Todas por popularidad */ ],
    "userCampus": null,
    "sugerenciasPersonalizadas": false,
    "paginacion": { ... }
  }
}
```

---

## Filtro Rápido por Campus

### Endpoint: `GET /api/propiedades-renta/campus/:campus`

**Uso:** Botones de filtro rápido en la interfaz.

**Parámetros de URL:**
- `:campus` - Uno de: `Guadalajara`, `Monterrey`, `Ciudad de México`, `Otro`

**Query params opcionales:**
- `page` - Número de página
- `limit` - Resultados por página
- `ordenarPor` - Ordenamiento

**Ejemplos:**
```http
GET /api/propiedades-renta/campus/Guadalajara
GET /api/propiedades-renta/campus/Monterrey?ordenarPor=precio_asc
GET /api/propiedades-renta/campus/Ciudad de México?page=2&limit=30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campus": "Guadalajara",
    "propiedades": [ ... ],
    "total": 47,
    "paginacion": { ... }
  }
}
```

---

## Algoritmo de Propiedades Similares

### Endpoint: `GET /api/propiedades-renta/:propertyId/similares`

**Uso:** Sección "Propiedades similares" en página de detalle.

**Parámetros:**
- `limit` - Número de sugerencias (default: 6, max: 20)

**Algoritmo de Similitud (Score 0-100):**

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| Precio similar (±20%) | 40 | Diferencia de precio dentro del 20% |
| Mismo tipo de propiedad | 20 | Casa, Departamento, etc. |
| Mismo tipo de renta | 10 | Completa, Cuarto privado, etc. |
| Mismo número de baños | 10 | Exactamente iguales |
| Mismo número de recámaras | 10 | Exactamente iguales |
| Amueblado igual | 5 | Bonus si ambas tienen mismo estado |
| Servicios incluidos igual | 5 | Bonus si ambas tienen mismo estado |

**Requisitos obligatorios:**
- Mismo campus (obligatorio)
- Precio dentro de ±20%
- Activa y disponible

**Ejemplo:**
```http
GET /api/propiedades-renta/64abc123def456/similares?limit=6
```

**Response:**
```json
{
  "success": true,
  "data": {
    "propiedadOriginal": {
      "_id": "64abc123def456",
      "titulo": "Departamento 2 recámaras Guadalajara",
      "campus": "Guadalajara",
      "precio": 5000
    },
    "similares": [
      {
        "_id": "64xyz789abc123",
        "titulo": "Departamento amueblado cerca TEC",
        "informacionFinanciera": {
          "precioMensual": 5200
        },
        "scoreSimitud": 87.5,
        "razonSimilitud": "Precio muy similar, Mismo tipo (Departamento), Mismo número de recámaras"
      },
      {
        "_id": "64def456ghi789",
        "titulo": "Depa 2 hab 1 baño Guadalajara",
        "informacionFinanciera": {
          "precioMensual": 4800
        },
        "scoreSimitud": 82.0,
        "razonSimilitud": "Precio similar, Mismo tipo (Departamento), Mismo número de baños"
      }
    ],
    "total": 6
  }
}
```

---

## Notas Técnicas Importantes

### 1. Propiedades Mostradas
**Siempre se filtran automáticamente por:**
- `estado: "Activa"`
- `disponibilidad.disponible: true`

**No se mostrarán propiedades:**
- Inactivas
- Rentadas
- En mantenimiento
- Pausadas
- No disponibles

---

### 2. Valores Booleanos en Query Params
Los valores booleanos se pasan como strings:
- `true` → Activar filtro
- `false` → Desactivar filtro
- No incluir el parámetro → Ignorar filtro

**Correcto:**
```
?amueblado=true&mascotasPermitidas=false
```

**Incorrecto:**
```
?amueblado=1&mascotasPermitidas=0  ❌
```

---

### 3. Límite de Resultados
- **Default:** 20 por página
- **Máximo:** 100 por página
- Si se solicita más de 100, se limitará automáticamente a 100

---

### 4. Ordenamiento por Defecto
Si no se especifica `ordenarPor`:
1. Propiedades destacadas primero
2. Mayor calificación
3. Más recientes

---

### 5. Campos Excluidos
Por privacidad y optimización, los siguientes campos **NO** se incluyen en las respuestas:
- `historialInquilinos`
- `aplicaciones`

---

## Combinación de Filtros

Todos los filtros se pueden combinar libremente. El sistema aplicará **AND** lógico (todas las condiciones deben cumplirse).

**Ejemplo combinado completo:**
```http
GET /api/propiedades-renta/buscar?campus=Guadalajara&tipoPropiedad=Departamento&tipoRenta=Cuarto privado&precioMinimo=3000&precioMaximo=5000&amueblado=true&mascotasPermitidas=true&serviciosIncluidos=true&numeroBanos=1&numeroRecamaras=2&generoPreferido=Mixto&distanciaMaxima=3&page=1&limit=20&ordenarPor=precio_asc
```

---

## Mensajes de Error Comunes

### Campus Inválido
**Status:** 400 Bad Request
```json
{
  "success": false,
  "message": "Campus inválido. Debe ser uno de: Guadalajara, Monterrey, Ciudad de México, Otro"
}
```

### Propiedad No Encontrada (para similares)
**Status:** 404 Not Found
```json
{
  "success": false,
  "message": "Propiedad no encontrada"
}
```

### Error del Servidor
**Status:** 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error al buscar propiedades",
  "error": "Detalles del error"
}
```

---

## Casos de Uso por Tipo de Usuario

### Estudiante de Primer Semestre
**Necesidades típicas:**
- Cuarto privado o compartido
- Presupuesto limitado ($2,500 - $4,000)
- Servicios incluidos
- Cerca del campus (máx 2km)

**Filtros recomendados:**
```
tipoRenta=Cuarto privado
precioMaximo=4000
serviciosIncluidos=true
distanciaMaxima=2
ordenarPor=precio_asc
```

---

### Estudiante con Compañeros
**Necesidades típicas:**
- Propiedad completa (Casa o Departamento)
- 3-4 recámaras
- Amueblado
- Presupuesto compartido ($8,000 - $15,000)

**Filtros recomendados:**
```
tipoRenta=Propiedad completa
numeroRecamaras=3
amueblado=true
precioMinimo=8000&precioMaximo=15000
```

---

### Estudiante con Mascota
**Necesidades críticas:**
- Mascotas permitidas
- Resto de filtros flexibles

**Filtros recomendados:**
```
mascotasPermitidas=true
campus=Guadalajara
precioMaximo=6000
ordenarPor=distancia
```

---

## Integración con Frontend

### Ejemplo React/Next.js

```typescript
// Función de búsqueda
async function buscarPropiedades(filtros: FiltrosBusqueda) {
  const params = new URLSearchParams();

  // Agregar filtros solo si están definidos
  if (filtros.campus) params.append('campus', filtros.campus);
  if (filtros.precioMinimo) params.append('precioMinimo', filtros.precioMinimo.toString());
  if (filtros.precioMaximo) params.append('precioMaximo', filtros.precioMaximo.toString());
  if (filtros.amueblado !== undefined) params.append('amueblado', filtros.amueblado.toString());
  if (filtros.mascotasPermitidas !== undefined) params.append('mascotasPermitidas', filtros.mascotasPermitidas.toString());
  if (filtros.page) params.append('page', filtros.page.toString());
  if (filtros.ordenarPor) params.append('ordenarPor', filtros.ordenarPor);

  const response = await fetch(`/api/propiedades-renta/buscar?${params.toString()}`);
  return response.json();
}

// Uso
const resultados = await buscarPropiedades({
  campus: 'Guadalajara',
  precioMaximo: 6000,
  amueblado: true,
  mascotasPermitidas: true,
  ordenarPor: 'precio_asc',
  page: 1
});
```

---

## Rendimiento y Optimización

### Recomendaciones:
1. **Límite razonable:** Usar `limit=20` para buena UX
2. **Paginación:** Implementar scroll infinito o paginación tradicional
3. **Cache:** Cachear resultados en cliente (5-10 minutos)
4. **Debounce:** Esperar 300-500ms después de cambios en filtros antes de buscar
5. **Filtros progresivos:** Mostrar contador de resultados al cambiar filtros

---

## Conclusión

Este sistema de filtros proporciona flexibilidad completa para que los estudiantes encuentren exactamente lo que necesitan. Los filtros se pueden combinar libremente, y el sistema de búsqueda está optimizado para rendimiento y relevancia.

**Documentación completa:** `IMPLEMENTATION_SUMMARY.md`
**Fecha:** 2025-11-08
**Versión:** 1.0
