/**
 * Normaliza las rutas de archivos dentro de public/.
 * Si el usuario escribe "/public/photos/foto.jpg" o "public/music/audio.mp3",
 * lo convierte a "/photos/foto.jpg" o "/music/audio.mp3" para que el navegador lo cargue sin error.
 */
export function normalizeAssetUrl(url?: string): string {
  if (!url) return '';
  let clean = url;
  if (clean.startsWith('/public/')) {
    clean = clean.replace('/public/', '/');
  } else if (clean.startsWith('public/')) {
    clean = '/' + clean.replace('public/', '');
  }
  // encodeURI preserva las barras y codifica espacios para evitar problemas en navegadores y CSS
  return encodeURI(clean);
}

