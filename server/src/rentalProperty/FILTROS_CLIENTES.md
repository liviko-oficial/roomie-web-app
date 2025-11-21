# Filtros Especiales para Clientes - Guía de Implementación

## Estado Actual

**IMPLEMENTADO**: Estructura completa y documentación
**PENDIENTE**: Lógica de negocio (requiere autenticación de clientes)
**RESPUESTA ACTUAL**: Todos los endpoints devuelven `501 Not Implemented`

## Archivos Creados

- ✅ `controllers/property.customer.controller.ts` - 12 métodos con TODOs en español
- ✅ `routes/property.customer.routes.ts` - 12 rutas definidas y documentadas
- ✅ Integrado en `routes/index.ts`
- ✅ Exportado en `index.ts` del módulo
- ✅ Documentación completa en `README.md`

## Endpoints Disponibles (Skeleton)

### 1. Recomendaciones Personalizadas
```
GET /api/propiedades-renta/cliente/recomendaciones
```
Requiere autenticación de cliente. Devuelve propiedades basadas en perfil del usuario.

### 2. Búsqueda Avanzada
```
GET /api/propiedades-renta/cliente/busqueda-avanzada
```
Filtros especiales:
- `textoLibre`: Búsqueda de texto completo
- `fechaMudanza`: Fecha deseada de entrada
- `tiempoMaximoTraslado`: Minutos máximos al campus
- `requiereRoommate`: Búsqueda con roommates
- `estiloVida`: Estilo de vida preferido
- `amenidades`: Amenidades específicas
- `guardarBusqueda`: Guardar criterios

### 3. Sistema de Favoritos
```
GET    /api/propiedades-renta/cliente/favoritos
POST   /api/propiedades-renta/cliente/favoritos/:propertyId
DELETE /api/propiedades-renta/cliente/favoritos/:propertyId
```

### 4. Compatibilidad de Roommate
```
GET /api/propiedades-renta/cliente/compatibilidad-roommate
```
Calcula score de compatibilidad basado en:
- Género
- Edad
- Hábitos (fumar, alcohol, fiestas)
- Mascotas

### 5. Búsquedas Guardadas
```
GET  /api/propiedades-renta/cliente/busquedas-guardadas
POST /api/propiedades-renta/cliente/busquedas-guardadas
```
Permite guardar criterios de búsqueda y recibir alertas.

### 6. Comparación de Propiedades
```
POST /api/propiedades-renta/cliente/comparar
```
Body: `{ "propiedadesIds": ["id1", "id2", "id3"] }`

### 7. Vista de Mapa
```
GET /api/propiedades-renta/cliente/mapa
```
Parámetros: `latMin`, `latMax`, `lngMin`, `lngMax`, `zoom`

### 8. Propiedades Similares
```
GET /api/propiedades-renta/cliente/similares/:propertyId
```
No requiere autenticación.

### 9. Historial de Vistas
```
GET /api/propiedades-renta/cliente/vistas-recientes
```
Últimas propiedades vistas por el cliente.

## Cómo Activar Estos Endpoints

### Paso 1: Implementar Autenticación de Clientes
```typescript
// Crear: src/cliente/middleware/auth.middleware.ts
export const authenticateCliente = async (req, res, next) => {
  // Verificar JWT del cliente
  // Adjuntar cliente a req.cliente
  next();
};
```

### Paso 2: Descomentar Middleware en Rutas
```typescript
// En: src/rentalProperty/routes/property.customer.routes.ts
import { authenticateCliente } from "../../cliente/middleware/auth.middleware";

router.get(
  "/recomendaciones",
  authenticateCliente, // <-- Descomentar
  PropertyCustomerController.obtenerRecomendaciones
);
```

### Paso 3: Implementar Lógica en Controladores
```typescript
// En: src/rentalProperty/controllers/property.customer.controller.ts
static async obtenerRecomendaciones(req: Request, res: Response) {
  const clienteId = req.cliente?.id;
  const cliente = await ClienteDB.findById(clienteId);

  // Implementar algoritmo de recomendación
  const propiedades = await PropiedadRentaDB.find({
    "ubicacion.campus": cliente.campus,
    "informacionFinanciera.precioMensual": { $lte: cliente.presupuestoMaximo }
  });

  // Calcular scores de compatibilidad
  // Ordenar por relevancia
  // Devolver resultados

  return res.json({ success: true, data: propiedades });
}
```

### Paso 4: Crear Modelos Auxiliares

**Modelo de Favoritos:**
```typescript
const FavoritoSchema = new Schema({
  clienteId: { type: ObjectId, ref: 'Cliente', required: true },
  propiedadId: { type: ObjectId, ref: 'PropiedadRenta', required: true },
  fechaAgregado: { type: Date, default: Date.now },
  precioAlAgregar: Number,
  notificacionesCambios: { type: Boolean, default: true }
});
```

**Modelo de Búsquedas Guardadas:**
```typescript
const BusquedaGuardadaSchema = new Schema({
  clienteId: { type: ObjectId, ref: 'Cliente', required: true },
  nombre: { type: String, required: true },
  criterios: Schema.Types.Mixed,
  alertasActivas: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now },
  ultimaEjecucion: Date,
  resultadosAnteriores: Number
});
```

