/**
 * Normaliza las rutas de archivos dentro de public/.
 * Si el usuario escribe "/public/photos/foto.jpg" o "public/music/audio.mp3",
 * lo convierte a "/photos/foto.jpg" o "/music/audio.mp3" para que el navegador lo cargue sin error.
 */
export function normalizeAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('/public/')) {
    return url.replace('/public/', '/');
  }
  if (url.startsWith('public/')) {
    return '/' + url.replace('public/', '');
  }
  return url;
}

