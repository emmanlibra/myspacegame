var myScore;
var score = 0;
var myGamePiece;
var myObstacles = [];
var bullet = [];
var base;
var speedUp = 0;
var bomb = [];
var bombTrigger = [];



function restartGame() {
document.getElementById("myfilter").style.display = "none";
document.getElementById("myrestartbutton").style.display = "none";
myGameArea.stop();
myGameArea.clear();
myGameArea = {};
myGamePiece = {};
myObstacles = [];
myScore = {};
score = 0;
speedUp = 0;
bomb = [];
bombTrigger = [];
document.getElementById("canvascontainer").innerHTML = "";
startGame()
}

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(20, 20, "red", 230, 450);
    base = new component(480, 20, "black", 0, 470);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");  
   // myObstacles  = new component(20, 20, "green", 0, 0);
    myGameArea.start();
}

function gamearea() {            // gamearea/canvas
    this.canvas = document.createElement("canvas"),
    this.canvas.width = 480;
    this.canvas.height = 480;
    document.getElementById("canvascontainer").appendChild(this.canvas);   
    this.context = this.canvas.getContext("2d");
    this.pause = false;  
    //document.body.insertBefore(this.canvas, document.body.childNodes[0]);      document.getElementById("canvascontainer").appendChild(this.canvas);
    this.frameNo = 0;
    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
    } 
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;      
    }

}

function component(width, height, color, x, y, type) { 
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {      ///// mouse controller
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) { ///// collision detection
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}
/////////////////////////////GAME UPDATE//////////////////////////////////////////////////
function updateGameArea() {                         //////end game if gamepiece touch the obstacle
   var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {               /////////////collision obstacle and gamepiece
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";          
            return;
        }
    }

    for (i = 0; i < myObstacles.length; i += 1) {   ///////collision obstacle and base
        if (base.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";          
            return;
        }
    }

    for (i = 0; i < bullet.length; i += 1) {   ///////collision bullet and bomb trigger then create bomb
        x = myGamePiece.x;
        w = Math.floor((Math.random() * 480) + 1);
        bombTrigger.forEach( (arg, b) => bullet[i].crashWith(arg)?  [bombTrigger.splice(b,1), bullet.splice(b,1), bomb.push(new component(w, 200, "orange", x - ((w/2)-10), 480))] : false)
        
    }    
  
    for (i = 0; i < bullet.length; i += 1) {      ////delete if obstacle and bullet collide
        myObstacles.forEach( (arg, b) => bullet[i].crashWith(arg)?  [myObstacles.splice(b,1), bullet.splice(i,1), speedUp += .005, score += 1] : false)
    }

    for (i = 0; i < bomb.length; i += 1) {      ////delete if obstacle and bullet collide
        myObstacles.forEach( (arg, b) => bomb[i].crashWith(arg)?  myObstacles.splice(b,1) : false)
    }    

    myGameArea.clear();
    myGameArea.frameNo += 10;

    if (myGameArea.frameNo == 1 || everyinterval(120)) {        /// random create of obstacle
        x = Math.floor((Math.random() * 460) + 1);
        y = myGameArea.canvas.height;
        myObstacles.push(new component(20, 20, "green", x, -10));
    }

    if (myGameArea.frameNo == 1 || everyinterval(70)) {       ///create bullet on the current position of gamepiece
        a = myGamePiece.x;
        bullet.push(new component(5, 20, "blue", a+8 , 480));
    }

    if (myGameArea.frameNo == 1 || everyinterval(10000)) {        /// random create of bomb trigger
        x = Math.floor((Math.random() * 460) + 1);
        y = myGameArea.canvas.height;
        bombTrigger.push(new component(5, 5, "black", x, -10));
    }    

    for (i = 0; i < myObstacles.length; i += 1) {         ////speed of obstacle
        myObstacles[i].y += .05 + speedUp;
        myObstacles[i].update();
    }
  
    for (i = 0; i < bullet.length; i += 1) {            /// speed of bullet
        bullet[i].y += -10;
        bullet[i].update();
    }

    for (i = 0; i < bombTrigger.length; i += 1) {            /// speed of bombTrigger
        bombTrigger[i].y += 2;
        bombTrigger[i].update();
    } 
    
    for (i = 0; i < bomb.length; i += 1) {            /// speed of bomb
        bomb[i].y += -10;
        bomb[i].update();
    }    

    if (myGameArea.x && myGameArea.y) {         //// movement of gamepiece based on cursor
        myGamePiece.x = myGameArea.x -20;
        myGamePiece.y = myGamePiece.y;
    }
      myScore.text="SCORE: " + score;
      myScore.update();
      myGamePiece.newPos();    
      myGamePiece.update();
      base.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
startGame();