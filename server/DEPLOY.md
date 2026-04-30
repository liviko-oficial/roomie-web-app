# Deploy del backend Happy Roomie

El frontend ya está vivo en Vercel. El backend Express+MongoDB falta deployar para que la app funcione end-to-end en producción.

## Opción recomendada: Railway

1. **Cuenta Mongo Atlas** (https://cloud.mongodb.com)
   - Crea cluster M0 free (512MB).
   - Network access: agrega `0.0.0.0/0` (Railway no tiene IP fija).
   - Database access: crea user con password.
   - Copia connection string: `mongodb+srv://USER:PASS@cluster.mongodb.net/happyroomie?retryWrites=true&w=majority`

2. **Cuenta Railway** (https://railway.app)
   - "New Project" → "Deploy from GitHub repo" → selecciona `liviko-oficial/roomie-web-app`.
   - Branch: `newMethod`.
   - Root directory: `server`.
   - Railway detecta automáticamente el `Dockerfile`.

3. **Env vars en Railway** (Settings → Variables):
   ```
   PORT=3001
   DB_URL=<la connection string de Atlas>
   JWT_SECRET=<un string random largo>
   FROM_EMAIL=service@happyroomie.mx
   RESEND_KEY=<tu key de resend, o "placeholder" si aún no la tienes>
   BASE_URL=<la URL pública que Railway asigne>
   API_DOCS_PATH=api-docs/openapi.yml
   CLOUDINARY_CLOUD_NAME=dmkn6qvm1
   CLOUDINARY_API_KEY=<tu API key>
   CLOUDINARY_API_SECRET=<tu API secret>
   ```

4. **Public domain en Railway**: Settings → Networking → Generate Domain. Copia la URL (algo como `happyroomie-server-production.up.railway.app`).

5. **Vercel env vars** (https://vercel.com → tu project → Settings → Environment Variables):
   - `BACKEND_PROXY_TARGET=https://<URL-de-railway>` (sin `/api` al final)
   - `NEXT_PUBLIC_API_URL=https://<URL-de-railway>` (igual)
   - Trigger redeploy en Vercel.

6. **Verificar**: visitar la URL Vercel → registrar arrendador → registrar propiedad → ver detalle.

## Alternativa: Render

Mismo flujo, pero:
- Render free tier tiene cold start (~30s la primera vez después de inactividad).
- Soporta Dockerfile.
- Crea Web Service → Connect repo → root `server` → Docker.

## Alternativa: Fly.io

```
cd server
fly launch  # detecta Dockerfile, te guía
fly secrets set DB_URL=... JWT_SECRET=... CLOUDINARY_API_SECRET=...
fly deploy
```

## Test local del Dockerfile

```bash
cd server
docker build -t happyroomie-server .
docker run --rm -p 3001:3001 --env-file .env.local happyroomie-server
# Visita http://localhost:3001/api/propiedades-renta
```

## Troubleshooting

**Connection refused a MongoDB:**
- Verifica que Atlas tenga `0.0.0.0/0` en Network Access.
- Connection string debe incluir el database name: `/happyroomie?...`.

**CORS errors en Vercel:**
- El rewrite `/api/*` → backend en `next.config.ts` resuelve esto, no necesitas CORS.
- Si setees `NEXT_PUBLIC_API_URL=URL_absoluta_backend`, sí necesitarás CORS configurado en el server (ya está en `index.ts`).

**Cloudinary 401:**
- Cloud name + API key + API secret tienen que matchear los del dashboard de Cloudinary.
- API secret termina en `=`; verifica que se copió completo.
