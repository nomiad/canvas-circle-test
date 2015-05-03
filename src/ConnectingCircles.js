import Vector2d from "app/Vector2d";
import CanvasObject from "app/CanvasObject";
import Circle from "app/Circle";

class ConnectingCircles{

  //canvas=null;
  //context=null;


  constructor(canvas){
    this.canvas=canvas;
    this.context=canvas.getContext("2d");
    this.objects=[];
    this.time=0;
    this.lastRender=0;

    this.initScene();
    this.loop();
  }

  loop(){
    var now=Date.now();
    var diff=(now-this.time)/1000;


    this.objects.forEach((item) => {
      item.update(now,diff);
    });
    if (now-this.lastRender>13){
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.objects.forEach((item) => {
        item.render(this.context);
      });
      this.lastRender=now;
    }


    window.requestAnimationFrame(()=>this.loop());
    this.time=now;
  }

  initScene(){
    this.createConnector();
    for (var i = 0,len=80; i < len; i++) {
      this.createObritCircle(100+(i%3)*50,((i%3)%2*2)-1,Math.PI*2*Math.random());
    }

  }
  createObritCircle(orbitRadius=200,orbitDirection=1,orbitOffset=0){
    var c=new Circle();
    c.roundTime=4000;
    c.orbitCenter=new Vector2d(200,200);
    c.orbitRadius=orbitRadius;
    c.orbitOffset=orbitOffset;
    c.orbitDirection=orbitDirection;
    c.update=function(now,diff){
      if (!this.currentTime) this.currentTime=now;
      var p=((now-this.currentTime)*c.orbitDirection%this.roundTime)/this.roundTime;

      this.position.x=Math.cos(p*Math.PI*2+this.orbitOffset)*this.orbitRadius+this.orbitCenter.x;
      this.position.y=Math.sin(p*Math.PI*2+this.orbitOffset)*this.orbitRadius+this.orbitCenter.y;

    };
    this.objects.push(c);
  }
  createConnector(){
    var c=new CanvasObject();
    c.render=(ctx)=>{
      this.objects.forEach((item)=> {
        if (item==this) return;
        this.objects.forEach((other)=> {
          if (other==this) return;
          if (Vector2d.distance(item.position,other.position)<70 && item.orbitRadius>other.orbitRadius){
            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.moveTo(item.position.x,item.position.y);
            ctx.lineTo(other.position.x,other.position.y);
            ctx.stroke();
          }
        });
      });
    };
    this.objects.push(c);
  }
}

export default ConnectingCircles;
