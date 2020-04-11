import {Difficulty, isInGrid} from './difficulty';
import {SnakeModel} from './snake.model';
import {AppleModel} from './apple.model';

export class HardDifficulty implements Difficulty {

  rocks: {x: number, y: number}[];

  constructor(lengthX: number, lengthY: number, snake: SnakeModel) {
    this.rocks = [];

    // generate randoms rocks
    const nbRocks = lengthX * lengthY / 60;

    for (let i = 0; i < nbRocks; i++) {
      const rock = {
        x: Math.floor(Math.random() * lengthX),
        y: Math.floor(Math.random() * lengthY)
      };

      // Because we don't want the rock to be on the snake
      while (snake.cells.some(e => Math.abs(e.x - rock.x) < 2 && Math.abs(e.y - rock.y) < 2)) {
        rock.x = Math.floor(Math.random() * lengthX);
        rock.y = Math.floor(Math.random() * lengthY);
      }

      this.rocks.push(rock);
    }
  }


  getScoreValue(): number {
    return 3;
  }

  moveSnake(snake: SnakeModel, currentDirection: { x: number; y: number }, lengthX: number, lengthY: number) {
    const head = snake.cells[0];
    const nextHead = {
      x: head.x + currentDirection.x,
      y: head.y + currentDirection.y
    };

    if (isInGrid(nextHead.x, nextHead.y, lengthX, lengthY) && !this.checkRockCollision(nextHead.x, nextHead.y)) {
      snake.cells.unshift(nextHead);
      snake.cells.pop();
      return true;
    }

    return false;
  }

  generateApple(snake: SnakeModel, lengthX: number, lengthY: number): AppleModel {
    let x = Math.floor(Math.random() * lengthX);
    let y = Math.floor(Math.random() * lengthY);

    // Because we don't want the apple to be on the snake nor on a rock
    while (snake.cells.some(e => e.x === x && e.y === y)
    || this.rocks.some(rock => Math.abs(rock.x - x) < 2 && Math.abs(rock.y - y) < 2)) {
      x = Math.floor(Math.random() * lengthX);
      y = Math.floor(Math.random() * lengthY);
    }

    return new AppleModel(x, y);
  }

  private checkRockCollision(x: number, y: number) {
    return this.rocks.some(rock => rock.x === x && rock.y === y);
  }
}
