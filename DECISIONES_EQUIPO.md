# Decisiones pendientes — happyroomie.mx

**Para:** equipo de programacion Happy Roomie
**De:** Carlos (via auditoria tecnica del sitio en prod)
**Fecha:** 2026-04-13
**Contexto:** El sitio `https://happyroomie.mx` (rama `subirPag`) ya esta desplegado en Hostinger, pero una auditoria encontro **11 problemas** que necesitan decisiones suyas antes de arreglarse. Este doc explica cada uno en lenguaje claro y deja un espacio `[ ] Decision:` al final de cada item para que marquen que van a hacer.

El reporte tecnico completo esta en [BUG_REPORT.md](./BUG_REPORT.md). Aqui esta la version para discutir en equipo.

**Como usar este doc:**
1. Lean cada item.
2. En el bloque `Decision del equipo:` al final de cada uno, escriban lo acordado (fix, posponer, descartar, quien lo toma).
3. Cuando esten todos marcados, arrancamos la implementacion.

---

## 1. [P0 — CRITICO] El sitio en produccion le habla a `localhost:3001`

### Que pasa

Cuando un usuario entra a happyroomie.mx y la pagina intenta buscar propiedades, hacer login, o registrar algo, el navegador intenta conectarse a `http://localhost:3001` — **la computadora del propio usuario**. Por eso hoy:

- Buscar propiedades siempre dice "0 resultados".
- Login de arrendador no funciona.
- Registrar propiedad avanza en la UI pero nunca guarda nada.

### Por que pasa

