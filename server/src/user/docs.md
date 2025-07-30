## User

Esta es la ubicacion de toda la logica realacionada a los usuarios y el auth

## Rutas

\* Estas rutas desde /api/∗

\* ! significa ruta protegida

POST: /register -> registro de usuario en sistema de verificación de email

GET: /register/verify?email&token -> valida el token para crear el usuario en partial db

POST: /login -> login de los usuarios

GET!: /login/upgrade-partial -> cambiar privilegios de usuario parcial a usuario permanente

GET!: /user -> info del usuario

DELETE!:/user -> eliminar usuario
