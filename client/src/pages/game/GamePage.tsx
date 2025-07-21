import { useEffect, useState, Suspense } from "react"
import { Routes, Route, Link, useNavigate } from "react-router"
import * as gameService from '../../services/game.service'
import { AvailableGames } from "../../features/game/AvailableGames"
import { Chat } from "../../features/chat/Chat"

import { useUser } from "../../context/user.context"
import { UserStatus } from "../../types/user.type"
import { Game } from "../../features/game/Game"
import { NotFound } from "../not-found/NotFound"
import { MessageType } from "../../types/message.type"
import './GamePage.scss';

export const GamePage = () => {
    const [reflect, setReflect] = useState<boolean>(false);
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            gameService.connectWebSocket(user, (message: any) => { });
        } else {
            navigate('signup');
        }
    }, [user]);

    const setReflectHandler = () => setReflect(true);
    const createRoomHandler = () => {
        gameService.createRoom();

        gameService.registerSocketHandler(MessageType.CREATE_ROOM, (payload: { ok: boolean }) => {
            gameService.unregisterSocketHanlders(MessageType.CREATE_ROOM);

            if (payload.ok && user) {
                setUser({ ...user, status: UserStatus.WAITING });
                gameService.registerSocketHandler(MessageType.JOIN_ROOM, (payload: { username: string }) => {
                    gameService.unregisterSocketHanlders(MessageType.JOIN_ROOM);
                    if (user) {
                        setUser({ ...user, status: UserStatus.PLAYING });
                    }
                })
            }
        });
    }
    const cancelRoomCreateHandler = () => {
        if (user){
            gameService.endRoom();
            setUser({...user, status:UserStatus.NEW});
        } 
    }

    return (
        <Suspense fallback={<>Loading...</>}>
            {(user?.status == UserStatus.NEW && (
                <>
                    <button onClick={createRoomHandler}>Create Room</button>
                    <Routes>
                        <Route path='' element={<AvailableGames handleSetReflect={setReflectHandler} />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </>
            ))}
            {(user?.status == UserStatus.WAITING) && (
                <>
                    <p>Waiting for someone to join the room...</p>
                    <button onClick={cancelRoomCreateHandler}>Cancel</button>
                </>
            )}
            {(user?.status == UserStatus.PLAYING) && (
                <div className="game">
                    <Game reflect={reflect} />
                    <Chat />
                </div>
            )}

        </Suspense>
    )
}