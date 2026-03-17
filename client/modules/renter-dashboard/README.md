# Dashboard de solicitudes

Aqui el estudiante puede ver todas las solicitudes que ha hecho a las propiedades.

## Archivos

- `components/RequestCard.jsx` - la tarjeta que muestra cada solicitud
- `sections/DashboardHeader.jsx` - el header amarillo con el titulo
- `sections/RequestColumns.jsx` - las 3 secciones (en proceso, aprobadas, rechazadas)
- `mock/requests.js` - datos fake para probar

## Como funciona

Las solicitudes se dividen en 3 categorias:
- En proceso (amarillo) - todavia no hay respuesta
- Aprobadas (verde) - el arrendador dijo que si
- Rechazadas (rojo) - el arrendador dijo que no

Cada tarjeta muestra:
- Foto de la propiedad
- Precio
- Info del arrendador
- Mensaje que dejo el arrendador
- Si hay oferta o no
- Botones para mandar email o llamar

## Para agregar mas datos de prueba

Ir a `mock/requests.js` y copiar uno de los objetos que ya estan, cambiar los datos y listo.

Los status que se pueden usar:
- status: "en_proceso" | "aprobada" | "rechazada"
- offerStatus: "sin_oferta" | "contraoferta_por_revisar" | "oferta_aceptada" | "oferta_rechazada"

## Cosas que faltan por hacer

- Conectar con el backend real
- Agregar funcionalidad para aceptar/rechazar contraofertas
- Notificaciones cuando cambie el estado
