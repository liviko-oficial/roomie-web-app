# Liviko

This README documents the repo with a focus on devs who will contribute to the project. 

## 1. Overview

The repository is organized as a monorepo with two main parts:

* `server/`: Express API (TypeScript) using MongoDB via Mongoose.
* `client/`: Frontend built with Next.js (React + TypeScript).

There is also a `docs/` folder containing additional material.

## 2. Tech stack 

### Backend (`server/`)

* Runtime / tooling: Bun (script `bun run dev:server`) and TSX (script `start:server`).
* HTTP framework: Express.
* Database: MongoDB.
* ODM: Mongoose.
* Authentication: JWT + cookies (middleware under `src/user/routes/middleware`).
* API documentation: Swagger UI serving an OpenAPI YAML file (see `src/api-docs/openapi.yml` and `src/api.ts`).
* Emails: Resend + React Email (folder `src/email_templates`).
* Testing: Vitest + Supertest.

### Frontend (`client/`)

* Framework: Next.js.
* UI: React + TypeScript.
* Styling / utilities: Tailwind CSS (config via PostCSS and related deps), `clsx`, `tailwind-merge`.
* State management: Zustand.
* Linting: Next.js built-in linting.

## 3. Repository structure

```
roomie-web-app/
├── client/                 # Frontend (Next.js)
│   ├── app/                # Next.js App Router
│   ├── modules/            # Feature modules
│   ├── lib/                # Frontend shared utilities
│   └── ...
├── server/                 # Backend (Express + TS)
│   ├── index.ts            # Server entry point
│   └── src/
│       ├── api.ts          # Main router + Swagger UI
│       ├── db/             # Mongo/Mongoose connection and queries
│       ├── lib/            # Constants and utilities
│       ├── user/           # User module
│       ├── arrendador/     # Landlord module
│       ├── rentalProperty/ # Rental property module
│       ├── api-docs/       # OpenAPI YAML
│       └── email_templates/# Email templates
└── docs/
    └── reporte_rommie_web_app.pdf
```

## 4. Backend: key files and responsibilities

### `server/index.ts`

Backend entry point:

* Initializes Express.
* Connects to the database via `db()` from `src/db/index.ts`.
* Registers global middlewares (`express.json()`, `cookie-parser`).
* Mounts the main router at `app.use("/api", api)`.
* Starts the HTTP server on `PORT`.

### `server/src/db/index.ts`

Database connection layer:

* Exports a default `connect()` function that calls `mongoose.connect(DB_URL)`.
* Registers error handlers for the database connection.

### `server/src/api.ts`

Main API router:

* `GET /` returns a simple HTML response confirming API reachability.
* `GET /health-check` returns HTTP 200 for monitoring.
* Mounts module routers:

  * `app.use(user)` (user module)
  * `app.use("/api", arrendador)` (arrendador module)
  * `app.use("/api", rentalProperty)` (rentalProperty module)
* Mounts Swagger documentation at `app.use("/docs", ...)`.
* Handles a generic 404 at the end.


## 5. Main endpoints

The following routes are extracted directly from the route files in the codebase. Consider the global `/api` prefix defined in `server/index.ts`.

### 5.1 User (`server/src/user/routes/*`)

Mounted directly under the main router.

* `POST /register`
* `GET /register/verify`
* `POST /login`
* `GET /login/upgrade-partial`
* `GET /user`
* `DELETE /user`
* `PUT /user/preferences`
* `PUT /user`
* `GET /password-recovery`
* `GET /password-recovery/verify`
* `PUT /password-recovery`
* `POST /register/form`

At runtime, these resolve to `/api/register`, `/api/login`, etc.

### 5.2 Arrendador (`server/src/arrendador/routes/*`)

Mounted under `server/src/arrendador/routes/index.ts`.

* Base: `/arrendadores`

  * `GET /`
  * `GET /:id`
  * `POST /registro`
  * `POST /login`
  * `PUT /:id`
  * `PUT /:id/perfil`
  * `PUT /:id/cambiar-password`
  * `DELETE /:id`

* Base: `/propiedades`

  * `GET /`
  * `GET /:propertyId`
  * `POST /:arrendadorId`
  * `GET /:arrendadorId/mis-propiedades`
  * `GET /:arrendadorId/peticiones`
  * `GET /:arrendadorId/peticiones/:peticionId`
  * `PUT /:arrendadorId/propiedad/:propertyId`
  * `PATCH /:arrendadorId/propiedad/:propertyId/estado`
  * `DELETE /:arrendadorId/propiedad/:propertyId`

