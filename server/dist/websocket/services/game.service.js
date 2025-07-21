import { v4 as uuid } from 'uuid';
import { ClientStatus } from '../../types/clientStatus.type.js';
import { MessageType } from '../../types/message.type.js';
let clients = new Map();
let rooms = new Map();
export const add = (username, ws) => {
    clients.set(username, { socket: ws, status: ClientStatus.NEW });
};
export const remove = (username) => {
    clients.delete(username);
};
export const getClients = () => {
    return Array.from(clients.keys());
};
export const createRoom = (username, roomName) => {
    const roomId = uuid();
    rooms.set(roomId, { roomName, clientUsername1: username });
    console.log(username);
    clients.get(username).status = ClientStatus.WAITING;
    const message = JSON.stringify({
        type: MessageType.GET_ROOMS,
        rooms: Array.from(rooms.keys())
    });
    clients.forEach((value, key) => {
        if (value.status === ClientStatus.NEW) {
            value.socket.send(message);
        }
    });
};
//# sourceMappingURL=game.service.js.map