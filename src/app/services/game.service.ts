import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SnakeModel} from '../models/snake.model';
import {AppleModel} from '../models/apple.model';

export enum GameDifficulties {
  EASY,
  MEDIUM,
  HARD,
}

export const Direction = {
  NORTH : { x: 0, y: -1},
  EAST : { x: 1, y: 0},
  SOUTH : { x: 0, y: 1},
  WEST : { x: -1, y: 0}
};

@Injectable({providedIn: 'root'})
export class GameService {

  private difficulty: GameDifficulties;

  private snake: SnakeModel;
  snakeSubject: Subject<SnakeModel> = new Subject<SnakeModel>();
  apple: AppleModel;

  private score: number;
  scoreSubject: Subject<number> = new Subject<number>();

  private lengthX: number;
  private lengthY: number;

  private currentDirection = Direction.SOUTH;
  private hasMoved = false;

  private ended: boolean;

  startGame(difficulty: GameDifficulties, lengthX: number, lengthY: number) {
    this.difficulty = difficulty;
    this.ended = false;
    this.score = 0;
    this.scoreSubject.next(this.score);
    this.lengthX = lengthX;
    this.lengthY = lengthY;

    // Emit the 'first' snake and apple
    this.snake = new SnakeModel([
      {
        x: Math.floor(this.lengthX / 2),
        y: Math.floor(this.lengthY / 2) + 2
      },
      {
        x: Math.floor(this.lengthX / 2),
        y: Math.floor(this.lengthY / 2) + 1
      },
      {
        x: Math.floor(this.lengthX / 2),
        y: Math.floor(this.lengthY / 2)
      }]
    );

    this.apple = this.generateApple();
    this.emitSnake();
  }

  private emitSnake() {
    this.snakeSubject.next(this.snake);
  }

  private generateApple(): AppleModel {
    let x = Math.floor(Math.random() * this.lengthX);
    let y = Math.floor(Math.random() * this.lengthY);

    // Because we don't want the apple to be on the snake
    while (this.snake.cells.some(e => e.x === x && e.y === y)) {
      x = Math.floor(Math.random() * this.lengthX);
      y = Math.floor(Math.random() * this.lengthY);
    }

    return new AppleModel(x, y);
  }

  nextStep() {
    if (!this.ended) {
      this.moveSnake();
      this.emitSnake();
    }
  }

  private moveSnake() {
    const head = this.snake.cells[0];
    const nextHead = {
      x: head.x + this.currentDirection.x,
      y: head.y + this.currentDirection.y
    };

    this.snake.cells.pop();

    if (this.isInGrid(nextHead.x, nextHead.y)) {
      this.snake.cells.unshift(nextHead);
    }
    else {
      if (this.currentDirection.x === 1) {
        this.snake.cells.unshift({x: 0, y: head.y});
      }
      else if (this.currentDirection.x === -1) {
        this.snake.cells.unshift({x: this.lengthX - 1, y: head.y});
      }
      else if (this.currentDirection.y === 1) {
        this.snake.cells.unshift({x: head.x, y: 0});
      }
      else {
        this.snake.cells.unshift({x: head.x, y: this.lengthY - 1});
      }
    }

    this.checkCollision();
    this.hasMoved = true;
  }

  private isInGrid(x: number, y: number) {
    return x >= 0 && x < this.lengthX && y >= 0 && y < this.lengthY;
  }

  changeDirection(direction: {x: number; y: number}) {
    if (this.hasMoved && this.currentDirection.x !== direction.x && this.currentDirection.y !== direction.y) {
      this.currentDirection = direction;
      this.hasMoved = false;
    }
  }

  private incrementsScore() {
    this.score++;
    this.scoreSubject.next(this.score);

    // And grows the snake
    this.snake.grows();
  }

  private checkCollision() {
    const head = this.snake.cells[0];

    // Check if the snake eats an apple
    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.apple = this.generateApple();
      this.incrementsScore();
    }

    // Check if the snake eats himself
    if (this.snake.cells.slice(1).some(e => e.x === head.x && e.y === head.y)) {
      this.endGame();
    }
  }

  private endGame() {
    this.ended = true;
  }
}
