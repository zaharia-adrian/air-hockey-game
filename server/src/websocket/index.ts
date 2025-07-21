import {WebSocketServer, WebSocket} from 'ws'
import { onConnection } from './connection.js';


export function setupWebSocketServer(){
    const wss = new WebSocketServer({port:8001});
    
    wss.on('connection', (ws:WebSocket, req:Request)=>{
        onConnection(ws, wss, req);
    });

};