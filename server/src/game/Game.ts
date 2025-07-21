import { Paddle } from "./Paddle.js"
import { Puck } from "./Puck.js"

export const size = {width:600, height:600};
const FIXED_DT = 1000 / 60;
const BRODCAST_EVERY_N_FRAMES  = 120;
const interval = 250;
const maxScore = 10;

export class Game {
    score:number[];
    paddles:Paddle[];
    puck:Puck;
    accumulator:number;
    lastTime:number;
    framesCount:number;
    brodcastPuck : (payload:{puck:{x:number, y:number, dx:number, dy:number}, paddles:number[]}) => void;
    sendScoreAndReset : (paylod:{score:number[]}) => void;
    brodcastStart : () => void;
    constructor(brodcastPuck : (payload:{puck:{x:number, y:number, dx:number, dy:number}, paddles:number[]}) => void, sendScoreAndReset : (paylod:{score:number[]}) => void , brodcastStart : ()=>void){
        this.paddles = [new Paddle,new Paddle(true)];
        this.puck = new Puck();
        this.score = [0,0];
        this.lastTime = performance.now();
        this.brodcastPuck = brodcastPuck;
        this.sendScoreAndReset = sendScoreAndReset;
        this.brodcastStart = brodcastStart;
        this.accumulator = 0;
    }

    gameLoop = () =>{
       
        
        const now = performance.now();
        const delta = Math.min(interval, now - this.lastTime);
        this.accumulator+=delta;
        while(this.accumulator >= FIXED_DT){
            this.accumulator-=FIXED_DT;
            const index = this.puck.updateAndCheck(this.paddles[0].x,this.paddles[1].x);
            if(index == -2) {
                this.brodcastPuck({puck:this.puck.data(), paddles:[this.paddles[0].x, this.paddles[1].x]});
            }else if(index!=-1){
                this.brodcastPuck({puck:this.puck.data(), paddles:[this.paddles[0].x, this.paddles[1].x]});
                this.updateScoreAndReset(index); 
                return;
            }
            this.paddles[0].update();
            this.paddles[1].update();
            this.framesCount++;
            
            if(this.framesCount >= BRODCAST_EVERY_N_FRAMES){
                this.framesCount = 0;
                this.brodcastPuck({puck:this.puck.data(), paddles:[this.paddles[0].x, this.paddles[1].x]});
            }
        }
        this.lastTime = now;
        
        if(delta < FIXED_DT - 16) setTimeout(this.gameLoop);
        else setImmediate(this.gameLoop);
    };
    updateScoreAndReset(playerIndex:number){
        if(++this.score[playerIndex] == maxScore) this.endGame(playerIndex);
        else this.resetGame();
    };
    resetGame(){
        this.accumulator = 0;
        this.framesCount = 0;
        this.puck.reset();
        this.paddles[0].reset(); this.paddles[1].reset();
        this.sendScoreAndReset({score:this.score});
        setTimeout(this.startGame,2000);           
    }
    startGame = () => {
        this.brodcastStart();
        this.gameLoop();        
    }
    endGame(playerIndex:number){
        this.sendScoreAndReset({score:this.score});
    }

    updatePaddle = (paddleIndex:number, payload:{keyIndex:number,value:boolean}) => {
        this.paddles[paddleIndex].keys[payload.keyIndex] = payload.value;
    };

}