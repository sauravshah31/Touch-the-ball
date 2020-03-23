var canvas1,ctx1,level=120;
var canvas2,ctx2;
var scoreEl=document.querySelector('#score');
var score=0;
var requestId=undefined;
var gmOver=false;
a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

function beep(vol, freq, duration){
  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

function getRandom(min,max){
	return Math.random()*(max-min)+min;
}

function min(a,b){
	return a>b?b:a;
}
function init() {
		canvas1=document.querySelector('#canvas1');
		canvas2=document.querySelector('#canvas2');
		canvas1.width=window.innerWidth*0.9;
		canvas1.height=window.innerHeight*0.9;
		canvas2.width=canvas1.width;
		canvas2.height=10;
		ctx1=canvas1.getContext('2d');
		ctx2=canvas2.getContext('2d');
}
init();
var canvasLeft=canvas1.getBoundingClientRect().left;
var canvas2Top=canvas2.getBoundingClientRect().top;
var canvas2Control={
	rectWidth: canvas2.width>580?176:canvas2.width*0.3,
	hrw: undefined,
	posX:undefined
	
};
canvas2Control.hrw=Math.floor(canvas2Control.rectWidth/2);
canvas2Control.posX=canvas2Control.hrw;
ctx2.fillRect(0,0,canvas2Control.rectWidth,10);
canvas1.addEventListener('mousemove',updatePos,false);
window.addEventListener('keydown',updatePos,false);
canvas2.addEventListener('mousemove',updatePos,false);

//Touch events
/*
canvas1.addEventListener('touchenter',function(e){
	e.preventDefault();
},false);
canvas2.addEventListener('touchenter',function(e){
	e.preventDefault();
},false);*/
canvas1.addEventListener('touchmove',function(e){
	updatePosTouch(e);
},false);
canvas2.addEventListener('touchmove',function(e){
	updatePosTouch(e);
},false);


function updatePos(e) {
	if(e.type=='mousemove')
	{
			
			canvas2Control.posX=e.clientX-canvasLeft;
				checkPos();	
		
	}else{
		if(e.keyCode==39){
				checkPos();	
			canvas2Control.posX+=5;		
		}else if(e.keyCode==37){
			canvas2Control.posX-=5;
				checkPos();		
		}	
	}
}
function updatePosTouch(e) {
	canvas2Control.posX=e.touches[0].clientX-canvasLeft;
	checkPos();
}

function checkPos() {
	if(canvas2Control.posX-canvas2Control.hrw<0){
		canvas2Control.posX=canvas2Control.hrw;	
	}else if(canvas2Control.posX+canvas2Control.hrw>canvas2.width){
		canvas2Control.posX=canvas2.width-canvas2Control.hrw;
	}
	drawControl();
}

function drawControl() {
		ctx2.clearRect(0,0,canvas2.width,10);
		ctx2.fillRect(canvas2Control.posX-canvas2Control.hrw,0,canvas2Control.rectWidth,10);	
}
var check=false;


function Circle(x,y,dx,dy,radius) {
	this.x=x;
	this.y=y;
	this.dx=dx;
	this.dy=dy;
	this.radius=radius;
	this.check=false;
	
	this.draw=function () {
			ctx1.save();
			ctx1.beginPath();
			ctx1.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
			ctx1.stroke();
			ctx1.restore();
			this.update();
	}
	this.update=function () {
		if(this.x>=canvas2Control.posX-canvas2Control.hrw && this.x<=canvas2Control.posX+canvas2Control.hrw &&(this.y+this.radius)>=canvas2Top&&(this.y+this.radius)<=canvas2Top+this.dy){
			beep(100,450,80);			
			ctx1.clearRect(this.x-this.radius,this.y-this.radius,this.x+this.radius,this.y+this.radius);
			this.check=true;
			score++;
			j++;
					
		}/*else if(this.y+this.radius>canvas2Top+this.radius){
			j++;		
		}*/else if((this.y+this.radius)>canvas2Top+this.dy){
			gmOver=true;
		}
		this.x=this.x+this.dx;
		this.y+=this.dy;	
	}
};

function copyRight(ctx) {
	ctx.font='14pt Calibri';
 	ctx.fillStyle='rgb(31,41,49,.1)';
  	ctx.fillText('Game Over',10,20);
}
var circle=[];
var prevDy=1;
function initCircle(){
for(var i=0;i<level*8;i++){
	var x,y,dx=0,radius;
	dy=min(getRandom(prevDy,prevDy+1),12);
		
	prevDy=dy;
	radius=getRandom(10,30);
	x=getRandom(radius,canvas1.width-radius);
	y=0;
	circle.push(new Circle(x,y,dx,dy,radius));
}
}
initCircle();
var j=0;
function gameOver(){
	scoreEl.innerText="Total Score: "+score;	
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	copyRight(ctx1);
	window.cancelAnimationFrame(requestId);
}

function animate() {
	if(j==level*8||gmOver){
		gameOver();
		beep(200, 500, 200);
		return;
	}
	requestId=requestAnimationFrame(animate);
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	circle[j].draw();
}
requestId=requestAnimationFrame(animate);
