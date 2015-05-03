import Vector2d from "app/Vector2d";

export default class CanvasObject{
  constructor(position){
    this.position=position||new Vector2d(0,0);
    this.velocity=new Vector2d(0,0);
  }
  update(now,diff){

  }
  render(ctx){

  }

}
