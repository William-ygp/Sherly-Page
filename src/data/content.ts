import type { Config, Surprise, Playlist, Song, Letter, TimelineItem, PhotoItem } from '../types';

export const config: Config = {
  title: "Te Amare Para Toda la vida",
  subtitle: "Un pedacito de nosotros en un rincon digital",
  from: "Williams",
  to: "El amor de mi vida (Sherly)",
  // Fecha y hora exactas de la sorpresa con zona horaria (ej. 2026-12-31T20:00:00-05:00)
  surpriseDate: "2026-11-22T20:00:00-05:00",
  showSeconds: true, // Mostrar segundos para ver el contador en vivo segundo a segundo
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
    id: "ella-es-mi-todo",
    title: "Ella Es Mi Todo",
    artist: "Kaleth Morales",
    file: "/music/Ella Es Mi Todo(MP3_160K).mp3",
    cover: "/covers/ella_es_mi_todo.jpeg",
    note: "Porque eres exactamente eso: mi todo, mi presente y la persona que ilumina cada uno de mis días.",
    playlist: "primera",
    duration: "4:44",
  },
  {
    id: "vivo-en-el-limbo",
    title: "Vivo En El Limbo",
    artist: "Kaleth Morales & Andrés Herrera",
    file: "/music/Kaleth Morales_ Andrés Herrera - Vivo en el limbo (Cover Audio)(MP3_160K).mp3",
    cover: "/covers/ella_es_mi_todo.jpeg",
    note: "Para bailar, cantar y recordar lo feliz y loco de amor que me tienes desde el primer instante.",
    playlist: "viajes",
    duration: "6:18",
  },
  {
    id: "iris",
    title: "Iris",
    artist: "The Goo Goo Dolls",
    file: "/music/Iris(MP3_160K).mp3",
    cover: "/covers/Iris.jpeg",
    note: "'And I'd give up forever to touch you, 'cause I know that you feel me somehow...' Para cuando me extrañes o el día sea pesado.",
    playlist: "dias-dificiles",
    duration: "4:50",
  },
  {
    id: "mi-amor-eres-tu",
    title: "Mi Amor Eres Tú",
    artist: "Silvestre Dangond & Juancho De La Espriella",
    file: "/music/Mi Amor Eres Tú_ Silvestre Dangond _ Juancho De La Espriella - Letra Oficial(MP3_160K).mp3",
    cover: "/covers/mi amor eres tu.jpeg",
    note: "Una declaración con toda el alma: no hay nadie más en mi camino, mi único y verdadero amor eres tú.",
    playlist: "primera",
    duration: "4:43",
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
    photo: "/photos/Primera_cita.jpg",
  }
];

export const photos: PhotoItem[] = [
  { src: "/photos/1794860095329.jpg" },
  { src: "/photos/1794860095405.jpg" },
  { src: "/photos/IMG-20260829-WA0010.jpg" },
  { src: "/photos/IMG-20261004-WA0048.jpg" },
  { src: "/photos/IMG-20261014-WA0115.jpg" },
  { src: "/photos/IMG-20261025-WA0040.jpg" },
  { src: "/photos/IMG-20261105-WA0008.jpg" },
  { src: "/photos/IMG-20261105-WA0009.jpg" },
  { src: "/photos/IMG-20261112-WA0076.jpg" },
  { src: "/photos/IMG-20261114-WA0000.jpg" },
  { src: "/photos/Primera_cita.jpg" },
];
