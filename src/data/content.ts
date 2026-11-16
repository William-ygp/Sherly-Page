import type { Config, Surprise, Playlist, Song, Letter, TimelineItem, PhotoItem } from '../types';

export const config: Config = {
  title: "Te Amare Para Toda la vida",
  subtitle: "Un pedacito de nosotros en un rincon digital",
  from: "Williams",
  to: "El amor de mi vida (Sherly)",
  // Fecha y hora exactas de la sorpresa con zona horaria (ej. 2026-12-31T20:00:00-05:00)
  surpriseDate: "2026-11-22T20:00:00-05:00",
  showSeconds: false, // Cambia a true si deseas mostrar segundos en la cuenta regresiva
  secureCountdown: false, // Cambia a true para usar la API serverless en Vercel (SURPRISE_DATE en env)
  accessCodeHash: undefined, // Opcional: SHA-256 en minúsculas del PIN/código (ver README)
};

export const surprise: Surprise = {
  title: "REEMPLAZAR título de la revelación (ej. ¡Ha llegado el momento!)",
  message: "REEMPLAZAR mensaje que aparece cuando la cuenta llega a cero. Aquí puedes escribir las palabras especiales o los detalles de la sorpresa que habías estado guardando en secreto.",
};

export const playlists: Playlist[] = [
  { id: "todas", name: "Todas las canciones", description: "La colección completa de nuestra historia" },
  { id: "primera", name: "Nuestra primera vez", description: "Los temas que sonaban cuando todo empezó" },
  { id: "viajes", name: "En la carretera", description: "Para cantar a todo pulmón en nuestros viajes" },
  { id: "dias-dificiles", name: "Para los días difíciles", description: "Un abrazo en forma de melodía cuando me extrañes" },
];

export const songs: Song[] = [
  {
    id: "cancion-1",
    title: "REEMPLAZAR Canción 1 (ej. Yellow)",
    artist: "REEMPLAZAR Artista 1 (ej. Coldplay)",
    file: "/music/cancion-1.mp3",
    cover: "/covers/cancion-1.webp", // Opcional: si se omite, se generará una portada de gradiente
    note: "Elegí esta canción porque sonaba la noche en que me di cuenta de lo mucho que significabas para mí. Cada acorde me transporta directo a tus ojos.",
    playlist: "primera",
    duration: "4:29",
  },
  {
    id: "cancion-2",
    title: "REEMPLAZAR Canción 2 (ej. Lover)",
    artist: "REEMPLAZAR Artista 2 (ej. Taylor Swift)",
    file: "/music/cancion-2.mp3",
    cover: "/covers/cancion-2.webp",
    note: "Esta es la que siempre ponemos cuando cocinamos juntos los domingos por la tarde y bailamos descalzos en la sala.",
    playlist: "viajes",
    duration: "3:41",
  },
  {
    id: "cancion-3",
    title: "REEMPLAZAR Canción 3 (ej. Until I Found You)",
    artist: "REEMPLAZAR Artista 3 (ej. Stephen Sanchez)",
    file: "/music/cancion-3.mp3",
    note: "Para cuando sientas que el día se pone pesado. Cierra los ojos, escucha esta melodía y recuerda que siempre estoy contigo pase lo que pase.",
    playlist: "dias-dificiles",
    duration: "2:57",
  },
];

export const letter: Letter = {
  title: "Para mi princesa Hermosa",
  paragraphs: [
    "Te Amo con cada gota de mi ser mi vida hermosa, con cada latido de mi corazon te amo y te amo cada vez mas, eres la mujer que siempre soñe cuando pensaba con quien me gustaria pasar el resto de mi vida, eres tu esa mujer que estuve toda mi vida esperando.",
    "Y ahora que estas en mi vida solo pienso en hacerte feliz con cada dia que pase, en amarte y seguirnos eligiendo cada dia sin importar las dificultades o los obstaculos que la vida nos ponga.",
    "Ahora eres parte de mis sueños de mi futuro te amo como nunca eh amado a nadie, te deseo como nunca eh deseado a nadie y solo quiero que seas feliz a mi lado y yo ser tu complemento en esta vida que deseo vivir junto a ti.",
  ],
  signature: "Con todo mi amor, por y para siempre... Te amo en todos lo Universos...",
};

export const messages: string[] = [
  "Eres mi lugar favorito en el mundo entero.",
  "Adoro la forma en que sonríes ",
  "Gracias por enseñarme que el amor verdadero es tranquilo, cálido y seguro.",
  "No cambiaría ni un solo segundo de todo lo que hemos vivido juntos.",
  "Incluso en los días malos, tu voz me da paz.",
  "Prometo seguir eligiéndote cada día, una y otra vez.",
];

export const timeline: TimelineItem[] = [
  {
    date: "28 de Agosto 2026",
    title: "Nuestra primera cita",
    text: "El dia en que todo cambio, aunque fue nuestra primera cita juntos tambien fue en la que decidi tomar el riesgo de decirte lo que sentia luego de meses hablando, de concerte y de estas seguro de que me gustabas",
    photo: "public/photos/Primera_cita.jpg",
  },
  {
    date: "18 de Mayo, 2024",
    title: "REEMPLAZAR Nuestro primer viaje juntos",
    text: "El mar, el viento helado en la cara y esa sensación irrepetible de que con la persona correcta cualquier lugar es el paraíso.",
    photo: "/photos/02.webp",
  },
  {
    date: "25 de Diciembre, 2024",
    title: "REEMPLAZAR La noche que no queríamos que terminara",
    text: "Bailando en la sala a oscuras, solo con las luces del árbol y nuestras canciones favoritas sonando bajito.",
  },
  {
    date: "Hoy y siempre",
    title: "REEMPLAZAR Lo que aún nos queda por escribir",
    text: "Todos los amaneceres, las metas compartidas y cada sorpresa que el destino nos tiene preparada.",
  },
];

export const photos: PhotoItem[] = [
  {
    src: "/photos/01.webp",
    thumb: "/photos/01-thumb.webp",
    caption: "Aquella tarde en el mirador mirando el atardecer juntos.",
    date: "2024-02-14",
  },
  {
    src: "/photos/02.webp",
    thumb: "/photos/02-thumb.webp",
    caption: "Tu sonrisa espontánea frente al mar.",
    date: "2024-05-18",
  },
  {
    src: "/photos/03.webp",
    thumb: "/photos/03-thumb.webp",
    caption: "Un café, una libreta y horas de confidencias.",
    date: "2024-09-02",
  },
  {
    src: "/photos/04.webp",
    thumb: "/photos/04-thumb.webp",
    caption: "Bajo la lluvia, riéndonos empapados.",
    date: "2024-11-20",
  },
];
