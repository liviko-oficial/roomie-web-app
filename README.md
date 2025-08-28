# rommie-web-app

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


Este branch se creó para el procesamiento de imágenes con una API.
Para verlo está dentro de la carpeta de Scr/Api. El nombre del archivo Api_img.js
El archivo procesa lo siguiente:
-	Una imagen obligatoria para usarla como imagen principal.
-	Seis imágenes opcionales.

Características de las imágenes
-	Procesa imágenes con un tamaño de 50 MB (50 * 1024 * 1024 bytes)
-	Solo recibe jpeg, jpg, png y webp. Cualquier otro tipo de archivo será rechazado.
Solo es una Api que procesa imágenes, no lo envía a ningún lado.

