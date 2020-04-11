import {Difficulty, isInGrid} from './difficulty';
import {SnakeModel} from './snake.model';
import {AppleModel} from './apple.model';
import {EasyDifficulty} from './easyDifficulty';

export class MediumDifficulty implements Difficulty {

  getScoreValue(): number {
    return 2;
  }

  moveSnake(snake: SnakeModel, currentDirection: { x: number; y: number }, lengthX: number, lengthY: number) {
    const head = snake.cells[0];
    const nextHead = {
      x: head.x + currentDirection.x,
      y: head.y + currentDirection.y
    };

    if (isInGrid(nextHead.x, nextHead.y, lengthX, lengthY)) {
      snake.cells.unshift(nextHead);
      snake.cells.pop();
      return true;
    }

    return false;
  }

  generateApple(snake: SnakeModel, lengthX: number, lengthY: number): AppleModel {
    return EasyDifficulty.prototype.generateApple(snake, lengthX, lengthY);
  }
}
