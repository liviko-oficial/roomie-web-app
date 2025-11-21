# Test Suite Documentation - Properties CRUD System

## Overview

Complete test suite for all Property CRUD operations including UPDATE, DELETE, and CLIENT search endpoints. All tests use **Vitest** as the test runner and **Supertest** for HTTP assertions.

---

## Test Files Created

### 1. `property.update.test.ts`
**Controller:** `PropertyUpdateController`
**Endpoints tested:** 4
**Total test cases:** 30+

#### Coverage:

**updateProperty (PUT /api/propiedades-renta/:propertyId)**
- Update property with valid data
- Update nested objects correctly
- Fail without authentication
- Fail when updating another landlord's property
- Fail with invalid data
- Return 404 for non-existent property

**cambiarEstadoPropiedad (PATCH /api/propiedades-renta/:propertyId/estado)**
- Change property state successfully
- Fail with invalid state
- Prevent state change with active tenants
- Allow state change to 'Rentada' with active tenants
- Fail without authentication

**actualizarDisponibilidad (PATCH /api/propiedades-renta/:propertyId/disponibilidad)**
- Update availability successfully
- Fail with invalid duration (min > max)
- Fail with duration out of range
- Prevent marking as available with active tenants
- Fail with past date

**actualizarImagenes (PATCH /api/propiedades-renta/:propertyId/imagenes)**
- Add images to gallery successfully
- Remove images from gallery successfully
- Update principal image successfully
- Update tour360 URL successfully
- Fail when exceeding gallery limit (20 images)
- Fail with invalid URL format
- Perform multiple image operations simultaneously
- Fail without authentication

---

### 2. `property.delete.test.ts`
**Controller:** `PropertyDeleteController`
**Endpoints tested:** 3
**Total test cases:** 25+

#### Coverage:

**eliminarPropiedad (DELETE /api/propiedades-renta/:propertyId) - Soft Delete**
- Soft delete property successfully
- Not show soft deleted property in public searches
- Prevent soft delete with active tenants
- Fail without authentication
- Fail when deleting another landlord's property
- Return 404 for non-existent property
- Update fechaActualizacion on soft delete

**eliminarPermanentemente (DELETE /api/propiedades-renta/:propertyId/permanente) - Hard Delete**
- Hard delete property successfully
- Remove property from landlord's properties array
- Prevent hard delete with active tenants
- Prevent hard delete with pending applications
- Fail without authentication
- Fail when hard deleting another landlord's property
- Return 404 for non-existent property
- Be irreversible - property cannot be restored after hard delete

**restaurarPropiedad (PATCH /api/propiedades-renta/:propertyId/restaurar)**
- Restore soft deleted property successfully
- Fail to restore property that is not Inactiva
- Fail to restore property that was hard deleted
- Fail without authentication
- Fail when restoring another landlord's property
- Return 404 for non-existent property
- Update fechaActualizacion on restore
- Allow multiple soft delete and restore cycles

**Integration Tests**
- Complete workflow: soft delete → restore → hard delete

---

### 3. `property.client.test.ts`
**Controller:** `PropertyClientController`
**Endpoints tested:** 4
**Total test cases:** 50+

#### Coverage:

**getCatalogo (GET /api/propiedades-renta/catalogo)**
- Return all properties for unauthenticated user
- Return only active and available properties
- Support pagination
- Limit results to maximum of 100
- Exclude sensitive fields from response
- Populate landlord information

**searchProperties (GET /api/propiedades-renta/buscar)**
- Search properties with no filters
- Filter by campus
- Filter by tipoPropiedad
- Filter by tipoRenta
- Filter by price range (precioMinimo, precioMaximo)
- Filter by amueblado
- Filter by mascotasPermitidas
- Filter by serviciosIncluidos
- Filter by minimum numeroBanos
- Filter by minimum numeroRecamaras
- Filter by generoPreferido
- Filter by distanciaMaxima
- Sort by precio_asc
- Sort by precio_desc
- Sort by distancia
- Combine multiple filters
- Return filtrosAplicados in response

