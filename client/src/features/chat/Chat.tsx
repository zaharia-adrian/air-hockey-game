import { useEffect, useState, FormEvent } from "react"
import { registerSocketHandler, unregisterSocketHanlders, sendChat } from "../../services/game.service";
import { MessageType } from "../../types/message.type";
import { useUser } from "../../context/user.context";
import { UserStatus } from "../../types/user.type";
import './Chat.scss'

export const Chat = () =>{
    const [chats, setChats] = useState<string[]>([]);
    const [chat, setChat] = useState<string>('');
    const {user, setUser} = useUser();
    useEffect(()=>{
        registerSocketHandler(MessageType.END_ROOM, ()=>{
            if(user){
                setUser({...user, status:UserStatus.NEW, roomId:undefined});
            }
        });
        registerSocketHandler(MessageType.CHAT, (payload:{chat:string})=>{
            setChats((prevChats) => [...prevChats, payload.chat]);
        });
        return ()=>{
            unregisterSocketHanlders(MessageType.CHAT);
            unregisterSocketHanlders(MessageType.END_ROOM);
        }
    }, []);
    const handleSendChat = (event : FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        sendChat(chat);
        setChat('');
        setChats((prevChats) => [...prevChats, chat]);
    }
    

    return (
        <div className="chat">  
            <ul className="messages">
                {chats.map((chat, index)=>(
                    <li>{chat}</li>   
                ))}
            </ul>
          
            <form onSubmit={handleSendChat}>
                <label> 
                    <input value={chat} type="text" placeholder="Enter message..." onChange ={(event => {setChat(event.target.value)})}/>
                </label>
                <button type="submit">Send message</button>
            </form>
            
        </div>
    )
}