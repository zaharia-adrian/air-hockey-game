import { WebSocketServer } from 'ws';
import { onConnection } from './handlers/connection.js';
export function setupWebSocketServer() {
    const wss = new WebSocketServer({ port: 8001 });
    wss.on('connection', (ws, req) => {
        onConnection(ws, wss, req);
    });
}
//# sourceMappingURL=index.js.map