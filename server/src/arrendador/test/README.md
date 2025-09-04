# Tests del Módulo de Arrendadores

Este directorio contiene todos los tests para el módulo de arrendadores de la aplicación Liviko.

## Estructura de Tests

### Archivos de Test

- `arrendador.test.ts` - Tests para autenticación y gestión de perfiles de arrendadores
- `property.test.ts` - Tests para CRUD de propiedades
- `middleware.test.ts` - Tests para middleware de autenticación y autorización  
- `validation.test.ts` - Tests para validaciones de esquemas Zod
- `setup.ts` - Configuración global para tests
- `README.md` - Documentación de tests

## Configuración de Tests

### Prerrequisitos

1. **Base de datos MongoDB de test**:
   - Configurar una instancia de MongoDB para tests
   - Establecer variable de entorno `TEST_DB_URL`
   - Por defecto usa: `mongodb://localhost:27017/liviko_test`

2. **Dependencias**:
   ```bash
   bun add -d vitest supertest @types/supertest
   ```

### Variables de Entorno para Tests

```bash
# .env.test
TEST_DB_URL=mongodb://localhost:27017/liviko_test
JWT_SECRET=test-secret-key
```

## Ejecutar Tests

### Todos los tests del módulo
```bash
bun test src/arrendador/test/
```

### Tests específicos
```bash
# Tests de autenticación
bun test src/arrendador/test/arrendador.test.ts

# Tests de propiedades  
bun test src/arrendador/test/property.test.ts

# Tests de middleware
bun test src/arrendador/test/middleware.test.ts

# Tests de validaciones
bun test src/arrendador/test/validation.test.ts
```

### Con cobertura de código
```bash
bun test src/arrendador/test/ --coverage
```

### En modo watch
```bash
bun test src/arrendador/test/ --watch
```

## Cobertura de Tests

### Funcionalidades Cubiertas

#### Autenticación de Arrendadores (`arrendador.test.ts`)
- ✅ Registro con datos válidos
- ✅ Registro con email inválido (dominio no soportado)
- ✅ Registro con contraseña débil
- ✅ Registro con email duplicado
- ✅ Login con credenciales válidas
- ✅ Login con contraseña incorrecta
- ✅ Login con email no existente
- ✅ Obtención de perfil propio
- ✅ Actualización de perfil completo
- ✅ Cambio de contraseña
- ✅ Eliminación de cuenta (soft delete)
- ✅ Verificación de autorización por ownership

#### Gestión de Propiedades (`property.test.ts`)
- ✅ Creación de propiedad con datos válidos
- ✅ Creación sin autenticación (debe fallar)
- ✅ Creación para otro arrendador (debe fallar)
- ✅ Creación con datos inválidos
- ✅ Búsqueda pública de propiedades
- ✅ Filtros por tipo, precio, género, servicios, amueblado
- ✅ Paginación de resultados
- ✅ Obtención de propiedad específica
- ✅ Obtención de propiedades del arrendador
- ✅ Actualización de propiedad
- ✅ Cambio de estado activo/inactivo
- ✅ Eliminación de propiedad (soft delete)

#### Middleware de Seguridad (`middleware.test.ts`)
- ✅ Autenticación con token válido
- ✅ Rechazo sin token
- ✅ Rechazo con token inválido
- ✅ Rechazo con token malformado
- ✅ Rechazo con rol incorrecto
- ✅ Rechazo con arrendador inexistente
- ✅ Rechazo con arrendador inactivo
- ✅ Verificación de ownership correcta
- ✅ Bloqueo de acceso a recursos ajenos
- ✅ Integración de múltiples middlewares

#### Validaciones de Datos (`validation.test.ts`)
- ✅ Validación de emails institucionales
- ✅ Validación de contraseñas seguras
- ✅ Validación de datos de perfil
- ✅ Validación de fechas de nacimiento
- ✅ Validación de documentos oficiales
- ✅ Validación de datos de propiedades
- ✅ Validación de precios y servicios
- ✅ Validación de tipos y preferencias

### Casos Edge Cubiertos

- ✅ Tokens JWT malformados o expirados
- ✅ Parámetros faltantes en URLs
- ✅ Datos parciales en actualizaciones
- ✅ Filtros de búsqueda combinados
- ✅ Paginación en límites
- ✅ Validaciones de límites numéricos
- ✅ URLs inválidas en imágenes
- ✅ Caracteres especiales en contraseñas
- ✅ Fechas de nacimiento en límites
- ✅ Soft delete y reactivación

## Métricas de Test

### Coverage Esperado
- **Líneas de código**: >90%
- **Funciones**: >95% 
- **Ramas**: >85%
- **Statements**: >90%

### Performance
- **Tiempo total de ejecución**: <30 segundos
- **Tests por segundo**: >10
- **Setup/teardown por test**: <100ms

## Buenas Prácticas Implementadas

### Aislamiento de Tests
- Cada test limpia la base de datos antes de ejecutar
- No hay dependencias entre tests
- Setup y teardown consistentes

### Datos de Test
- Datos realistas pero seguros
- No se usan datos de producción
- Emails de test con dominios válidos

### Assertions Descriptivas
- Verificaciones específicas y claras
- Mensajes de error informativos
- Validación tanto de casos exitosos como fallidos

### Manejo de Async/Await
- Todos los tests async correctamente implementados
- Timeouts apropiados para operaciones de DB
- Manejo de errores en operaciones asíncronas

## Troubleshooting Común

### Error: Cannot connect to test database
```bash
# Asegúrate que MongoDB esté corriendo
brew services start mongodb/brew/mongodb-community

# O con Docker
docker run -d -p 27017:27017 mongo:latest
```

### Error: JWT secret not defined
```bash
# Establecer JWT_SECRET en variables de entorno
export JWT_SECRET=test-secret-key
```

### Error: Port already in use
```bash
# Los tests usan supertest, no requieren puerto específico
# Si persiste, verificar que no haya servidores corriendo
```

### Tests lentos
```bash
# Usar base de datos en memoria para mayor velocidad
# Considerar mongodb-memory-server para tests unitarios
```

## Comandos Útiles

```bash
# Limpiar base de datos de test manualmente
mongo liviko_test --eval "db.dropDatabase()"

# Ejecutar solo tests que fallan
bun test src/arrendador/test/ --reporter=verbose --bail

# Ejecutar tests con debugging
DEBUG=true bun test src/arrendador/test/

# Generar reporte de cobertura en HTML
bun test src/arrendador/test/ --coverage --coverage.reporter=html
```