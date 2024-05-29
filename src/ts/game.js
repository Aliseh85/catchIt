var FallingObject = /** @class */ (function () {
    function FallingObject(x, y, size, imageUrl) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = imageUrl;
    }
    FallingObject.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    };
    FallingObject.prototype.fall = function (speed) {
        this.y += speed;
    };
    FallingObject.prototype.resetPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    FallingObject.prototype.getY = function () {
        return this.y;
    };
    return FallingObject;
}());
var Boat = /** @class */ (function () {
    function Boat(x, y, width, height, imageUrl) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageUrl;
    }
    Boat.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    Boat.prototype.move = function (direction, speed, boundaryWidth) {
        if (direction === 'left') {
            this.x -= speed;
            if (this.x < 0) {
                this.x = 0;
            }
        }
        else if (direction === 'right') {
            this.x += speed;
            if (this.x + this.width > boundaryWidth) {
                this.x = boundaryWidth - this.width;
            }
        }
    };
    Boat.prototype.setX = function (x) {
        this.x = x;
    };
    Boat.prototype.getX = function () {
        return this.x;
    };
    Boat.prototype.getY = function () {
        return this.y;
    };
    Boat.prototype.getWidth = function () {
        return this.width;
    };
    Boat.prototype.getHeight = function () {
        return this.height;
    };
    return Boat;
}());
var Airplane = /** @class */ (function () {
    function Airplane(x, y, width, height, imageUrl, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageUrl;
        this.speed = speed;
    }
    Airplane.prototype.draw = function (ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    Airplane.prototype.fly = function () {
        this.x += this.speed;
        if (this.x > window.innerWidth) {
            this.resetPosition();
        }
    };
    Airplane.prototype.resetPosition = function () {
        this.x = -this.width;
    };
    Airplane.prototype.getX = function () {
        return this.x;
    };
    Airplane.prototype.getY = function () {
        return this.y;
    };
    Airplane.prototype.getWidth = function () {
        return this.width;
    };
    Airplane.prototype.getHeight = function () {
        return this.height;
    };
    return Airplane;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.fallingObject = null;
        this.boatSpeed = 10;
        this.ballSpeed = 3;
        this.score = 0;
        this.hearts = 3;
        this.gameLoopHandle = null;
        this.ballDropped = false;
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        var restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.addEventListener('click', this.restartGame.bind(this));
        }
        this.boat = new Boat(this.width / 2, this.height - 120, 100, 70, 'boat.jpg');
        this.airplane = new Airplane(-100, 50, 200, 100, 'plane.jpg', 2);
        this.addEventListeners();
        this.initFallingObject();
        this.gameLoop();
    }
    Game.prototype.initFallingObject = function () {
        this.fallingObject = null; // Initialize with no falling object
        this.ballDropped = false;
    };
    Game.prototype.dropBallFromAirplane = function () {
        if (!this.fallingObject && this.airplane.getX() > 1 && !this.ballDropped) {
            var x = this.airplane.getX() + this.airplane.getWidth() / 2;
            var y = this.airplane.getY() + this.airplane.getHeight();
            var size = 20;
            var imageUrl = 'ball.jpg';
            this.fallingObject = new FallingObject(x, y, size, imageUrl);
            this.ballDropped = true;
        }
    };
    Game.prototype.gameOver = function () {
        if (this.gameLoopHandle !== null) {
            cancelAnimationFrame(this.gameLoopHandle);
        }
        var gameOverX = this.width / 2;
        var gameOverY = this.height / 2;
        // Draw "Game Over!" text
        this.ctx.fillStyle = 'black';
        this.ctx.font = '80px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over!', gameOverX, gameOverY);
        // Show restart button
        var restartButton = document.getElementById('restartButton');
        if (restartButton) {
            var restartButtonX = this.width / 2;
            var restartButtonY = gameOverY + 50; // Adjust as needed
            restartButton.style.display = 'block';
            restartButton.style.position = 'absolute';
            restartButton.style.left = "".concat(restartButtonX, "px");
            restartButton.style.top = "".concat(restartButtonY, "px");
        }
    };
    Game.prototype.addEventListeners = function () {
        var _this = this;
        document.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') {
                _this.boat.move('left', _this.boatSpeed, _this.width);
            }
            else if (event.key === 'ArrowRight') {
                _this.boat.move('right', _this.boatSpeed, _this.width);
            }
        });
        var sensitivityFactor = 0.2; // Adjust this value to control sensitivity
        this.canvas.addEventListener('mousemove', function (event) {
            var mouseX = event.clientX - _this.canvas.getBoundingClientRect().left;
            var boatX = mouseX - _this.boat.getWidth() / 2; // Adjust for boat width
            // Ensure the boat stays within the canvas boundaries
            if (boatX < 0) {
                _this.boat.setX(0);
            }
            else if (boatX + _this.boat.getWidth() > _this.width) {
                _this.boat.setX(_this.width - _this.boat.getWidth());
            }
            else {
                // Adjust boat movement based on sensitivity factor
                var delta = boatX - _this.boat.getX();
                _this.boat.setX(_this.boat.getX() + delta * sensitivityFactor);
            }
        });
    };
    Game.prototype.gameLoop = function () {
        this.gameLoopHandle = requestAnimationFrame(this.gameLoop.bind(this));
        this.update();
        this.render();
    };
    Game.prototype.update = function () {
        this.airplane.fly();
        this.dropBallFromAirplane();
        if (this.fallingObject) {
            this.fallingObject.fall(this.ballSpeed);
            if (this.isColliding(this.fallingObject)) {
                this.score += 20;
                this.fallingObject = null;
                this.ballDropped = false;
            }
            else if (this.fallingObject.getY() > this.height) {
                this.hearts--;
                if (this.hearts === 0) {
                    this.gameOver();
                    return;
                }
                this.fallingObject = null;
                this.ballDropped = false;
            }
        }
    };
    Game.prototype.isColliding = function (obj) {
        var boatLeft = this.boat.getX();
        var boatRight = boatLeft + this.boat.getWidth();
        var boatTop = this.boat.getY();
        var boatBottom = boatTop + this.boat.getHeight();
        var objX = obj['x'] + obj['size'] / 2; // Check the center of the ball
        return (objX >= boatLeft &&
            objX <= boatRight &&
            obj['y'] + obj['size'] >= boatTop &&
            obj['y'] <= boatBottom);
    };
    Game.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.airplane.draw(this.ctx);
        if (this.fallingObject) {
            this.fallingObject.draw(this.ctx);
        }
        this.boat.draw(this.ctx);
        this.ctx.fillStyle = 'royalblue';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText("Score: ".concat(this.score), this.width - 10, 30);
        this.ctx.fillText("Hearts: ".concat(this.hearts), this.width - 10, 60);
    };
    Game.prototype.restartGame = function () {
        if (this.gameLoopHandle !== null) {
            cancelAnimationFrame(this.gameLoopHandle);
        }
        // Reset the restart button style to hide it
        var restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.style.display = 'none';
        }
        this.score = 0;
        this.hearts = 3;
        this.initFallingObject();
        this.gameLoop();
    };
    return Game;
}());
new Game();