En el codigo ([client/lib/api/client.ts:3-4](client/lib/api/client.ts#L3-L4)):

```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

Eso significa: "usa la variable `NEXT_PUBLIC_API_URL`; si no existe, usa `localhost:3001`". Cuando se hizo el build para produccion, esa variable **no estaba configurada**, entonces Next.js dejo el fallback hardcodeado dentro del JavaScript que descargan los visitantes.

### Decisiones que necesitamos

Esto tiene dos partes independientes:

**A. ¿Donde va a vivir el backend Express (`server/`)?** Hoy solo existe en las laptops de desarrollo. Opciones:

| Opcion | Pros | Contras |
|---|---|---|
| **Hostinger (mismo hosting actual)** con Node app en subdominio `api.happyroomie.mx` | Todo en un solo proveedor, factura unica | Requiere plan que soporte Node persistente; configuracion manual |
| **Railway** | Deploy en 5 min desde git; free tier generoso | Otro proveedor mas |
| **Render** | Similar a Railway, free tier con auto-sleep | Cold starts |
| **Vercel Serverless Functions** (portar Express) | Mismo ecosistema que el frontend | Requiere refactor de Express → handlers |

**B. ¿Que dominio le damos al backend?** Sugerencia: `api.happyroomie.mx`. Afecta CORS y la variable de entorno del frontend.

### Que hay que hacer una vez decidido

1. Desplegar el backend en el host elegido.
2. Crear `client/.env.production` con `NEXT_PUBLIC_API_URL=https://<dominio-backend>`.
3. Rebuild + redeploy del client en Hostinger.
4. Verificar en prod que ya no aparezca `localhost:3001` en Network tab.

**Decision del equipo:**
- [ ] Hosting del backend:
- [ ] Dominio del backend:
- [ ] Responsable:
- [ ] Fecha objetivo:

---

## 2. [P1 — ALTO] Hay 8+ links en el sitio que llevan a paginas que no existen

### Que pasa

Cuando un usuario hace clic (o simplemente pasa el mouse) sobre ciertos links, el navegador intenta cargar paginas que regresan **404**. Lista:

- `/propiedades` (linkeado desde footer de `/lessor`) — la pagina real se llama `/properties`
- `/perfil` — la real se llama `/students/profile`
- `/contacto` — no existe
- `/login-student` — no existe (solo hay `/login-landlord`)
- `/registro-arrendador` — no existe
- `/recuperar-contrasena` — no existe
- `/terminos` — no existe
- `/privacidad` — no existe

### Por que pasa

El codigo mezcla nombres en espanol e ingles. Los `<Link>` del footer apuntan a versiones en espanol, pero las rutas reales estan en ingles.

### Decisiones que necesitamos

**A. ¿Que idioma usamos en las URLs?** Recomiendo escoger uno y convertir todo.

- Espanol (`/propiedades`, `/perfil`, `/iniciar-sesion`) → mejor para SEO local mexicano y usuarios.
- Ingles (`/properties`, `/profile`, `/login`) → ya es lo que esta implementado.
- Hibrido → no recomendado.

**B. ¿Que hacemos con las paginas que de verdad no existen?**

- `/login-student`, `/registro-arrendador`, `/recuperar-contrasena` — son flows reales que **deberian existir**. ¿Entran en este sprint?
- `/terminos`, `/privacidad` — requisito legal. Se puede hacer paginas estaticas simples por ahora.
- `/contacto` — ¿queremos un form de contacto o basta con un mailto?

**Decision del equipo:**
- [ ] Idioma URLs (ES / EN / migrar):
- [ ] Login estudiante: existe sprint? cuando?
- [ ] Registro arrendador: existe sprint? cuando?
- [ ] Recuperar contrasena: existe sprint? cuando?
- [ ] Terminos + Privacidad: quien redacta el contenido legal?
- [ ] Contacto: form o mailto?

---

## 3. [P1 — ALTO] Dos paginas sensibles se pueden abrir sin iniciar sesion

### Que pasa

Cualquiera puede entrar directo a:

- `https://happyroomie.mx/students/profile` — wizard completo de perfil de estudiante
- `https://happyroomie.mx/registrar-propiedad` — wizard de dar de alta una propiedad

Y avanzar varios pasos **sin estar logueado**. En contraste, `/dashboard` si dice "Inicia sesion para ver tu dashboard".

### Por que es un problema

- Un bot puede spamear el wizard de registrar propiedad y llenar la base de datos de basura.
- Rompe la sensacion de seguridad del producto (los usuarios esperan que rutas "personales" esten protegidas).
- Si el backend **no** valida el token en el submit final, cualquiera publica propiedades falsas.

### Decisiones que necesitamos

**A. ¿El backend ya valida auth en los endpoints de submit?** Hay que verificarlo. Si **si**, el riesgo es bajo (solo UX raro). Si **no**, es critico.

**B. ¿Agregamos guards en el frontend tambien?** Recomendado: un `middleware.ts` en Next que redirija a `/login-*` si no hay token para rutas protegidas.

**Decision del equipo:**
- [ ] Validar que el backend tenga auth en submit (quien verifica):
- [ ] Agregar middleware de Next con redirect:
- [ ] Rutas a proteger: `/students/profile`, `/registrar-propiedad`, `/dashboard/*`, otras?:

---

## 4. [P1 — ALTO] El directorio `.git` esta subido al servidor

### Que pasa

Al probar `curl https://happyroomie.mx/.git/config` el servidor responde `403 Forbidden` (bloqueado) en vez de `404 Not Found` (no existe). Eso significa que **el directorio `.git/` si esta en el servidor**, solo que Hostinger lo bloquea con su configuracion por defecto.

### Por que es un problema

Si algun dia cambiamos de hosting, o si Hostinger cambia su default, el `.git/` completo queda expuesto. Eso incluye **todo el historial de commits**, que puede contener secretos que alguien metio y luego borro (API keys viejas, credenciales de testing, etc.).

### Decisiones que necesitamos

El fix correcto es no subir `.git/` al deploy. Opciones:

- **A.** Configurar el script de deploy para que haga `next build` y suba **solo** el output (recomendado).
- **B.** Agregar una regla en `.htaccess` explicita que bloquee `.git/` (defensa en profundidad, no arregla la raiz).
- **C.** Ambas.

**Decision del equipo:**
- [ ] Opcion A / B / C:
- [ ] Responsable del deploy pipeline:

---

## 5. [P2 — MEDIO] El form de login usa `method="get"` — riesgo si falla el JS

### Que pasa

El formulario de `/login-landlord` tiene esto en el HTML:

```html
<form method="get" action="https://happyroomie.mx/login-landlord">
```

Normalmente React intercepta el submit con JavaScript y todo funciona bien. Pero si el JS falla a cargar (conexion lenta, bloqueador, bug), el formulario usa su comportamiento por defecto y **manda el password en la URL como query param**:

`https://happyroomie.mx/login-landlord?email=foo@bar.com&password=SecretoDelUsuario`

Esa URL queda guardada en el historial del navegador, en logs del servidor, y en el header `Referer` que se manda al hacer clic en cualquier link de la pagina de destino.

### Fix

Cambiar `method="get"` → `method="post"` (y eliminar el `action` redundante).

**Decision del equipo:**
- [ ] Fix aprobado (es trivial):

---

## 6. [P2 — MEDIO] No hay menu hamburger en mobile

### Que pasa

En pantallas <768px, el header solo muestra el logo. Los links "Inicio", "Buscar propiedades", "Mi Dashboard", "Iniciar sesion", "Registrarse" **desaparecen** y no hay ningun boton que los muestre.

Resultado: un usuario mobile no puede navegar el sitio despues de llegar a la home.

### Fix

Agregar un boton hamburger (`<button aria-label="Menu">`) visible solo en mobile que abra un drawer con los mismos links del desktop.

**Decision del equipo:**
- [ ] Diseno del drawer (¿alguien en UI lo disena o usamos el default de shadcn/Tailwind?):
- [ ] Responsable:

---

## 7. [P2 — MEDIO] Faltan headers de seguridad HTTP

### Que pasa

Cuando el servidor responde, faltan varios headers estandar que protegen contra ataques comunes. Los mas importantes:

| Header | Que protege | Estado actual |
|---|---|---|
| `Strict-Transport-Security` | Fuerza HTTPS | Ausente |
| `X-Frame-Options` | Evita que nos metan en un iframe malicioso (clickjacking) | Ausente |
| `X-Content-Type-Options` | Evita "MIME sniffing" | Ausente |
| `Content-Security-Policy` | Control fino sobre que puede cargar la pagina | Casi ausente |
| `Referrer-Policy` | Controla que info enviamos a otros sitios | Ausente |

Ademas exponemos `X-Powered-By: Next.js` y `Server: LiteSpeed`, que le dice al atacante que tecnologia usamos.

### Fix

Agregar un bloque de `headers()` en `next.config.js` (el `BUG_REPORT.md` ya tiene el snippet listo para copiar/pegar).

### Decisiones que necesitamos

**A. ¿Que tan estricto hacemos el CSP?** Un CSP estricto rompe cualquier script inline o asset de tercero no declarado. Si usamos Google Analytics, Hotjar, Stripe, Cloudinary, etc., hay que listarlos.

**Decision del equipo:**
- [ ] Headers basicos aprobados:
- [ ] Lista de terceros que cargamos (para el CSP):
- [ ] Responsable:

---

## 8. [P2 — MEDIO] Accesibilidad: botones sin nombre + encabezados desordenados

### Que pasa

Lighthouse dio 93/100 en accesibilidad. Los dos issues reales:

- **Botones sin nombre accesible:** hay botones que solo tienen un icono (ej. el ojito para mostrar/ocultar password, el filtro en `/properties`). Un lector de pantalla los anuncia como "button" y el usuario ciego no sabe que hacen.
- **Encabezados fuera de orden:** hay paginas que saltan de `<h1>` a `<h3>` sin pasar por `<h2>`. Confunde a lectores de pantalla y penaliza SEO.

### Fix

- Agregar `aria-label="..."` a cada boton de icono.
- Revisar jerarquia de encabezados en home, `/lessor`, `/students`.

**Decision del equipo:**
- [ ] Pasada rapida de a11y aprobada:
- [ ] Responsable:

---

## 9. [P2 — MEDIO] Error en consola: SVG con atributo invalido en /students

### Que pasa

Al cargar `/students`, la consola del navegador muestra 3 veces:

```
Error: <path> attribute d: Expected number, "M16.707 5.293..."
```

Un SVG inline tiene el atributo `d` malformado. No rompe visualmente pero ensucia la consola y puede fallar en browsers antiguos.

### Fix

Buscar el SVG en los componentes usados por `/students` y corregir el valor de `d`.

**Decision del equipo:**
- [ ] Fix aprobado:
- [ ] Responsable:

---

## 10. [P3 — BAJO] Todas las paginas tienen el mismo title "Liviko"

### Que pasa

Cada pagina del sitio devuelve `<title>Liviko</title>`. Problemas:

- SEO: Google indexa todas las paginas con el mismo titulo → compiten entre si.
- UX: si un usuario tiene varias tabs abiertas, no puede distinguir cual es cual.

### Fix

Agregar `export const metadata = { title: '...' }` en cada page (`/app/students/page.tsx`, `/app/lessor/page.tsx`, etc.).

**Decision del equipo:**
- [ ] Responsable + lista de titulos propuestos:

---

## 11. [P3 — BAJO] Performance — TTFB alto y LCP 3.1s

### Que pasa

Lighthouse dio Performance 93/100. Issues medibles:

- **Server Response Time: 1080ms** — el documento raiz tarda mas de 1 segundo en empezar a llegar. Raro para un sitio estatico de Next.js con cache hit.
- **LCP 3.1s** — la imagen/titulo principal tarda 3.1s en aparecer.
- **Render blocking:** 90ms ahorrables en fuentes.
- **Legacy JS:** 11 KiB de polyfills innecesarios.

### Posible causa

El plan de Hostinger actual puede no tener CDN edge. Alternativas: Vercel, Cloudflare Pages, o activar CDN en Hostinger si el plan lo permite.

### Decisiones que necesitamos

**A. ¿Queremos invertir en mejorar perf ahora o dejarlo para despues?** No es urgente si el sitio funciona, pero afecta conversion.

**B. Si la respuesta es si: ¿hacemos cambio de hosting o optimizacion dentro de Hostinger?**

**Decision del equipo:**
- [ ] Priorizar perf ahora / despues:
- [ ] Si ahora: CDN en Hostinger / mover a Vercel / otro:

---

## Resumen de decisiones pendientes

| # | Bug | Bloqueador | Decision critica |
|---|---|---|---|
| 1 | URL backend | Toda la funcionalidad core | Hosting del backend + dominio |
| 2 | Rutas 404 | UX roto | Idioma URLs, cuales crear |
| 3 | Auth bypass | Spam / seguridad | Validar backend + middleware frontend |
| 4 | .git expuesto | Seguridad futura | Pipeline de deploy |
| 5 | method=get en login | Riesgo bajo pero real | Fix trivial, solo aprobar |
| 6 | Navbar mobile | UX mobile roto | Quien disena + quien implementa |
| 7 | Headers seguridad | Defensa en profundidad | Lista de terceros para CSP |
| 8 | A11y | 7 puntos de Lighthouse | Responsable |
| 9 | SVG malformado | Ruido en consola | Responsable |
| 10 | Title global | SEO | Responsable + lista titulos |
| 11 | Performance | Nice to have | Invertir ahora o despues |

---

## Siguiente paso

Agendar una reunion de 30 min con el equipo para:

1. Leer este doc juntos (5 min por item = 55 min, demasiado). Alternativa: cada quien lo lee antes y la reunion es solo para decidir.
2. Llenar los bloques `Decision del equipo:`.
3. Asignar responsables y fechas.
4. Generar tickets en su sistema (Jira / Linear / Trello / lo que usen).

**Una vez llenas las decisiones, avisan y arranco la implementacion de los fixes aprobados.**
