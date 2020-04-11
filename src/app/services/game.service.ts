import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SnakeModel} from '../models/snake.model';
import {AppleModel} from '../models/apple.model';
import {Difficulty} from '../models/difficulty';
import {EasyDifficulty} from '../models/easyDifficulty';
import {MediumDifficulty} from '../models/mediumDifficulty';
import {HardDifficulty} from '../models/hardDifficulty';

export const Direction = {
  NORTH : { x: 0, y: -1},
  EAST : { x: 1, y: 0},
  SOUTH : { x: 0, y: 1},
  WEST : { x: -1, y: 0}
};

@Injectable({providedIn: 'root'})
export class GameService {

  private difficulty: Difficulty;

  private snake: SnakeModel;
  snakeSubject: Subject<SnakeModel> = new Subject<SnakeModel>();
  apple: AppleModel;
  rocks: {x: number, y: number}[];

  private score: number;
  scoreSubject: Subject<number> = new Subject<number>();

  private lengthX: number;
  private lengthY: number;

  private currentDirection;
  private hasMoved = false;

  private ended: boolean;
  isEndedSubject: Subject<boolean> = new Subject<boolean>();

  startGame(difficulty: string, lengthX: number, lengthY: number) {
    this.ended = false;
    this.score = 0;
    this.currentDirection = Direction.SOUTH;
    this.scoreSubject.next(this.score);
    this.lengthX = lengthX;
    this.lengthY = lengthY;
    this.rocks = [];

    // Emit the 'first' snake and apple
    this.snake = new SnakeModel([
      {
        x: Math.floor(this.lengthX / 2),
        y: 2
      },
      {
        x: Math.floor(this.lengthX / 2),
        y: 1
      },
      {
        x: Math.floor(this.lengthX / 2),
        y: 0
      }], Direction.SOUTH
    );

    let diff;
    switch (difficulty) {
      case 'easy' :
        diff = new EasyDifficulty();
        break;
      case 'medium' :
        diff = new MediumDifficulty();
        break;
      case 'hard' :
        const hard = new HardDifficulty(lengthX, lengthY, this.snake);
        diff = hard;
        this.rocks = hard.rocks;
        break;
    }
    this.difficulty = diff;

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
    // If the snake can't move, the player lose
    if (!this.difficulty.moveSnake(this.snake, this.currentDirection, this.lengthX, this.lengthY)) this.endGame();
    this.checkCollision();
    this.hasMoved = true;
  }

  changeDirection(direction: {x: number; y: number}) {
    if (this.hasMoved && this.currentDirection.x !== direction.x && this.currentDirection.y !== direction.y) {
      this.currentDirection = direction;
      this.snake.direction = direction;
      this.hasMoved = false;
    }
  }

  private incrementsScore() {
    this.score += this.difficulty.getScoreValue();
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
    this.isEndedSubject.next(true);
  }
}
