import {Difficulty, isInGrid} from './difficulty';
import {SnakeModel} from './snake.model';
import {AppleModel} from './apple.model';

export class EasyDifficulty implements Difficulty {

  getScoreValue(): number {
    return 1;
  }

  moveSnake(snake: SnakeModel, currentDirection: { x: number; y: number },
            lengthX: number, lengthY: number) {
    const head = snake.cells[0];
    const nextHead = {
      x: head.x + currentDirection.x,
      y: head.y + currentDirection.y
    };

    snake.cells.pop();

    if (isInGrid(nextHead.x, nextHead.y, lengthX, lengthY)) {
      snake.cells.unshift(nextHead);
    }
    else {
      if (currentDirection.x === 1) {
        snake.cells.unshift({x: 0, y: head.y});
      }
      else if (currentDirection.x === -1) {
        snake.cells.unshift({x: lengthX - 1, y: head.y});
      }
      else if (currentDirection.y === 1) {
        snake.cells.unshift({x: head.x, y: 0});
      }
      else {
        snake.cells.unshift({x: head.x, y: lengthY - 1});
      }
    }

    return true;
  }

  generateApple(snake: SnakeModel, lengthX: number, lengthY: number): AppleModel {
    let x = Math.floor(Math.random() * lengthX);
    let y = Math.floor(Math.random() * lengthY);

    // Because we don't want the apple to be on the snake
    while (snake.cells.some(e => e.x === x && e.y === y)) {
      x = Math.floor(Math.random() * lengthX);
      y = Math.floor(Math.random() * lengthY);
    }

    return new AppleModel(x, y);
  }
}
