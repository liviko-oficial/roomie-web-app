# Arrendadores API

Esta es la documentación de la API para el módulo de arrendadores del sistema Liviko.

## Rutas Base

Todas las rutas de arrendadores están bajo el prefijo `/api`

## Endpoints de Arrendadores

### Rutas Públicas

#### POST `/api/arrendadores/registro`
Registrar un nuevo arrendador en el sistema.

**Body:**
```json
{
  "email": "arrendador@ejemplo.com",
  "password": "MiPassword123!",
  "profile": {
    "fullName": "Juan Pérez",
    "phone": "+52 55 1234 5678"
  }
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Arrendador registrado exitosamente",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "arrendador@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/arrendadores/login`
Iniciar sesión como arrendador.

**Body:**
```json
{
  "email": "arrendador@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "email": "arrendador@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isEmailVerified": true
  }
}
```

### Rutas Protegidas (Requieren Token de Autenticación)

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### GET `/api/arrendadores`
Obtener lista de todos los arrendadores (paginada).

**Query Parameters:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Elementos por página (default: 10)

#### GET `/api/arrendadores/:id`
Obtener perfil completo de un arrendador específico (solo el propio arrendador).

#### PUT `/api/arrendadores/:id`
Actualizar información general del arrendador (solo el propio arrendador).

#### PUT `/api/arrendadores/:id/perfil`
Actualizar perfil del arrendador (solo el propio arrendador).

**Body:**
```json
{
  "profilePicture": "https://ejemplo.com/imagen.jpg",
  "officialId": {
    "type": "INE",
    "fileUrl": "https://ejemplo.com/documento.pdf",
    "fileName": "INE_Juan_Perez.pdf"
  },
  "dateOfBirth": {
    "day": 15,
    "month": 8,
    "year": 1985
  },
  "gender": "masculino",
  "phone": "+52 55 1234 5678",
  "fullName": "Juan Pérez García"
}
```

#### PUT `/api/arrendadores/:id/cambiar-password`
Cambiar contraseña del arrendador (solo el propio arrendador).

**Body:**
```json
{
  "currentPassword": "MiPasswordActual123!",
  "newPassword": "MiNuevoPassword456!"
}
```

#### DELETE `/api/arrendadores/:id`
Eliminar cuenta del arrendador (soft delete - solo el propio arrendador).

## Endpoints de Propiedades

### Rutas Públicas

#### GET `/api/propiedades`
Obtener todas las propiedades activas (con filtros opcionales).

**Query Parameters:**
- `page` (optional): Número de página
- `limit` (optional): Elementos por página
- `propertyType` (optional): "Casa", "Departamento", "Loft"
- `rentalType` (optional): "Casa completa", "Departamento completo", etc.
- `genderPreference` (optional): "Solo hombres", "Solo mujeres", "Mixto"
- `minPrice` (optional): Precio mínimo
- `maxPrice` (optional): Precio máximo
- `includesServices` (optional): true/false
- `isFurnished` (optional): true/false

#### GET `/api/propiedades/:propertyId`
Obtener información detallada de una propiedad específica.

### Rutas Protegidas

#### POST `/api/propiedades/:arrendadorId`
Crear nueva propiedad (solo el arrendador propietario).

**Body:**
```json
{
  "propertyType": "Departamento",
  "rentalType": "Departamento completo",
  "genderPreference": "Mixto",
  "monthlyPrice": 8500,
  "includesServices": true,
  "services": ["Luz", "Agua", "Internet"],
  "isFurnished": true,
  "furniture": ["Cama", "Escritorio", "Refrigerador"],
  "address": {
    "street": "Av. Insurgentes Sur 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zipCode": "03100",
    "country": "México"
  },
  "images": ["https://ejemplo.com/img1.jpg", "https://ejemplo.com/img2.jpg"],
  "description": "Hermoso departamento en zona céntrica..."
}
```

#### GET `/api/propiedades/:arrendadorId/mis-propiedades`
Obtener todas las propiedades del arrendador (solo el arrendador propietario).

#### PUT `/api/propiedades/:arrendadorId/propiedad/:propertyId`
Actualizar propiedad específica (solo el arrendador propietario).

#### DELETE `/api/propiedades/:arrendadorId/propiedad/:propertyId`
Eliminar propiedad específica (soft delete - solo el arrendador propietario).

#### PATCH `/api/propiedades/:arrendadorId/propiedad/:propertyId/estado`
Cambiar estado activo/inactivo de la propiedad (solo el arrendador propietario).

**Body:**
```json
{
  "isActive": false
}
```

## Códigos de Error Comunes

- **400**: Datos de validación incorrectos
- **401**: Token de acceso requerido o inválido
- **403**: Acceso denegado (no tienes permisos)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Estructura del Modelo Arrendador

```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hasheada),
  profile: {
    profilePicture?: string,
    officialId?: {
      type: "INE" | "passport" | "license",
      fileUrl: string,
      fileName: string
    },
    dateOfBirth?: {
      day: number,
      month: number,
      year: number
    },
    gender?: "masculino" | "femenino" | "otro",
    phone?: string,
    fullName?: string,
    isVerified: boolean
  },
  properties: ObjectId[], // Referencias a propiedades
  applications: ObjectId[], // Referencias a solicitudes
  tenants: ObjectId[], // Referencias a inquilinos
  isEmailVerified: boolean,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Estructura del Modelo Propiedad

```typescript
{
  _id: ObjectId,
  propertyType: "Casa" | "Departamento" | "Loft",
  rentalType: "Casa completa" | "Departamento completo" | "Habitación dentro de una casa" | "Habitación dentro de un departamento" | "Loft",
  genderPreference: "Solo hombres" | "Solo mujeres" | "Mixto",
  monthlyPrice: number,
  includesServices: boolean,
  services: string[],
  isFurnished: boolean,
  furniture: string[],
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  images: string[],
  description: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```