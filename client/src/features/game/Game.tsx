import { useRef, useEffect, useState } from "react";
import * as gameService from '../../services/game.service'
import { Puck } from "./Puck";
import { Paddle } from "./Paddle";
import { MessageType } from "../../types/message.type";
import './Game.scss'
import { UserStatus } from "../../types/user.type";
import { useUser } from "../../context/user.context";


export const size = { width: 600, height: 600 };

export const Game = (props: { reflect: boolean }) => {
  const [score, setScore] = useState<number[]>([0, 0]);
  const [message, setMessage] = useState<String | null>(null);
  const {user, setUser} = useUser();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const puckRef = useRef(new Puck(props.reflect));
  const myPaddleRef = useRef(new Paddle(true, props.reflect));
  const oponentPaddleRef = useRef(new Paddle(false, props.reflect));

  useEffect(() => {

    const canvas = canvasRef.current;
    let playing = false;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gameService.registerSocketHandler(MessageType.UPDATE_PADDLE, (data: { keyIndex: number, value: boolean }) => {
      oponentPaddleRef.current.keys[data.keyIndex] = data.value;
    });

    gameService.registerSocketHandler(MessageType.UPDATE_PUCK, (payload: { puck: { x: number, y: number, dx: number, dy: number }, paddles: number[] }) => {
      puckRef.current.updateFromServer(payload.puck);
      if (!props.reflect) {
        myPaddleRef.current.x = payload.paddles[0];
        oponentPaddleRef.current.x = payload.paddles[1];
      } else {
        myPaddleRef.current.x = payload.paddles[1];
        oponentPaddleRef.current.x = payload.paddles[0];
      }

    });
  
    
    gameService.registerSocketHandler(MessageType.SCORE_AND_RESET, (payload: { score: number[]}) => {

      playing = false;
      puckRef.current.reset();
      myPaddleRef.current.reset();
      oponentPaddleRef.current.reset();
      setScore(payload.score);
      if (payload.score[0] == 10 || payload.score[1] == 10) {
        setMessage("Game Over");
        if (user) setUser({ ...user, status: UserStatus.NEW });
      } else if(payload.score[0]===0 && payload.score[1] === 0){
        setMessage("Start Game");
      }else{
        setMessage("Point");
      }
    });
    gameService.registerSocketHandler(MessageType.START_GAME, ()=>{
      setMessage(null);
      playing = true;
  
    })

    let lastTick = performance.now();
    const fps = 1000 / 60;
    let accumulator = 0;

    const update = () => {
      accumulator += performance.now() - lastTick;
      lastTick = performance.now();
      while (accumulator >= fps) {


        if (playing) {
          myPaddleRef.current.update();
          oponentPaddleRef.current.update();
          if (!props.reflect) puckRef.current.updatePosition(myPaddleRef.current.x, oponentPaddleRef.current.x);
          else puckRef.current.updatePosition(oponentPaddleRef.current.x, myPaddleRef.current.x);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        puckRef.current.draw(ctx);
        myPaddleRef.current.draw(ctx);
        oponentPaddleRef.current.draw(ctx);
        accumulator -= fps;
      }
      requestRef.current = requestAnimationFrame(update);
    };
    let keyIndex;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keyIndex = 1;
      else if (e.key === 'ArrowRight') keyIndex = 0;
      else return;
      if (!myPaddleRef.current.keys[keyIndex]) {
        gameService.sendMove(keyIndex, true);
        myPaddleRef.current.keys[keyIndex] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keyIndex = 1;
      else if (e.key === 'ArrowRight') keyIndex = 0;
      else return;
      if (myPaddleRef.current.keys[keyIndex]) {
        gameService.sendMove(keyIndex, false);
        myPaddleRef.current.keys[keyIndex] = false;
      }
    };
    requestRef.current = requestAnimationFrame(update);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    gameService.sendStartGame();

    return () => {
      gameService.unregisterSocketHanlders(MessageType.UPDATE_PADDLE);
      gameService.unregisterSocketHanlders(MessageType.UPDATE_PUCK);
      gameService.unregisterSocketHanlders(MessageType.SCORE_AND_RESET);
      gameService.unregisterSocketHanlders(MessageType.START_GAME);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyUp);
    };
  }, []);

  return (
    <>
    { message &&
      <div className="background">
        <h1>{message}</h1>
      </div>
    }
      <div className="gameTable">
        <canvas ref={canvasRef} width={size.width} height={size.height} style={{ backgroundColor: '#D2C1B6' }} />
        <h2 className="score"> {score[props.reflect ? 1 : 0]} | {score[props.reflect ? 0 : 1]} </h2>
      </div>
    </>
  )
};
