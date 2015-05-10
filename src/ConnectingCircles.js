import Vector2d from "app/Vector2d";
import CanvasObject from "app/CanvasObject";
import Circle from "app/Circle";

class ConnectingCircles{

  //canvas=null;
  //context=null;


  constructor(canvas){
    this.canvas=canvas;
    this.context=canvas.getContext("2d");
    this.objects=[]; //all objects
    this.groupPoints=[];
    this.groupLines=[];
    this.removeList=[];

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
    while(this.removeList.length>0){
      var r=this.removeList.shift();
      //console.info("r",r);
      var i=this.objects.indexOf(r);
      if (i>=0) this.objects.splice(i,1);
      i=this.groupLines.indexOf(r);
      if (i>=0) this.groupLines.splice(i,1);
    }
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
      this.createObritCircle(
        100+(i%3)*50,
        ((i%3)%2*2)-1,
        Math.PI*2*Math.random(),
        4000+Math.random()*4000,
        0.5*Math.random()
      );
    }

  }
  createObritCircle(orbitRadius=200,orbitDirection=1,orbitOffset=0,roundTime=4000,oribtMod=0.1){
    var c=new Circle();
    c.roundTime=roundTime;
    c.orbitCenter=new Vector2d(this.canvas.width/2,this.canvas.width/2);
    c.orbitRadius=orbitRadius;
    c.orbitOffset=orbitOffset;
    c.orbitDirection=orbitDirection;
    c.orbitModifier=oribtMod;
    c.update=function(now,diff){
      if (!this.currentTime) this.currentTime=now;
      var p=((now-this.currentTime)*c.orbitDirection%this.roundTime)/this.roundTime;
      var r=this.orbitRadius;

      //modyify radius with a sin curve
      r+=Math.sin(Math.PI*2*p*4)*this.orbitRadius*this.orbitModifier;

      this.position.x=Math.cos(p*Math.PI*2+this.orbitOffset)*r+this.orbitRadius+this.orbitCenter.x;
      this.position.y=Math.sin(p*Math.PI*2+this.orbitOffset)*r+this.orbitCenter.y;

    };
    this.objects.push(c);
    this.groupPoints.push(c);
  }
  removeObject(o){
    this.removeList.push(o);
  }
  createConnector(){
    var c=new CanvasObject();
    c.update=(now,diff)=>{
      this.groupPoints.forEach((item)=> {
        item.linkCount=0;

        this.groupPoints.forEach((other)=> {
          if (this.objects.length>250) return;
          if (item.linkCount>0) return;
          if (Vector2d.distance(item.position,other.position)<70){
            var ex=false;
            this.groupLines.forEach((check)=>{
              if (check.startObj==item && check.endObj==other
                || check.startObj==other && check.endObj==item)
                ex=true;
            });
            if (!ex) {
              this.createConnectorLine(item,other);
              item.linkCount++;
            }
          }
        });
      });
    };
    /*
    c.render=(ctx)=>{
      this.groupPoints.forEach((item)=> {
        item.linkCount=0;
        if (item==this) return;
        this.groupPoints.forEach((other)=> {
          if (other==this) return;
          if (item.linkCount>0) return;
          //paint line if conditions are met
          if (Vector2d.distance(item.position,other.position)<70
            /*&& item.orbitRadius>other.orbitRadius* /){

            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.moveTo(item.position.x,item.position.y);
            ctx.lineTo(other.position.x,other.position.y);
            ctx.stroke();
            //other.linkCount++;
            item.linkCount++;
          }
        });
      });

    };
    */
    this.objects.push(c);
  }
  createConnectorLine(start,end){
    //console.info("create me ",this.objects.length-this.groupPoints.length);
    var c=new CanvasObject();
    var that=this;
    c.startObj=start;
    c.endObj=end;
    c.start=start.position;
    c.end=end.position;
    c.maxDist=70;
    c.fade=false;
    c.fadeValue=1;
    c.fadeStart=0;
    c.fadeDuration=1000;
    c.removed=false;

    c.update=function(now,diff){

      if (!this.fade && Vector2d.distance(this.start,this.end)>this.maxDist){
        this.start=this.startObj.position.clone();
        this.end=this.endObj.position.clone();
        c.fadeStart=now;
        this.fade=true;
      } else if (!this.fade){
        this.start=this.startObj.position;
        this.end=this.endObj.position;
      } else if (this.fade && !this.removed){
        this.fadeValue=Math.max(0,1-(now-this.fadeStart)/this.fadeDuration);
        if (this.fadeValue<=0.1) {
          that.removeObject(this);
          console.info("remove me");
          this.removed=true;
        }
      }
    };
    c.render=function(ctx){
      var v=this.fadeValue.toFixed(2);
      ctx.strokeStyle=`rgba(255,255,0,${v})`;
      ctx.beginPath();
      ctx.moveTo(this.start.x,this.start.y);
      ctx.lineTo(this.end.x,this.end.y);
      ctx.stroke();
    };

    this.objects.push(c);
    this.groupLines.push(c);
  }
}

export default ConnectingCircles;
