class FallingObject {
    private x: number;
    private y: number;
    private size: number;
    private image: HTMLImageElement;
  
    constructor(x: number, y: number, size: number, imageUrl: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = imageUrl;
    }
  
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
  
    public fall(speed: number): void {
        this.y += speed;
    }
  
    public resetPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
  
    public getY(): number {
        return this.y;
    }
  }
  
  class Boat {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private image: HTMLImageElement;
  
    constructor(x: number, y: number, width: number, height: number, imageUrl: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; // Fixed typo
        this.image = new Image();
        this.image.src = imageUrl;
    }
  
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    public move(direction: 'left' | 'right', speed: number, boundaryWidth: number): void {
        if (direction === 'left') {
            this.x -= speed;
            if (this.x < 0) {
                this.x = 0;
            }
        } else if (direction === 'right') {
            this.x += speed;
            if (this.x + this.width > boundaryWidth) {
                this.x = boundaryWidth - this.width;
            }
        }
    }
  
    public getX(): number {
        return this.x;
    }
  
    public getY(): number {
        return this.y;
    }
  
    public getWidth(): number {
        return this.width;
    }
  
    public getHeight(): number {
        return this.height;
    }
  }
  
  class Airplane {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private image: HTMLImageElement;
    private speed: number;
  
    constructor(x: number, y: number, width: number, height: number, imageUrl: string, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageUrl;
        this.speed = speed;
    }
  
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    public fly(): void {
        this.x += this.speed;
        if (this.x > window.innerWidth) {
            this.resetPosition();
        }
    }
  
    public resetPosition(): void {
        this.x = -this.width;
    }
  
    public getX(): number {
        return this.x;
    }
  
    public getY(): number {
        return this.y;
    }
  
    public getWidth(): number {
        return this.width;
    }
  
    public getHeight(): number {
        return this.height;
    }
  }
  
  class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private height: number = window.innerHeight;
    private width: number = window.innerWidth;
    private fallingObject: FallingObject | null = null;
    private boat: Boat;
    private airplane: Airplane;
    private boatSpeed: number = 10; 
    private ballSpeed: number = 3; 
    private score: number = 0;
    private hearts: number = 3;
    private gameLoopHandle: number | null = null;
    private ballDropped: boolean = false;
  
    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  
        const restartButton = document.getElementById('restartButton');
          if (restartButton) 
            {
            restartButton.addEventListener('click', this.restartGame.bind(this));
           }
  
        this.boat = new Boat(this.width / 2 - 50, this.height - 100, 100, 50, 'boat.jpg');
        this.airplane = new Airplane(-100, 50, 200, 100, 'plane.jpg', 2);
  
        this.addEventListeners();
        this.initFallingObject();
  
        this.gameLoop();
    }
  
    private initFallingObject(): void {
        this.fallingObject = null; // Initialize with no falling object
        this.ballDropped = false;
    }
  
    private dropBallFromAirplane(): void {
        if (!this.fallingObject && this.airplane.getX() > 1 && !this.ballDropped) {
            const x = this.airplane.getX() + this.airplane.getWidth() / 2;
            const y = this.airplane.getY() + this.airplane.getHeight();
            const size = Math.random() * 30 + 10;
            const imageUrl = 'ball.jpg';
            this.fallingObject = new FallingObject(x, y, size, imageUrl);
            this.ballDropped = true;
        }
    }
  
    private gameOver(): void {
        if (this.gameLoopHandle !== null) {
            cancelAnimationFrame(this.gameLoopHandle);
        }
        
        const gameOverX = this.width / 2;
        const gameOverY = this.height / 2;
        
        // Draw "Game Over!" text
        this.ctx.fillStyle = 'black';
        this.ctx.font = '80px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over!', gameOverX, gameOverY);
    
        // Show restart button
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            const restartButtonX = this.width / 2;
            const restartButtonY = gameOverY + 50; // Adjust as needed
            restartButton.style.display = 'block';
            restartButton.style.position = 'absolute';
            restartButton.style.left = `${restartButtonX}px`;
            restartButton.style.top = `${restartButtonY}px`;
        }
    }
    
       
    
  
    private addEventListeners(): void {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.boat.move('left', this.boatSpeed, this.width);
            } else if (event.key === 'ArrowRight') {
                this.boat.move('right', this.boatSpeed, this.width);
            }
        });
    }
  
    private gameLoop(): void {
        this.gameLoopHandle = requestAnimationFrame(this.gameLoop.bind(this));
        this.update();
        this.render();
    }
  
    private update(): void {
        this.airplane.fly();
        this.dropBallFromAirplane();
  
        if (this.fallingObject) {
            this.fallingObject.fall(this.ballSpeed);
  
            if (this.isColliding(this.fallingObject)) {
                this.score += 20;
                this.fallingObject = null;
                this.ballDropped = false;
            } else if (this.fallingObject.getY() > this.height) {
                this.hearts--;
                if (this.hearts === 0) {
                    this.gameOver();
                    return;
                }
                this.fallingObject = null;
                this.ballDropped = false;
            }
        }
    }
  
    private isColliding(obj: FallingObject): boolean {
        const boatLeft = this.boat.getX();
        const boatRight = boatLeft + this.boat.getWidth();
        const boatTop = this.boat.getY();
        const boatBottom = boatTop + this.boat.getHeight();
        const objX = obj['x'] + obj['size'] / 2; // Check the center of the ball
        return (
            objX >= boatLeft &&
            objX <= boatRight &&
            obj['y'] + obj['size'] >= boatTop &&
            obj['y'] <= boatBottom
        );
    }
  
    private render(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'royalblue';
        this.ctx.fillRect(0, this.height - 50, this.width, 50);
        this.airplane.draw(this.ctx);
  
        if (this.fallingObject) {
            this.fallingObject.draw(this.ctx);
        }
  
        this.boat.draw(this.ctx);
  
        this.ctx.fillStyle = 'black';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Score: ${this.score}`, this.width - 10, 30);
        this.ctx.fillText(`Hearts: ${this.hearts}`, this.width - 10, 60);
    }
  
    private restartGame(): void {
        if (this.gameLoopHandle !== null) {
            cancelAnimationFrame(this.gameLoopHandle);
        }
    
        // Reset the restart button style to hide it
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.style.display = 'none';
        }
    
        this.score = 0;
        this.hearts = 3;
        this.initFallingObject();
    
        this.gameLoop();
    }
    
  }
  
  new Game();