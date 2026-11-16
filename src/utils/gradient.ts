/**
 * Genera un fondo con degradado armónico determinista basado en el título de la canción.
 * Útil cuando una canción no tiene carátula personalizada.
 */
export function getDeterministicGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 45 + Math.abs((hash >> 4) % 60)) % 360;

  return `linear-gradient(135deg, hsl(${hue1}, 55%, 22%) 0%, hsl(${hue2}, 65%, 12%) 100%)`;
}
