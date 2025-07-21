import { Suspense, useState, useEffect } from "react"
import * as gameService from "../../services/game.service"

import { MessageType } from "../../types/message.type";
import { UserStatus } from "../../types/user.type";
import { useUser } from "../../context/user.context";

export const AvailableGames = (props:{handleSetReflect:()=>void}) =>{
    const [availableGames, setAvailableGames] = useState<{id:string, clientUsername1:string}[]>([]);

    const {user, setUser} = useUser();
    useEffect(()=>{
        gameService.registerSocketHandler(MessageType.GET_ROOMS, (payload:any) =>{        
            setAvailableGames(payload.rooms);            
        });
        gameService.getGames();
        return () =>{
            gameService.unregisterSocketHanlders(MessageType.GET_ROOMS);
        }
    },[]);

    
     
    const handleJoinRoom = (event:React.MouseEvent<HTMLButtonElement>) => {
        const roomId = event.currentTarget.name;
        gameService.joinRoom(roomId);
        gameService.registerSocketHandler(MessageType.JOIN_ROOM, (payload:any)=>{
            gameService.unregisterSocketHanlders(MessageType.JOIN_ROOM);
            if(payload.ok && user){    
                setUser({...user, status:UserStatus.PLAYING, roomId});
            }
        });
        props.handleSetReflect();
    }

    return (
        <Suspense fallback={<>Loading...</>}>
            <ul>
                {availableGames.map((item, index)=>(
                    <li key={index}>{item.clientUsername1} 
                        <button  name={item.id} onClick={handleJoinRoom}>Join Room</button>
                    </li>
                ))}
            </ul>
        </Suspense>
    )
}