import { size } from "./Game";
const gap = 20;
const plx = 60;
const ply = 10;

export class Paddle {
    x: number;
    y: number;
    speed: number;
    keys:boolean[];
    reflect:boolean;
    coef:number;

    constructor(mine = true, reflect = false) {
        this.reflect = reflect;
        if((mine && !reflect) || (!mine && reflect)){
            this.coef = 1;
            this.y = size.height - gap - ply;
            this.speed = 8;
        }else{
            this.coef = -1;
            this.y = gap;
            this.speed = -8;
        }
        this.x = size.width/2 - plx/2;
        this.keys = [false, false];
    }

    update() {

        if (this.keys[0]) this.x += this.speed;
        if (this.keys[1]) this.x -= this.speed;
        this.x = Math.max(Math.min(this.x, size.width - plx),0);
    }
    reset(){
        this.x = size.width/2 - plx/2;
        this.keys = [false, false];
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        if(this.reflect)ctx.rect(size.width - this.x - plx, size.height - this.y - ply, plx, ply)
        else ctx.rect(this.x, this.y, plx, ply);
        ctx.fillStyle = "#1B3C53";
        ctx.fill();
    }
}