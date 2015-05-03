export default class Vector2d {

  constructor(x,y) {
    this.x=x;
    this.y=y;
  }
  length(){
    return Math.sqrt(this.x*this.x+this.y+this.y);
  }
  multiply(value){
    this.x*=v;
    this.y*=v;
    return this;
  }
  add(vector){
    this.x+=vector.x;
    this.y+=vector.y;
    return this;
  }
  sub(vector){
    this.x-=vector.x;
    this.y-=vector.y;
    return this;
  }
  set(x,y){
    this.x=x;
    this.y=y;
    return this;
  }
  unit(){
    this.multipy(1/this.length());
    return this;
  }
  copy(vector){
    this.x=vector.x;
    this.y=vector.y;
  }
  clone(){
    return new Vector(this.x,this.y);
  }

  static distance(v1,v2){
    var dx=v1.x-v2.x;
    var dy=v1.y-v2.y;
    return Math.sqrt(dx*dx+dy*dy);
  }

}
