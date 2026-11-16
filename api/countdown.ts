import type { IncomingMessage, ServerResponse } from 'http';

interface CountdownResponse {
  hours: number;
  minutes: number;
  seconds: number;
  released: boolean;
  error?: string;
}

export default function handler(
  _req: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const targetStr = process.env.SURPRISE_DATE;
  if (!targetStr) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'SURPRISE_DATE no está configurado en las variables de entorno' }));
    return;
  }

  const target = new Date(targetStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target)) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'SURPRISE_DATE tiene un formato de fecha inválido' }));
    return;
  }

  if (diff <= 0) {
    const payload: CountdownResponse = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      released: true,
    };
    res.statusCode = 200;
    res.end(JSON.stringify(payload));
    return;
  }

  // Horas y minutos restantes DENTRO del día. Nunca se exponen los días ni el total acumulado.
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  const payload: CountdownResponse = {
    hours,
    minutes,
    seconds,
    released: false,
  };

  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}