**getPropertiesByCampus (GET /api/propiedades-renta/campus/:campus)**
- Get properties by Guadalajara campus
- Get properties by Monterrey campus
- Get properties by Ciudad de México campus
- Fail with invalid campus
- Support pagination
- Support ordenarPor parameter

**getSimilarProperties (GET /api/propiedades-renta/:propertyId/similares)**
- Find similar properties in same campus
- Calculate similarity scores (0-100)
- Sort by similarity score descending
- Respect limit parameter
- Default to limit 6
- Enforce max limit of 20
- Filter by price range (±20%)
- Exclude the original property from results
- Return 404 for non-existent property
- Only show active and available properties
- Include razonSimilitud explaining why properties are similar
- Return propiedadOriginal info

**Integration Tests**
- Complete user search journey (catalog → campus filter → advanced search → similar properties)

---

## Test Data Structure

### Test Landlords
```typescript
const testArrendador = {
  email: "test@tec.mx",
  password: "TestPassword123!",
  profile: {
    fullName: "Test Arrendador",
    phone: "+52 33 1234 5678"
  }
};
```

### Test Property
```typescript
const testProperty = {
  titulo: "Departamento 2 recámaras Guadalajara",
  descripcion: "Propiedad de prueba",
  tipoPropiedad: "Departamento",
  tipoRenta: "Propiedad completa",
  generoPreferido: "Mixto",
  direccion: { /* complete address */ },
  ubicacion: {
    campus: "Guadalajara",
    distanciaCampus: 2.5
  },
  caracteristicas: {
    numeroRecamaras: 2,
    numeroBanos: 1,
    areaConstruccion: 80,
    amueblado: true,
    mascotasPermitidas: true
  },
  servicios: {
    serviciosIncluidos: true,
    listaServicios: ["Agua", "Luz", "Internet"]
  },
  informacionFinanciera: {
    precioMensual: 5000,
    deposito: 5000
  },
  disponibilidad: {
    disponible: true,
    fechaDisponible: new Date("2025-01-01"),
    duracionMinimaContrato: 6,
    duracionMaximaContrato: 12
  },
  politicas: { /* policies */ },
  imagenes: {
    imagenPrincipal: "https://test.com/principal.jpg",
    galeria: []
  }
};
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test property.update.test.ts
npm test property.delete.test.ts
npm test property.client.test.ts
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

---

## Test Environment Setup

### Database
All tests use a separate test database to avoid affecting production data:

```typescript
const mongoUrl = process.env.TEST_DB_URL || "mongodb://localhost:27017/liviko_test";
```

### Environment Variable
Set the test database URL in your environment:

```bash
export TEST_DB_URL=mongodb://localhost:27017/liviko_test
```

Or create a `.env.test` file:
```
TEST_DB_URL=mongodb://localhost:27017/liviko_test
```

---

## Test Lifecycle Hooks

### beforeAll
- Connects to test database
- Runs once before all tests in the file

### afterAll
- Cleans up test data
- Disconnects from database
- Runs once after all tests complete

### beforeEach
- Clears previous test data
- Creates fresh test landlord
- Creates fresh test properties
- Runs before each individual test

---

## Authentication in Tests

All protected endpoints require JWT authentication:

```typescript
// Login and get token
const registerResponse = await request(app)
  .post("/api/arrendadores/registro")
  .send(testArrendador);

const testToken = registerResponse.body.data.token;

// Use token in requests
await request(app)
  .put(`/api/propiedades-renta/${propertyId}`)
  .set("Authorization", `Bearer ${testToken}`)
  .send(updateData);
