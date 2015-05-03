import CanvasObject from "app/CanvasObject";

export default class Circle extends CanvasObject {
  constructor(position,radius=5,fillColor="red"){
    super(position);
    this.radius=radius;
    this.fillColor=fillColor;
  }
  render(ctx){
    ctx.fillColor=this.fillColor;
    ctx.beginPath();
    ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI*2);
    ctx.fill();

  }
}