Current effective prefix (due to double mounting): `/api/api/arrendadores/...` and `/api/api/propiedades/...`.

### 5.3 Rental properties (`server/src/rentalProperty/routes/*`)

Mounted under `server/src/rentalProperty/routes/index.ts`.

* Base: `/propiedades-renta` (public / client-facing)

  * `GET /catalogo`
  * `GET /buscar`
  * `GET /campus/:campus`
  * `GET /:propertyId/similares`
  * `POST /:propertyId/solicitar`

* Base: `/propiedades-renta` (CRUD / management)

  * `GET /`
  * `GET /:propertyId`
  * `GET /arrendador/:arrendadorId`
  * `POST /`
  * `PUT /:propertyId`
  * `PATCH /:propertyId/estado`
  * `PATCH /:propertyId/disponibilidad`
  * `PATCH /:propertyId/imagenes`
  * `PATCH /:propertyId/restaurar`
  * `DELETE /:propertyId`
  * `DELETE /:propertyId/permanente`

* Base: `/propiedades-renta/cliente` (authenticated client features)

  * `GET /recomendaciones`
  * `GET /mapa`
  * `GET /compatibilidad-roommate`
  * `GET /vistas-recientes`
  * `GET /favoritos`
  * `POST /favoritos/:propertyId`
  * `DELETE /favoritos/:propertyId`
  * `GET /busquedas-guardadas`
  * `POST /busquedas-guardadas`
  * `GET /busqueda-avanzada`
  * `GET /similares/:propertyId`
  * `POST /comparar`

Current effective prefix (due to double mounting): `/api/api/propiedades-renta/...`.

## 6. Backend environment variables

Defined in `server/src/lib/const.ts`:

* `PORT` (default 3001)
* `DB_URL` (MongoDB connection string)
* `JWT_SECRET`
* `RESEND_KEY`
* `BASE_URL`
* `FROM_EMAIL`
* `API_DOCS_PATH` (default `api-docs/openapi.yml`)

The backend scripts use `.env.local` if present.

## 7. Conventions

### 7.1 Code conventions

* TypeScript is used in both backend and frontend.
* Naming:

  * `camelCase` for variables and functions.
  * `PascalCase` for types, classes, and components.
* Avoid placing business logic directly inside route handlers; prefer model/service functions (e.g. `src/user/models/*`).
* Import aliases are used in the backend (e.g. `@/`), configured via TypeScript and tooling.

### 7.2 Security conventions

* Do not commit secrets or `.env*` files.
* Passwords must be hashed (bcrypt is in backend dependencies).
* Inputs should be validated before persistence.

Recommended conventions:

* Rate limiting and brute-force protection on auth endpoints.

### 7.3 Contributing conventions

* Work on feature branches; do not push directly to `main`.
* Use descriptive commit messages, suggested prefixes:

  * `feat:` new functionality
  * `fix:` bug fixes
  * `docs:` documentation
  * `refactor:` refactors without functional change
* Prefer Pull Requests with a short description and evidence (screenshots, curl/Postman if relevant).


## 8. Running the project

### Backend

From `server/`:

```bash
bun install
bun run dev:server
```

Alternative:

```bash
npm install
npm run start:server
```

API documentation:

* Available at `http://localhost:<PORT>/api/docs/`.

### Frontend

From `client/`:

```bash
npm install
npm run dev
```

## 9. Frontend: key features

### 9.1 Requests dashboard

The dashboard allows students to view all the requests they have made to properties.

**Route:** `/dashboard`

**Files:**

* `client/modules/dashboard/components/RequestCard.jsx` - card that displays each request.
* `client/modules/dashboard/sections/DashboardHeader.jsx` - yellow header with the title.
* `client/modules/dashboard/sections/RequestColumns.jsx` - the 3 sections (in progress, approved, rejected).
* `client/modules/dashboard/mock/requests.js` - mock data for testing.

**Functionality:**

Requests are divided into 3 categories:

* In progress (yellow) - no response yet.
* Approved (green) - the landlord accepted.
* Rejected (red) - the landlord declined.

Each card displays:

* Property photo.
* Price.
* Landlord info.
* Message left by the landlord.
* Offer status.
* Buttons to send email or call.

**Available states:**

* `status`: `"en_proceso"` | `"aprobada"` | `"rechazada"`
* `offerStatus`: `"sin_oferta"` | `"contraoferta_por_revisar"` | `"oferta_aceptada"` | `"oferta_rechazada"`

**Pending:**

* Connect to the real backend.
* Add functionality to accept/reject counteroffers.
* Notifications when status changes.

