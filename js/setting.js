<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
canvas {
    border: 1px solid #d3d3d3;
    background-color: #f1f1f1;
}
</style>
</head>
<body onload="startGame()">
<script>
var myGamePiece;
var myObstacles = [];
var bullet = [];

function startGame() {
    myGamePiece = new component(20, 20, "red", 230, 460);
   // myObstacles  = new component(20, 20, "green", 0, 0);
    myGameArea.start();
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

var myGameArea = {            // gamearea/canvas
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; 
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }

}



function component(width, height, color, x, y) {   //  arrow keys
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
}

function component(width, height, color, x, y) { // obstacle
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
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

function updateGameArea() {
////////////////// obstacles //////////////////////////
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    if (bullet[y].crashWith(myObstacles[y])) {
            myGameArea.stop();
            return;
        }



    myGameArea.clear();
    myGameArea.frameNo += 5;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        x = Math.floor((Math.random() * 480) + 1);
        a = myGamePiece.x;
        y = myGameArea.canvas.height;
        myObstacles.push(new component(20, 20, "green", x, -10));
        bullet.push(new component(5, 20, "blue", a+8 , 480));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 5;
        myObstacles[i].update();
    }
    for (i = 0; i < bullet.length; i += 1) {
        bullet[i].y += -10;
        bullet[i].update();
    }


    if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = 460;
    }
      myGamePiece.newPos();    
      myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
</script>


</body>
</html>
