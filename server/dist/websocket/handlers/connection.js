import { MessageType } from '../../types/message.type.js';
import * as gameService from '../services/game.service.js';
import url from 'url';
export function onConnection(ws, wss, req) {
    const { username } = url.parse(req.url, true).query;
    const usernameStr = username;
    gameService.add(username, ws);
    console.log('USername str1:', usernameStr);
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case MessageType.CREATE_ROOM:
                console.log('USername str2:', usernameStr);
                console.log('Message:', data);
                // gameService.createRoom(usernameStr, data.roomName);
                break;
        }
    });
    ws.on('close', () => {
        gameService.remove(username);
    });
}
//# sourceMappingURL=connection.js.map