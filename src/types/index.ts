export interface Config {
  title: string;
  subtitle: string;
  from: string;
  to: string;
  surpriseDate: string; // ISO-8601 with timezone (e.g. 2026-12-31T23:59:59-05:00)
  showSeconds: boolean;
  secureCountdown: boolean;
  accessCodeHash?: string;
}

export interface Surprise {
  title: string;
  message: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  cover?: string;
  note: string;
  playlist: string;
  duration?: string; // Optional pre-calculated duration (e.g. "3:42")
}

export interface Letter {
  title: string;
  paragraphs: string[];
  signature: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  text: string;
  photo?: string;
}

export interface PhotoItem {
  src: string;
  thumb?: string;
  caption?: string;
  date?: string;
}

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  released: boolean;
}
