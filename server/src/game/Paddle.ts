import { size } from "./Game.js";
const plx = 60;

export class Paddle{
    x:number;
    speed:number;
    keys:boolean[];
    secondary:boolean;
    constructor(secondary:boolean = false) {
        this.secondary = secondary;
        this.reset();
    }
    reset(){
         if(this.secondary){
            this.speed = -8;
        }else{
            this.speed = 8;
        }
        this.x = size.width/2 - plx/2;
        this.keys = [false, false];
    }

    update(){
        if (this.keys[0]) this.x += this.speed;
        if (this.keys[1]) this.x -= this.speed;
        this.x = Math.max(Math.min(this.x, size.width - plx),0);
    }

}