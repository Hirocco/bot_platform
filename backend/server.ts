import app from './app'; // Import Twojej aplikacji Express z app.ts
import http from 'http';
import { Server as WebSocketServer } from 'ws';

const PORT = process.env.PORT || 7000;

// Tworzymy serwer HTTP na bazie Expressa
const server = http.createServer(app);

// Inicjalizacja serwera WebSocket (ws) przy użyciu tego samego serwera HTTP
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Nowe połączenie WebSocket');

  // Odbieranie wiadomości z klienta
  ws.on('message', (message: string) => {
    console.log('Otrzymano wiadomość:', message);
    
    // Przykładowa odpowiedź – echo
    ws.send(`Otrzymano: ${message}`);
  });

  ws.on('close', () => {
    console.log('Połączenie WebSocket zamknięte');
  });
});

// Uruchomienie serwera HTTP (który obsługuje zarówno API, jak i WebSockety)
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
