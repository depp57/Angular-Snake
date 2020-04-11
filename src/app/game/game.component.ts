import {Component, OnDestroy, OnInit} from '@angular/core';
import {Direction, GameDifficulties, GameService} from '../services/game.service';
import {Subscription} from 'rxjs';
import {SnakeModel} from '../models/snake.model';
import {AppleModel} from '../models/apple.model';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  // Some global variables used by the drawing functions
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  canvasWmid: number;
  canvasHmid: number;
  dx;
  dy;
  snakeSprites;

  snakeSubscription: Subscription;
  isGameEndedSubscription: Subscription;

  animationFrameId: number;

  constructor(private gameService: GameService) {
    this.snakeSprites = new Image();
    this.snakeSprites.src = 'assets/snakeSprites.png';
  }

  ngOnInit(): void {
    this.initCanvas();
    this.drawMenu();
  }

  private initCanvas() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    // Resize le canvas pour qu'il occupe toute la fenetre
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.canvasCtx = this.canvas.getContext('2d');

    this.canvasWmid = this.canvas.width / 2;
    this.canvasHmid = this.canvas.height / 2;
  }

  private drawMenu() {
    const menuImage = new window.Image();
    menuImage.addEventListener('load', () => {
      const imgWmid = menuImage.width / 2;
      const imgHmid = menuImage.height / 2;

      this.canvasCtx.drawImage(menuImage, this.canvasWmid - imgWmid, this.canvasHmid - imgHmid);

      // Add the listener to let the user choose one difficulty in the menu
      this.addOneTimeClickListener();
    });
    menuImage.src = 'assets/gameMenu.png';
  }

  startGame(difficulty: GameDifficulties) {
    // Add the keys listener for web and mobile
    this.addKeyListener();

    // Clear the menu
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Subscribe to the snake so every time the gameService update the snake, the UI redraw it
    this.snakeSubscription = this.gameService.snakeSubject.subscribe(
      snake => this.drawSnake(snake)
    );

    // Subscribe to the game status, to know when the game end (the player lose)
    this.isGameEndedSubscription = this.gameService.isEndedSubject.subscribe(
      isEnded => { if (isEnded) this.endGame(); }
    );

    // Dynamically compute the length of the map, to make the game fit the entire screen responsively
    const lengthX = 17;
    const lengthY = Math.floor(lengthX * this.canvas.height / this.canvas.width);
    this.dx = this.canvas.width / lengthX;
    this.dy = this.canvas.height / lengthY;

    if (lengthY < 8) {
      alert('Désolé, votre écran est trop petit pour le serpent :/');
      return;
    }

    this.gameService.startGame(difficulty, lengthX, lengthY);

    const step = t1 => t2 => {
      if (t2 - t1 > 60) {
        this.gameService.nextStep();
        this.animationFrameId = window.requestAnimationFrame(step(t2));
      }
      else {
        this.animationFrameId = window.requestAnimationFrame(step(t1));
      }
    };

    this.animationFrameId = window.requestAnimationFrame(step(0));
  }

  private drawSnake(snake: SnakeModel) {
    // Erase all old drawings
    this.canvasCtx.fillStyle = 'black';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);


    // Sprite column and row that get calculated
    let spriteX;
    let spriteY;

    // Draw his head
    switch (snake.direction) {
      case Direction.NORTH :
        spriteX = 3; spriteY = 0;
        break;
      case Direction.EAST :
        spriteX = 4; spriteY = 0;
        break;
      case Direction.SOUTH :
        spriteX = 4; spriteY = 1;
        break;
      case Direction.WEST :
        spriteX = 3; spriteY = 1;
        break;
    }
    this.canvasCtx.drawImage(this.snakeSprites, spriteX * 64, spriteY * 64,
      64, 64,
      this.dx * snake.cells[0].x, this.dy * snake.cells[0].y,
      this.dx, this.dy);


    // Draw his body
    for (let i = 1; i < snake.cells.length - 1; i++) {
      const prevCell = snake.cells[i + 1];
      const nextCell = snake.cells[i - 1];
      const currentCell = snake.cells[i];

      if (prevCell.x !== currentCell.x && nextCell.x !== currentCell.x) {
        spriteX = 1; spriteY = 0; // Horizontal left-right
      }
      else if (prevCell.x < currentCell.x && nextCell.y > currentCell.y
      || prevCell.y > currentCell.y && nextCell.x < currentCell.x) {
        spriteX = 2; spriteY = 0; // Angle left-down
      }
      else if (prevCell.y !== currentCell.y && nextCell.y !== currentCell.y) {
        spriteX = 2; spriteY = 1; // Vertical up-down
      }
      else if (prevCell.y < currentCell.y && nextCell.x < currentCell.x
      || prevCell.x < currentCell.x && nextCell.y < currentCell.y) {
        spriteX = 2; spriteY = 2; // Angle top-left
      }
      else if (prevCell.x > currentCell.x && nextCell.y < currentCell.y
      || prevCell.y < currentCell.y && nextCell.x > currentCell.x) {
        spriteX = 0; spriteY = 1; // Angle right-up
      }
      else {
        spriteX = 0; spriteY = 0; // Angle down-right
      }

      this.canvasCtx.drawImage(this.snakeSprites, spriteX * 64, spriteY * 64,
        64, 64,
        this.dx * currentCell.x, this.dy * currentCell.y,
        this.dx, this.dy);
    }

    // Draw his tail
    const tail = snake.cells[snake.cells.length - 1];
    const beforeTail = snake.cells[snake.cells.length - 2];

    if (beforeTail.x > tail.x) {
      spriteX = 4; spriteY = 2;
    }
    else if (beforeTail.y > tail.y) {
      spriteX = 4; spriteY = 3;
    }
    else if (beforeTail.x < tail.x) {
      spriteX = 3; spriteY = 3;
    }
    else {
      spriteX = 3; spriteY = 2;
    }

    this.canvasCtx.drawImage(this.snakeSprites, spriteX * 64, spriteY * 64,
      64, 64,
      this.dx * tail.x, this.dy * tail.y,
      this.dx, this.dy);

    this.drawApple(this.gameService.apple);
  }

  private drawApple(apple: AppleModel) {
    this.canvasCtx.drawImage(this.snakeSprites, 0, 192,
      64, 64,
      this.dx * apple.x, this.dy * apple.y,
      this.dx, this.dy);
  }

  ngOnDestroy(): void {
    // To avoid memory leak
    if (this.snakeSubscription) this.snakeSubscription.unsubscribe();
    if (this.isGameEndedSubscription) this.isGameEndedSubscription.unsubscribe();
    window.cancelAnimationFrame(this.animationFrameId);
  }

  private addOneTimeClickListener() {
    const oneTimeClickListener = (e) => {

      const deltaX = Math.abs(e.x - this.canvasWmid);
      const deltaY = e.y - this.canvasHmid - 22;

      // Some spaghetti maths to compute the selected button
      if (deltaX < 100) {
        let started = false;

        if (deltaY > -100 && deltaY < -60) {
          this.startGame(GameDifficulties.EASY);
          started = true;
        }
        else if (deltaY > -20 && deltaY < 20) {
          this.startGame(GameDifficulties.MEDIUM);
          started = true;
        }
        else if (deltaY > 50 && deltaY < 100) {
          this.startGame(GameDifficulties.HARD);
          started = true;
        }

        if (started) this.canvas.removeEventListener('click', oneTimeClickListener);
      }
    };
    this.canvas.addEventListener('click', oneTimeClickListener);
  }

  private addKeyListener() {
    const keyListener = (e) => {
      switch (e.key) {
        case 'w' : case 'z' : case 'ArrowUp' :
          this.gameService.changeDirection(Direction.NORTH);
          break;
        case 'd' : case 'ArrowRight' :
          this.gameService.changeDirection(Direction.EAST);
          break;
        case 's': case 'ArrowDown' :
          this.gameService.changeDirection(Direction.SOUTH);
          break;
        case 'a' : case 'q' : case 'ArrowLeft' :
          this.gameService.changeDirection(Direction.WEST);
          break;
      }
    };
    // Remove if there is an older listener
    this.canvas.removeEventListener('kewdown', keyListener);
    this.canvas.addEventListener('keydown', keyListener);


    // Swipe Up / Down / Left / Right
    let initialX = null;
    let initialY = null;

    const startTouch = e => {
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
    };

    const moveTouch = e => {
      if (initialX === null) {
        return;
      }

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const deltaX = currentX - initialX;
      const deltaY = currentY - initialY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) this.gameService.changeDirection(Direction.EAST);
        else this.gameService.changeDirection(Direction.WEST);
      }
      else {
        if (deltaY > 0) this.gameService.changeDirection(Direction.SOUTH);
        else this.gameService.changeDirection(Direction.NORTH);
      }

      initialX = null;
      initialY = null;

      e.preventDefault();
    };

    // Remove if there is an older listener
    this.canvas.removeEventListener('touchstart', startTouch);
    this.canvas.removeEventListener('touchmove', moveTouch);
    this.canvas.addEventListener('touchstart', startTouch);
    this.canvas.addEventListener('touchmove', moveTouch);
  }

  private endGame() {
    // TODO
  }
}
