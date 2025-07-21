import { size } from "./Game";
const plx = 60;
const ply = 10;
const radius = 10;
const gap = 20;
const py1 = 600 - gap - ply;
const py2 = gap + ply;

export class Puck {
  reflect: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;


  constructor(reflect: boolean) {
    this.reflect = reflect;
    this.x = size.width / 2 - radius / 2;
    this.y = size.height / 2 - radius / 2;
    this.dx = 0;
    this.dy = 6;
  }
  reset(){
    this.x = size.width / 2 - radius / 2;
    this.y = size.height / 2 - radius / 2;
    this.dx = 0;
    this.dy = 6;
  }

  updatePosition(px1:number, px2:number) {

    this.x += this.dx;
    this.y += this.dy;
    if (this.x <= radius || this.x >= size.width - radius) {
      this.dx *= -1;
    }

    if (this.y <= radius || this.y >= size.height - radius) {
      this.dy *= -1;
    }


    if (this.x > px1 - radius && this.x < px1 + plx + radius && this.y + radius > py1) {
      this.dy *= -1;
      this.y = py1 - radius;
    }
    if (this.x > px2 - radius && this.x < px2 + plx + radius && this.y - radius < py2 - ply) {
      this.dy *= -1;
      this.y = py2 + ply + radius;
    }
  }
  updateFromServer(payload: { x: number, y: number, dx: number, dy: number }) {
    
    this.x += (payload.x - this.x) * 0.8;
    this.y += (payload.y - this.y) * 0.8;
    this.dx = payload.dx;
    this.dy = payload.dy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    if (this.reflect) ctx.arc(size.width - this.x, size.height - this.y, radius, 0, Math.PI * 2);
    else ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1B3C53";
    ctx.fill();
  }
}
