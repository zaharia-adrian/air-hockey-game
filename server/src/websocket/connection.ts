import { WebSocket, WebSocketServer } from 'ws'
import { MessageType } from '../types/message.type.js';
import { parse } from 'url'
import * as gameService from './game.service.js'

export function onConnection(ws: WebSocket, wss: WebSocketServer, req) {

    const parsedUrl = parse(req.url, true);
    const username = parsedUrl.query.username as string;
    gameService.add(username, ws);

    ws.on('message', (message: any) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case MessageType.CREATE_ROOM:
                gameService.createRoom(username, data.roomName);
                break;
            case MessageType.GET_ROOMS:
                gameService.getRooms(username);
                break;
            case MessageType.JOIN_ROOM:
                gameService.joinRoom(username, data.roomId);
                break;
            case MessageType.END_ROOM:
                gameService.endRoom(username);
                break;
            case MessageType.CHAT:
                gameService.sendChat(username, data.chat);
                break;
            case MessageType.UPDATE_PADDLE:
                gameService.updatePaddle(username, data.payload);
                break;
            case MessageType.START_GAME:
                gameService.startGame(username);
        }
    });


    ws.on('close', () => {
        gameService.endRoom(username);
        gameService.remove(username);
    });
}