**Modelo de Historial de Vistas:**
```typescript
const VistaSchema = new Schema({
  clienteId: { type: ObjectId, ref: 'Cliente', required: true },
  propiedadId: { type: ObjectId, ref: 'PropiedadRenta', required: true },
  fechaVista: { type: Date, default: Date.now }
});
// Índice: { clienteId: 1, fechaVista: -1 }
```

## Algoritmos Sugeridos

### Algoritmo de Recomendaciones
```javascript
function calcularScoreRecomendacion(propiedad, cliente) {
  let score = 0;

  // Campus (peso 30%)
  if (propiedad.ubicacion.campus === cliente.campus) {
    score += 30;
  }

  // Precio (peso 25%)
  if (propiedad.informacionFinanciera.precioMensual <= cliente.presupuestoMaximo) {
    const porcentajePrecio = propiedad.informacionFinanciera.precioMensual / cliente.presupuestoMaximo;
    score += 25 * (1 - porcentajePrecio * 0.5); // Mejor score para precios más bajos
  }

  // Compatibilidad de género (peso 20%)
  if (propiedad.generoPreferido === "Sin preferencia" ||
      propiedad.generoPreferido === cliente.genero) {
    score += 20;
  }

  // Edad (peso 15%)
  if (cliente.edad >= propiedad.edadMinima &&
      cliente.edad <= propiedad.edadMaxima) {
    score += 15;
  }

  // Preferencias adicionales (peso 10%)
  if (cliente.preferencias.amueblado === propiedad.caracteristicas.amueblado) {
    score += 5;
  }
  if (cliente.tieneMascotas && propiedad.caracteristicas.mascotasPermitidas) {
    score += 5;
  }

  return score; // 0-100
}
```

### Algoritmo de Búsqueda de Texto Completo
```javascript
// Crear índice de texto en MongoDB
PropiedadRentaDB.collection.createIndex({
  titulo: "text",
  descripcion: "text",
  "direccion.colonia": "text"
});

// En la búsqueda
if (req.query.textoLibre) {
  query.$text = { $search: req.query.textoLibre };
  // Ordenar por relevancia
  sort = { score: { $meta: "textScore" } };
}
```

## Testing

### Probar Endpoints (Estado Actual)
```bash
# Todos deben devolver 501
curl http://localhost:3000/api/propiedades-renta/cliente/recomendaciones

# Respuesta esperada:
{
  "success": false,
  "message": "Funcionalidad de recomendaciones pendiente",
  "nota": "Requiere implementación del módulo de autenticación de clientes"
}
```

### Probar Después de Implementar
```bash
# Con autenticación
curl -H "Authorization: Bearer <token_cliente>" \
  http://localhost:3000/api/propiedades-renta/cliente/recomendaciones

# Búsqueda avanzada
curl "http://localhost:3000/api/propiedades-renta/cliente/busqueda-avanzada?\
textoLibre=cerca%20del%20tec&\
tiempoMaximoTraslado=30&\
fechaMudanza=2025-02-01"

# Comparar propiedades
curl -X POST http://localhost:3000/api/propiedades-renta/cliente/comparar \
  -H "Content-Type: application/json" \
  -d '{"propiedadesIds": ["id1", "id2", "id3"]}'
```

## Optimizaciones Recomendadas

1. **Índices de MongoDB**:
   ```javascript
   PropiedadRentaDB.collection.createIndex({ "ubicacion.campus": 1 });
   PropiedadRentaDB.collection.createIndex({ "informacionFinanciera.precioMensual": 1 });
   PropiedadRentaDB.collection.createIndex({ estado: 1, "disponibilidad.disponible": 1 });
   ```

2. **Caché para Recomendaciones**:
   - Usar Redis para cachear recomendaciones por clienteId
   - TTL de 1 hora
   - Invalidar al actualizar perfil del cliente

3. **Rate Limiting**:
   ```javascript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // límite de requests
   });

   router.use('/cliente', limiter);
   ```

## Checklist de Implementación

- [ ] Crear módulo de clientes con autenticación
- [ ] Crear modelos auxiliares (Favoritos, Búsquedas, Vistas)
- [ ] Descomentar middleware en rutas
- [ ] Implementar `obtenerRecomendaciones`
- [ ] Implementar `busquedaAvanzada`
- [ ] Implementar sistema de favoritos (GET, POST, DELETE)
- [ ] Implementar `buscarPorCompatibilidadRoommate`
- [ ] Implementar `obtenerBusquedasGuardadas` y `guardarBusqueda`
- [ ] Implementar `compararPropiedades`
- [ ] Implementar `obtenerPropiedadesMapa` (requiere geocodificación)
- [ ] Implementar `obtenerPropiedadesSimilares`
- [ ] Implementar `obtenerVistasRecientes`
- [ ] Crear índices de MongoDB
- [ ] Implementar caché (opcional)
- [ ] Implementar rate limiting
- [ ] Tests de integración
- [ ] Documentación de API (Postman/Swagger)

## Recursos Adicionales

- **Documentación completa**: Ver `README.md` sección "Filtros Especiales para Clientes"
- **Código skeleton**: `controllers/property.customer.controller.ts`
- **Rutas definidas**: `routes/property.customer.routes.ts`
- **Ejemplos de uso**: Ver cada método en el controlador