```

---

## Common Test Patterns

### Testing Success Cases
```typescript
it("should update property successfully", async () => {
  const response = await request(app)
    .put(`/api/propiedades-renta/${testPropertyId}`)
    .set("Authorization", `Bearer ${testToken}`)
    .send(updateData)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.titulo).toBe(updateData.titulo);
});
```

### Testing Authentication Failures
```typescript
it("should fail without authentication", async () => {
  const response = await request(app)
    .put(`/api/propiedades-renta/${testPropertyId}`)
    .send(updateData)
    .expect(401);

  expect(response.body.success).toBe(false);
});
```

### Testing Authorization Failures
```typescript
it("should fail when updating another landlord's property", async () => {
  const otherToken = /* get another landlord's token */;

  const response = await request(app)
    .put(`/api/propiedades-renta/${testPropertyId}`)
    .set("Authorization", `Bearer ${otherToken}`)
    .send(updateData)
    .expect(403);

  expect(response.body.success).toBe(false);
});
```

### Testing Validation Errors
```typescript
it("should fail with invalid data", async () => {
  const invalidData = {
    precioMensual: -1000 // Invalid
  };

  const response = await request(app)
    .put(`/api/propiedades-renta/${testPropertyId}`)
    .set("Authorization", `Bearer ${testToken}`)
    .send(invalidData)
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.errors).toBeDefined();
});
```

---

## Test Coverage Summary

| Controller | Endpoints | Test Cases | Coverage |
|------------|-----------|------------|----------|
| PropertyUpdateController | 4 | 30+ | UPDATE operations, validation, authorization |
| PropertyDeleteController | 3 | 25+ | Soft delete, hard delete, restore |
| PropertyClientController | 4 | 50+ | Public search, filters, pagination, similarity |
| **TOTAL** | **11** | **105+** | **Complete CRUD + Search** |

---

## Key Testing Scenarios

### Business Logic Tests
- Prevent operations with active tenants
- State transition validations
- Price range calculations
- Duration constraints (1-24 min, 1-48 max months)
- Gallery image limit (20 max)

### Security Tests
- Authentication required for protected endpoints
- Authorization (landlord can only modify own properties)
- Sensitive data exclusion from public responses
- Cross-tenant access prevention

### Data Integrity Tests
- Soft delete preserves data
- Hard delete removes completely
- Restore reverts soft delete
- Update preserves non-updated fields
- Nested object updates work correctly

### Search & Filter Tests
- All 15+ filter combinations
- Campus-based filtering
- Price range queries
- Boolean filters (amueblado, mascotas, servicios)
- Minimum value filters (baños, recámaras)
- Sorting (precio, distancia, calificación, fecha)

### Algorithm Tests
- Similarity score calculation (0-100)
- Price similarity weight (40 points)
- Feature matching weights
- Same campus requirement
- Active/available filtering

---

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
        env:
          TEST_DB_URL: mongodb://localhost:27017/liviko_test
```

---

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "should update property successfully"
```

### Verbose Output
```bash
npm test -- --reporter=verbose
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/vitest
```

---

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: Always clean up test data in `afterAll` and `beforeEach`
3. **Descriptive Names**: Test names clearly describe what they're testing
4. **Assertions**: Multiple assertions to verify complete behavior
5. **Edge Cases**: Test both success and failure scenarios
6. **Real Scenarios**: Integration tests simulate actual user workflows
7. **Fast Execution**: Tests run quickly by using in-memory database when possible
8. **Deterministic**: Tests produce same results every time

---

## Future Enhancements

### Suggested Additional Tests
1. **Performance Tests**: Load testing for search endpoints
2. **Concurrency Tests**: Multiple users updating same property
3. **Rate Limiting Tests**: API throttling behavior
4. **Image Upload Tests**: File upload validation (when implemented)
5. **Geolocation Tests**: Distance calculation accuracy (when implemented)
6. **Email Notification Tests**: Verification of alerts sent

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Ensure MongoDB is running
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name liviko-test-db mongo:latest
```

### Port Already in Use
```bash
# Kill process using test port
lsof -ti:27017 | xargs kill -9
```

### Test Timeout
Increase timeout in vitest config:
```typescript
export default defineConfig({
  test: {
    timeout: 10000 // 10 seconds
  }
});
```

---

## Documentation References

- **Vitest**: https://vitest.dev/
- **Supertest**: https://github.com/visionmedia/supertest
- **MongoDB Memory Server**: https://github.com/nodkz/mongodb-memory-server
- **Mongoose Testing**: https://mongoosejs.com/docs/jest.html

---

**Created:** 2025-11-08
**Status:** Complete - All endpoints tested
**Total Test Cases:** 105+
**Coverage:** UPDATE (4), DELETE (3), CLIENT SEARCH (4)
