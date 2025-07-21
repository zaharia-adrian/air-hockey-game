import {v4 as uuid} from 'uuid'
import { ClientStatus } from '../types/clientStatus.type.js';
import { MessageType } from '../types/message.type.js';

import { Game } from '../game/Game.js';

type Client = {
   socket: WebSocket;
   status:ClientStatus;
   roomId?:string;
}

type Room = {
   name:string;
   clientUsername1:string;
   clientUsername2?:string;
   game?:Game;
   ready?:number;
};

let clients : Map<string, Client> = new Map();
let rooms : Map<string, Room> = new Map();
let sendTo : Map<string, string> = new Map();



export const  add = (username : string, ws : WebSocket) => {
   clients.set(username, {socket: ws, status : ClientStatus.NEW});
}

export const remove = (username : string) => {
   clients.delete(username);
   endRoom(username);
};

export const getClients = () =>{
   return Array.from(clients.keys());
}

const sendRooms = () =>{
   const message = JSON.stringify({
      type:MessageType.GET_ROOMS,
      payload:{
         rooms:Array.from(rooms, ([id, room]) => ({ id, ...room })).filter((room)=> room.clientUsername2 === undefined)
      }
   });

   clients.forEach((value, key) =>{   
      if(value.status === ClientStatus.NEW){
         value.socket.send(message);
      }
   })
}

export const createRoom = (username : string, roomName:string) => {
   const roomId = uuid();
   
   rooms.set(roomId, {name:roomName,clientUsername1:username});
   
   let  client = clients.get(username);
   client = {
      ...client,
      status:ClientStatus.WAITING,
      roomId:roomId,
   };
   clients.set(username, client);

   client.socket.send(JSON.stringify({
      type:MessageType.CREATE_ROOM,
      payload:{
         ok:true
      }
   }));

   sendRooms();
}

export const getRooms = (username:string) => {
   const message = JSON.stringify({
      type:MessageType.GET_ROOMS,
      payload:{
         rooms:Array.from(rooms, ([id, room]) => ({ id, ...room })).filter((room)=> room.clientUsername2 === undefined)
      }
   });

   clients.get(username).socket.send(message);
}

export const joinRoom = (username:string, roomId:string) =>{
   ///checks
   const room = rooms.get(roomId);
   const client2 = clients.get(username);
   const client1 = clients.get(room.clientUsername1);
   if(room.clientUsername2){
      const message=JSON.stringify({
         type:MessageType.JOIN_ROOM,
         payload:{
            ok:false
         }
      });
      client2.socket.send(message);
      return;
   }
   room.clientUsername2 = username;
   room.game = new Game(
      (payload:{puck:{x:number, y:number, dx:number, dy:number}, paddles:number[]})=>{
         const message = JSON.stringify({
            type:MessageType.UPDATE_PUCK,
            payload
         });
         client1.socket.send(message);
         client2.socket.send(message);
         
      }, 
      (payload:{score:number[]})=>{
         const message = JSON.stringify({
            type:MessageType.SCORE_AND_RESET,
            payload
         });         
         client1.socket.send(message);
         client2.socket.send(message);
      },
      () =>{
         const message = JSON.stringify({
            type:MessageType.START_GAME,
         });         
         client1.socket.send(message);
         client2.socket.send(message);
      }
   );
   
   client2.roomId = roomId;
   client2.socket.send(JSON.stringify({
      type:MessageType.JOIN_ROOM,
      payload:{
         ok:true
      }
   }));
   client1.socket.send(JSON.stringify({
      type:MessageType.JOIN_ROOM,
      payload:{
         username
      }
   }));

   clients.set(username, client2);
   rooms.set(roomId, room);
   sendTo.set(username, room.clientUsername1);
   sendTo.set(room.clientUsername1, username);
   sendRooms();
   
}

export const endRoom = (username :string) =>{
   
   let client1 = clients.get(username);
   if(!client1) return;
   const roomId = client1.roomId;
   const room = rooms.get(roomId);
   if(!room) return;

   client1 = {
      ...client1,
      roomId:undefined,
   };

   clients.set(username, client1);

   let client2 = (room.clientUsername1 === username) ? clients.get(room.clientUsername2) : clients.get(room.clientUsername1);
   
   if(client2){
      client2.socket.send(JSON.stringify({
         type:MessageType.END_ROOM
      }));
      
      client2 = {
         ...client2,
         roomId:undefined,
      };
      clients.set(room.clientUsername2, client2);
   }
   sendRooms();

   sendTo.delete(room.clientUsername1);
   sendTo.delete(room.clientUsername2);
   rooms.delete(roomId);
}

export const sendChat = (username:string, chat:string)=>{
   let from = clients.get(username);
   const roomId = from.roomId;
   const room = rooms.get(roomId);
   if(!room) return;

   let to : Client;
   if(username === room.clientUsername1) 
      to= clients.get(room.clientUsername2);
   else
      to = clients.get(room.clientUsername1);

   to.socket.send(JSON.stringify({
      type:MessageType.CHAT, 
      payload:{
         chat:chat
      }
   }));
}


export const updatePaddle = (username:string, payload:{keyIndex:number, value:boolean}) => {
   const room = rooms.get(clients.get(username).roomId);
   if(room.clientUsername1 === username)  room.game.updatePaddle(0,payload);
   else room.game.updatePaddle(1,payload);
   clients.get(sendTo.get(username)).socket.send(JSON.stringify({
      type:MessageType.UPDATE_PADDLE, 
      payload  
   }));
}

export const startGame = (username:string) => {
   const roomId = clients.get(username).roomId;
   if(rooms.get(roomId).ready === undefined){
      rooms.get(roomId).ready = 1;
   }else{
      rooms.get(roomId).game.startGame();
   }
}