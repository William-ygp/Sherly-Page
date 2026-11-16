# Página Dedicatoria — Liquid Glass Oscuro con Música

Una página web dedicatoria diseñada con una estética premium inspirada en el **Liquid Glass de Apple**, fondo oscuro y un reproductor de música integrado como pieza central, acompañada de carta interactiva, línea de tiempo, galería de fotos y una cuenta regresiva misteriosa.

---

## 🚀 Inicio Rápido

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Iniciar servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🎵 Cómo Subir y Configurar tu Música

1. **Colocar archivos MP3:**
   Guarda tus canciones en `public/music/`:
   ```text
   public/music/nuestra-cancion.mp3
   ```
2. **(Opcional) Carátula de la canción:**
   Coloca la imagen (WebP o JPG) en `public/covers/`:
   ```text
   public/covers/nuestra-cancion.webp
   ```
   *Nota:* Si no colocas carátula, la página generará automáticamente un degradado de cristal único basado en el título.
3. **Registrar en `src/data/content.ts`:**
   ```ts
   export const songs: Song[] = [
     {
       id: "mi-cancion-1",
       title: "Título de la canción",
       artist: "Nombre del artista",
       file: "/music/nuestra-cancion.mp3",
       cover: "/covers/nuestra-cancion.webp", // Opcional
       note: "Por qué elegí esta canción para nosotros...",
       playlist: "primera", // O 'viajes', 'dias-dificiles', etc.
       duration: "3:45"
     }
   ];
   ```

### ⚡ Optimización con FFmpeg (Recomendado para móviles)
Para que las canciones carguen al instante incluso con datos móviles, convierte tus audios a MP3 de 128 o 192 kbps:

```bash
ffmpeg -i "archivo_original.m4a" -b:a 192k -map_metadata 0 "public/music/cancion.mp3"
```

### ☁️ Almacenamiento Externo (Cloudflare R2, AWS S3 o CDN)
Si tienes muchas canciones pesadas, puedes subirlas a un bucket público o CDN y usar la URL completa en el campo `file`:
```ts
file: "https://mi-cdn.com/musica/cancion.mp3"
```
*Importante:* En `vercel.json`, debes autorizar el dominio en la directiva `media-src`:
```json
"media-src 'self' blob: https://mi-cdn.com;"
```

---

## 📸 Cómo Subir y Optimizar Fotos

1. Coloca tus fotos originales en alta resolución (JPG, PNG) en la carpeta `photos-src/`.
2. Ejecuta el script de optimización:
   ```bash
   npm run optimize:photos
   ```
   Este comando convertirá las imágenes a formato moderno **WebP** (máximo 1600px de ancho) y generará miniaturas livianas de 600px en `public/photos/`.
3. Registra las fotos en `src/data/content.ts` dentro de `photos`:
   ```ts
   export const photos: PhotoItem[] = [
     {
       src: "/photos/01.webp",
       thumb: "/photos/01-thumb.webp",
       caption: "Aquel atardecer en el mirador.",
       date: "2024-02-14"
     }
   ];
   ```

---

## ⏳ Cuenta Regresiva Misteriosa & Seguridad

### Modo Normal
En `src/data/content.ts`:
- `surpriseDate`: Fecha y hora exactas con zona horaria (ej. `2027-02-14T20:00:00-05:00`).
- Los días siempre muestran `??` con un efecto glitch y ráfagas aleatorias. **Nunca se expone ni calcula el número de días en el DOM ni en la consola.**
- Las horas y minutos descuentan solo el tiempo restante dentro del ciclo diario.
- *Nota de privacidad:* Dado que la fecha vive en el código del cliente, una persona con conocimientos técnicos que inspeccione el código fuente (`content.ts` empaquetado) podría deducir la fecha.

### Modo Reforzado (`secureCountdown`)
Si deseas que la fecha sea 100% secreta:
1. Cambia en `src/data/content.ts`:
   ```ts
   secureCountdown: true,
   ```
2. En tu panel de Vercel (o en tu archivo `.env.local`):
   ```env
   SURPRISE_DATE=2027-02-14T20:00:00-05:00
   ```
3. La función serverless `api/countdown.ts` calculará las horas y minutos restantes sin exponer los días en ningún momento, sincronizándose cada 5 minutos.

---

## 🔒 Código de Acceso / PIN (Opcional)

Si deseas una puerta de entrada con código PIN:
1. Define un PIN (ejemplo: `1402`).
2. Genera su hash SHA-256 en la consola del navegador:
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('1402'))
     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')));
   ```
3. Coloca el hash resultante en minúsculas en `src/data/content.ts`:
   ```ts
   accessCodeHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
   ```
4. Si no deseas clave, déjalo en `undefined`.

---

## 🎨 Animaciones de Corazones (Solo por Acciones)

El sistema de partículas vectoriales en canvas (`HeartFX`) se activa **únicamente** tras acciones específicas:
- **Tocar "Entrar"**: Lluvia de corazones (3.8 s).
- **Primera reproducción**: Pulso en el reproductor y 6 corazones que suben desde el botón de play.
- **Marcar favorita**: Salto de corazón con explosión de destellos.
- **Abrir la carta**: Lluvia suave (4 s).
- **Tocar un mensaje**: Pequeños corazones que flotan desde el botón.
- **Doble toque en una foto**: Corazón grande que salta sobre la imagen (estilo red social).
- **Llegada a cero**: Lluvia grande con revelación de la sorpresa.
- **"Una última sorpresa"**: Lluvia grande de 5 s.

*Accesibilidad:* Con `prefers-reduced-motion` activado, las partículas se desactivan automáticamente y las esferas ambientales se pausan para cuidar el rendimiento y la comodidad visual.

