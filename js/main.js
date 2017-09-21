window.onload = function () {
    var keyCode = {"left": "37", "right": "39", "up": "38", "down": "40"};
    var keyBuf = {};
    var myHeight = 600, myWidth = 400;
    var globalInf = {
        times: 0,
        timeAdd: 0.05,
        score: 0,
        tip: true,
    };

    var plane = {
        x: myWidth / 2,
        y: myHeight * 3 / 4,
        width: 50,
        height: 50,
        speedX: 0,
        speedY: 0,
        speedMax: 150,
        accelerationX: 0,
        accelerationY: 0,
        accControl: 0.5,
        friction: 0.05,
        direction: false,
    };


    function obstacle(x, y, speedX, speedY, width, height, beginPos) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = width;
        this.height = height;
        this.beginPos = beginPos;
    }


    var obstacle1 = new obstacle(
        0,
        0,
        0,
        1,
        150,
        30,
        -500
    );

    var obstacle2 = new obstacle(
        300,
        -500,
        0,
        1,
        150,
        30,
        -300
    );

    var c = document.getElementById("myCanvas");

    addEventListener("keydown", function (e) {
        keyBuf[e.keyCode] = true;
        globalInf.tip = false;
    }, false);
    addEventListener("keyup", function (e) {
        delete keyBuf[e.keyCode];
    }, false);
    var myCanvas = window.document.getElementById("myCanvas");
    myCanvas.setAttribute("width", myWidth);
    myCanvas.setAttribute("height", myHeight);

    function game_init() {
        delete keyBuf[keyCode.up];

        plane.accelerationX = 0;
        plane.accelerationY = 0;
        plane.speedY = 0;
        plane.x = myWidth / 2;
        plane.y = myHeight * 3 / 4;
        obstacle1.y = Math.random() * obstacle1.beginPos;
        obstacle2.y = Math.random() * obstacle2.beginPos;

        globalInf.times = 0;
        globalInf.score = 0;
        globalInf.tip = true;

    }


    function update() {
        (function sys_init() {
            plane.accelerationX = 0;
            plane.accelerationY = 0;
        }());

        (function event_trigger() {
            if (keyBuf[keyCode.left]) {
                plane.accelerationX = plane.accControl;
            }
            if (keyBuf[keyCode.right]) {
                plane.accelerationX = -plane.accControl;
            }
            if (keyBuf[keyCode.up]) {

                plane.accelerationY = plane.accControl * (1 + 0.1 * globalInf.score);
            }
            if (keyBuf[keyCode.down]) {
                plane.accelerationY = -plane.accControl;
            }
        }());

        (function step() {
            if (plane.direction) {
                globalInf.times += globalInf.timeAdd;
            } else {
                globalInf.times -= globalInf.timeAdd;
            }

            if (globalInf.times > Math.PI * 2) {
                plane.direction = false;
                globalInf.times = Math.PI * 2;
            } else if (globalInf.times < 0) {
                plane.direction = true;
                globalInf.times = 0;
            }

            plane.speedX = plane.speedMax * Math.cos(globalInf.times);
            plane.x = myWidth / 2 - plane.speedX;

            plane.speedY += plane.accelerationY;
            plane.speedY *= (1 - plane.friction);

            obstacle1.speedY = plane.speedY;
            obstacle1.y += obstacle1.speedY;

            obstacle2.speedY = plane.speedY;
            obstacle2.y += obstacle1.speedY;

            if (obstacle1.y > myHeight) {
                obstacle1.y = Math.random() * Math.random() * obstacle1.beginPos;
                globalInf.score += 1;
            }
            if (obstacle2.y > myHeight) {
                obstacle2.y = Math.random() * Math.random() * obstacle2.beginPos;
                globalInf.score += 1;
            }

        }());

        (function hit_check() {
            if ((plane.x - obstacle1.x) < (obstacle1.width + plane.width / 2)) {
                if ((obstacle1.y - plane.y) < 0 && (plane.y - obstacle1.y) < (obstacle1.height + plane.height / 2)) {
                    window.alert("game over");
                    game_init();
                } else if ((obstacle1.y - plane.y) > 0 && (obstacle1.y - plane.y) < (plane.height / 2)) {
                    window.alert("game over");
                    game_init();
                }
            }


            if ((obstacle2.x - plane.x) < 0 && (plane.x - obstacle2.x) < (obstacle2.width + plane.width / 2)) {
                if ((obstacle2.y - plane.y) < 0 && (plane.y - obstacle2.y) < (obstacle2.height + plane.height / 2)) {
                    window.alert("game over");
                    game_init();
                } else if ((obstacle2.y - plane.y) > 0 && (obstacle2.y - plane.y) < (plane.height / 2)) {
                    window.alert("game over");
                    game_init();
                }
            }
        }());

    };
    var envir = myCanvas.getContext("2d");

    (function draw() {
        update();
        (function draw_init() {
            envir.clearRect(0, 0, myWidth, myHeight);
            envir.lineWidth = 5;
            envir.strokeRect(0, 0, myWidth, myHeight);
            envir.fillStyle = "green";

            envir.translate(plane.x, plane.y);
            if (plane.speedX != 0) {
                envir.rotate(2 * Math.atan(plane.speedY / plane.speedX));
                envir.fillRect(-plane.width / 2, -plane.height / 2, plane.width, plane.height);
                envir.rotate(-2 * Math.atan(plane.speedY / plane.speedX));
            } else {
                envir.fillRect(-plane.width / 2, -plane.height / 2, plane.width, plane.height);
            }


            envir.translate(-plane.x, -plane.y);
            envir.fillRect(obstacle1.x, obstacle1.y, obstacle1.width, obstacle1.height);
            envir.fillRect(obstacle2.x, obstacle2.y, obstacle2.width, obstacle2.height);
            envir.fillText("score:", 10, 20);
            envir.fillText(globalInf.score, 50, 20)


            if (globalInf.tip == true) {
                envir.fillText("press ↑", myWidth / 2, myHeight / 2);
            }
            requestAnimationFrame(draw);
        }());
    }());
}