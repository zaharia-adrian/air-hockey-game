import { User } from "../types/user.type";
import * as gameApi from '../api/game.api'
import { MessageType } from "../types/message.type";


let socket: WebSocket | null = null;
const socketUrl='ws://localhost:8001';

type Handler = (payload:any) =>any;

const socketHandlers = new Map<MessageType, (payload:any)=>void>();
export const registerSocketHandler = (type:MessageType, handler:Handler) =>{
    socketHandlers.set(type, handler);
}
export const unregisterSocketHanlders = (type:MessageType) =>{
    socketHandlers.delete(type);
}




export const connectWebSocket = (user : User, onMessage : (data:any)=>void)=>{
    if(socket) return;
    socket = new WebSocket(`${socketUrl}?username=${user.username}`);

    socket.onopen = () => {
        console.log('Connected to the server');
    }
    socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);
        const handler = socketHandlers.get(message.type);        
        if(handler){
            handler(message.payload);
        }
        onMessage(message);
    }
    socket.onclose = () =>{
        console.log('Disconnected!');
    }
}

export const sendMessage = (data : any)=>{
    if(socket?.readyState === WebSocket.OPEN){        
        socket.send(JSON.stringify(data));
    }
}

export const disconnectWebSocket = () =>{
    socket?.close();
    socket = null;
}

export const getConnectedUsers = async () => {
    const response = await gameApi.getConnectedUsers();
    console.log(response.data.users);
    return response.data.users;
}

export const createRoom = () => {
      
    sendMessage({type:MessageType.CREATE_ROOM});
}

export const getGames = async () => {
    sendMessage({type:MessageType.GET_ROOMS});
}

export const joinRoom = (roomId:string) => { 
    sendMessage({type:MessageType.JOIN_ROOM, roomId});
}
export const endRoom = () =>{
    sendMessage({type:MessageType.END_ROOM});
}

export const sendChat = (chat : string) =>{
    sendMessage({type:MessageType.CHAT, chat});
}

export const sendMove =(keyIndex:number, value:boolean)=>{
    sendMessage({type:MessageType.UPDATE_PADDLE, payload:{keyIndex, value}});
}

export const sendStartGame = () => {
    sendMessage({type:MessageType.START_GAME});    
}