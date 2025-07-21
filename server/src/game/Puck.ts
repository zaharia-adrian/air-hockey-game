import { size } from "./Game.js";
const plx = 60;
const ply = 10;
const radius = 10;
const gap = 20;
const py1 = 600 - gap - ply;
const py2 = gap + ply;
const maxXSpeed = 6;
export class Puck {
    x: number;
    y: number;
    dx: number;
    dy: number;

    constructor() {
        this.reset();
    }

    data() {
        return { x: this.x, y: this.y, dx: this.dx, dy: this.dy };
    }
    reset(){
        this.x = size.width / 2 - radius / 2;
        this.y = size.height / 2 - radius / 2;
        this.dx = 0;
        this.dy = 6;
    }

    updateAndCheck(px1: number, px2: number) {
        this.x += this.dx;
        this.y += this.dy;

        if(this.y <= radius) return 1;
        if(this.y + radius >= size.height) return 0;

        if (this.x <= radius || this.x >= size.width - radius) {
            this.dx *= -1;
        }

        if(this.x > px1 - radius && this.x < px1 + plx + radius && this.y + radius> py1){
            this.dy*=-1;
            this.y = py1 - radius;
            this.dx=Math.max(-maxXSpeed,Math.min( maxXSpeed, (Math.random() * 2 - 1)));
            return -2;
        }
        if(this.x > px2 - radius && this.x < px2 + plx + radius && this.y - radius < py2 - ply){
            this.dy*=-1;
            this.y = py2 + ply + radius;
            this.dx=Math.max(-maxXSpeed,Math.min( maxXSpeed, (Math.random() * 2 - 1)));
            return -2;
        }
        return -1;
    };
};  