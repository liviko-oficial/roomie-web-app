# BUG_REPORT — happyroomie.mx

**Fecha:** 2026-04-13
**Rama testeada:** `subirPag` @ commit `e7e0611`
**URL:** https://happyroomie.mx
**Herramientas:** Playwright MCP, Lighthouse CLI, curl

---

## Resumen ejecutivo

El sitio **renderiza** pero la funcionalidad core esta **rota en produccion**: toda llamada al backend apunta a `http://localhost:3001`, por lo que buscar propiedades, login, registro y cualquier flow autenticado fallan. Ademas, varias rutas referenciadas desde la UI no existen (404), y dos paginas sensibles son accesibles sin autenticacion. Perf/a11y/SEO de Lighthouse estan aceptables (93/93/96/100).

**Prioridad de fix:** P0 (URL backend) → P1 (rutas 404 + auth bypass) → P2 (headers, navbar mobile, a11y) → P3 (perf, .git bloqueo).

---

## Bugs criticos (P0 — rompen funcionalidad)

### 1. URL del backend hardcodeada a `localhost:3001` en el bundle de prod

**Severidad:** Critica. Rompe todo el producto.

**Ubicacion:**
- [client/lib/api/client.ts:3-4](client/lib/api/client.ts#L3-L4)
- [client/app/(main)/properties/[id]/page.tsx:7](client/app/(main)/properties/[id]/page.tsx#L7)

```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

**Repro:** abrir https://happyroomie.mx/ → DevTools Network → se ve `POST http://localhost:3001/api/propiedades-renta` con `net::ERR_CONNECTION_REFUSED`. Idem en `/properties` (siempre muestra "0 resultados") y en login (`POST http://localhost:3001/api/arrendadores/login` falla).

**Causa:** no existe `.env.production` / `.env.local` con `NEXT_PUBLIC_API_URL`, por lo que en build el fallback quedo embebido en el JS servido al browser.

**Fix:**
1. Desplegar el backend Express (`server/`) en un subdominio publico (p. ej. `api.happyroomie.mx` via Hostinger o Railway/Render).
2. En el proyecto Hostinger del `client`, agregar variable de entorno `NEXT_PUBLIC_API_URL=https://api.happyroomie.mx` y hacer **rebuild**. Las `NEXT_PUBLIC_*` se inlinean en build-time, no en runtime.
3. Verificar en prod con DevTools que ya no aparezca `localhost:3001`.

---

## Bugs altos (P1)

### 2. Rutas referenciadas pero inexistentes — 8+ links rotos

**Severidad:** Alta. UX roto + SEO penalizado.

Next.js hace prefetch RSC de estos paths y devuelve 404:

| Ruta | Usada desde |
|---|---|
| `/propiedades` | footer del `/lessor` |
| `/perfil` | footer del `/lessor` |
| `/contacto` | footer del `/lessor` |
| `/login-student` | `/login-landlord` (link "¿Eres estudiante?") |
| `/registro-arrendador` | `/login-landlord` (link "Crear cuenta") |
| `/recuperar-contrasena` | `/login-landlord` |
| `/terminos` | footer legal |
| `/privacidad` | footer legal |

**Fix:** crear las paginas faltantes O actualizar los `<Link>` a la ruta correcta (`/properties`, `/students/profile`, etc.). Confirma que el boton "Crear cuenta de Arrendador" deberia apuntar a `/registrar-propiedad`? Verifica la nomenclatura en toda la app — mezcla espanol e ingles (`/properties` vs `/propiedades`) es la raiz de varios de estos 404.

### 3. Posible auth bypass — `/students/profile` y `/registrar-propiedad` cargan sin sesion

**Severidad:** Alta (spam/abuso) y/o media (depende de si el submit final valida token en backend).

**Repro:** navegar directamente a https://happyroomie.mx/students/profile o https://happyroomie.mx/registrar-propiedad sin cookies → el wizard completo carga y permite avanzar. Contrasta con `/dashboard` que si muestra "Inicia sesion para ver tu dashboard".

**Impacto:** cualquier bot puede hostigar el endpoint de registro de propiedad. El guard de auth debe estar **en el middleware Next.js** (o en layout server-side), no solo a nivel UI.

**Fix:** agregar `middleware.ts` que redirija a `/login-*` si no hay token para rutas protegidas (`/students/profile`, `/registrar-propiedad`, `/dashboard/*`).

### 4. `.git/config` expuesto (bloqueado pero presente)

**Severidad:** Alta si se puede bypassear, media si no.

`curl -I https://happyroomie.mx/.git/config` → 403 (no 404). Eso indica que el directorio `.git` **esta en el servidor** y solo el .htaccess de Hostinger lo bloquea. Si cambias de hosting o cambia la config, queda expuesto todo el historial git (incluye secretos pasados).

**Fix:** no subir `.git/` al deploy. Usa `.gitignore` del flujo de build o publica solo el output de `next build`.

---

## Bugs medios (P2)

### 5. Form de login con `method="get"` (riesgo si falla JS)

**Ubicacion:** `/login-landlord` — el `<form>` tiene `method="get"` y `action="https://happyroomie.mx/login-landlord"`. En funcionamiento normal, React intercepta con `preventDefault`, pero si el JS falla o el usuario tiene JS deshabilitado, el password viaja en la URL (queda en history, logs, referer).

**Fix:** cambiar a `method="post"` y, ya que estamos, eliminar el `action` por defecto.

### 6. Navbar mobile sin menu hamburger

**Repro:** abrir https://happyroomie.mx/ en 375px. El header solo muestra el logo y no hay forma de navegar a "Buscar propiedades", "Mi Dashboard", "Iniciar sesion" o "Registrarse" desde mobile.

**Fix:** agregar un `<button>` hamburger visible <768px que abra un drawer con los mismos links del desktop.

### 7. Headers de seguridad ausentes

Lo que devuelve hoy el edge:
- CSP = `upgrade-insecure-requests` (sin directivas defensivas reales)
- Sin HSTS
- Sin X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy
- `X-Powered-By: Next.js` y `Server: LiteSpeed` expuestos

**Fix:** agregar en `next.config.js` (o `.htaccess` de Hostinger):

```js
headers: [{
  source: '/(.*)',
  headers: [
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.happyroomie.mx" },
  ],
}]
```

Tambien `poweredByHeader: false` en `next.config.js`.

### 8. Accessibility — botones sin nombre accesible, heading-order

Lighthouse a11y: **0.93**. Issues:
- `button-name` score 0 — hay buttons (p. ej. el toggle de password en login, el icono del filtro) sin `aria-label` ni texto. Screen readers los anuncian como "button".
- `heading-order` score 0 — saltos de `<h1>` a `<h3>` sin pasar por `<h2>`.

**Fix:** agregar `aria-label` a cada button icon-only; revisar jerarquia `<h1>`/`<h2>`/`<h3>` en home y `/lessor`.

### 9. SVG path malformado en /students

Console error en `/students`: `Error: <path> attribute d: Expected number, "M16.707 5.293..."` (x3). Un SVG inline tiene `d` con valor invalido — no rompe visualmente pero ensucia la consola y puede causar no-render en browsers viejos.

**Fix:** buscar el SVG en los componentes usados por `/students` y corregir el atributo `d`.

---

## Bugs bajos / mejoras (P3)

### 10. Title global "Liviko" en todas las paginas

Todas las rutas devuelven `<title>Liviko</title>`. Mal para SEO y UX (tabs indistinguibles).

**Fix:** agregar `metadata: { title: '...' }` por page (`/app/students/page.tsx`, `/app/lessor/page.tsx`, etc.).

### 11. Perf — LCP 3.1s, TTFB 1080ms

- `server-response-time` score 0 — root doc tarda 1.08s. Hostinger no esta cacheando edge a pesar del header `x-nextjs-cache: HIT`. Revisar si el plan de Hostinger tiene CDN o mover a Vercel/Cloudflare Pages.
- `render-blocking-insight` — 90ms ahorrables; cargar fuentes con `font-display: swap`.
- `legacy-javascript-insight` — 11 KiB de polyfills innecesarios; ajustar `browserslist` a targets modernos.

---

## Lighthouse scores (home, desktop)

| Categoria | Score |
|---|---|
| Performance | 93 |
| Accessibility | 93 |
| Best Practices | 96 |
| SEO | 100 |

Reporte completo en `lighthouse-home.json` (gitignored recomendado).

---

## Quick wins (fix en <1h cada uno)

1. **Bug 1** — crear `client/.env.production` con `NEXT_PUBLIC_API_URL` y redesplegar. Una vez este el backend publico, todo el producto se desbloquea.
2. **Bug 10** — agregar `metadata.title` por page. 10 minutos, gran ganancia SEO.
3. **Bug 7** — copiar el bloque `headers` de arriba a `next.config.js`. Sube la nota de seguridad sin tocar logica.
4. **Bug 5** — cambiar `method="get"` → `method="post"` en el form de login.
5. **Bug 2** — arreglar los `<Link>` rotos del footer apuntando a rutas existentes o crear stubs de `/terminos`, `/privacidad`.

---

## Cobertura del testing

- 7 paginas navegadas con screenshots (home, /students, /students/profile, /lessor, /login-landlord, /dashboard, /properties, /registrar-propiedad)
- Console + network inspeccionados en cada una
- Bundle JS de prod escaneado por secretos (solo se encontro `localhost:3001`, no hay API keys ni tokens expuestos)
- Headers HTTP auditados con `curl -I`
- Responsive mobile (375px) + desktop (1440px)
- Probado submit de login (fallo esperado)
- Lighthouse perf/a11y/best-practices/seo

**No cubierto (para proxima pasada):**
- Flow de registro completo (requiere backend vivo)
- Pruebas XSS persistente (requiere submit real al backend)
- CSRF / rate limiting (requiere backend vivo)
- CORS config del backend
- Tablet (768px)
- Paginas de detalle de propiedad `/properties/[id]`
