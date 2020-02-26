//colors
//#D94E73   // #F29472 // // #F26D6D

// canvas init
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth /2;
canvas.height = window.innerHeight /1.5;


let c = canvas.getContext("2d");

let status = false;


//Paddle
let paddleSpped = 5;

let Paddle =function (x,width) {
    this.width =width;
    this.x = x;
    this.y = canvas.height - 20;
    this.height = 10

    this.draw = function (){
        c.beginPath();
        c.fillStyle = '#2CBFB1';
        c.lineWidth = '1';
        c.fillRect(this.x,this.y,this.width,this.height);
        c.stroke();
    }


    this.update = function() {
        this.draw();
    }
}






//ball

let Ball =  function(x,y,dy,dx,radious,color) {
    this.x= x;
    this.y= y;
    this.dy = dy;
    this.dx = dx;
    this.radious = radious;
    this.color =  color;

    this.draw = function () {
         
        c.beginPath();
        c.arc(this.x, this.y, this.radious,0, Math.PI*2, false);       
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
        c.closePath();
    }

    this.update = function() {

        if(this.y -this.radious   <= 0) {
            this.dy++;
        }else if(this.y + this.radious >= canvas.height){
            status = true;
            gameOver("lose")
        }

        if(this.x + this.radious +this.dx > canvas.width || this.x -this.radious  <= 0){
            this.dx = -this.dx;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
};


//bricks 
let bricks = [];
const brick = {
    row: 3,
    column: 8,
    width: 50,
    height: 10,
    color: '#F26D6D',
    offsetLeft:20,
    offsetTop:20,
    marginTop: 20,
};

function createBricks() {
    for(let r =0; r < brick.row; r++) {
        //make a row
        bricks[r] = [];

        for(let c =0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: true
            }
            

        }

    }
}
createBricks();

function drawBricks() {
    
    for(let r = 0; r< brick.row; r++) {
        for(let e = 0; e< brick.column; e++) {
            let b = bricks[r][e];

            if(b.status) {
                c.beginPath();
                c.fillStyle = b.color;
                c.strokeStyle =  b.color;
                c.fillRect(b.x, b.y, brick.width, brick.height);
                c.stroke();
            }
        }
    }
}


if(!status){
    drawBricks()
}

//ball at start fall left or right (random)
function ballxStart() {
    let num = Math.random();
    let xd;
    if(num < 0.5) {
        xd = -2;
    } else {
        xd = 2;
    }

    return xd
}


let paddle = new Paddle(canvas.width/2,100);
let ball = new Ball(canvas.width /2, canvas.height /2 , 2,ballxStart(), 5, "#D94E73");

let game = (function (paddleObj, ballObj){

    //Paddle event
    window.addEventListener('keydown', function(e)  {

    if(e.which == 37) {
        if(paddle.x - paddle.width < -paddle.width) {
            return
        }else {
            paddle.x -=paddleSpped;
        }
    }

    if(e.which == 39) {
        if(paddle.x + paddle.width > canvas.width) {
            return
        }else {
            paddle.x +=paddleSpped;
        }
    }
    paddleObj.update()
    });


    //animate
    function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    
    
    //paddle collision with ball
    if(Math.floor(paddleObj.y - paddleObj.height  )  === Math.floor(ballObj.y + ballObj.radious)) {
         if(ballObj.x >= paddleObj.x && ballObj.x <= paddleObj.x + paddleObj.width) {
            ballObj.dy = -ballObj.dy;
         }
    }

    
    //ball collision with brick
    for(let r =0; r < brick.row; r++) {
        for (let e =0; e < brick.column; e++) {
            let b = bricks[r][e];
            if(b.status){
                if(ballObj.x + ballObj.radious > b.x && ballObj.x -ballObj.radious < b.x +brick.width) {
                    if(ballObj.y + ballObj.radious > b.y && ballObj.y -ballObj.radious < b.y +brick.height) {
    
                        ballObj.dy = -ballObj.dy;
                        b.status = false;
                        
                    }
                }
            }
        }
    }

    
        paddleObj.update();
        ballObj.update();
        if(!status){drawBricks()}

    }

    
    animate()
    
    

})(paddle, ball);



function gameOver(str) {
    
    if(str === 'lose') {
        c.clearRect(0,0,canvas.width,canvas.height);
        c.fillText('GAME OVER!!!!', canvas.width /2 - 90, canvas.height /2);
        c.fillText('double click  to start again ', canvas.width /2 - 140, canvas.height /2 + 30);
        c.font = "20px Georgia";
        
        //add event on page
        document.addEventListener("dblclick", function(){
            location.reload();
        })
    }
}

