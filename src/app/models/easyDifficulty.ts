import {Difficulty, isInGrid} from './difficulty';
import {SnakeModel} from './snake.model';

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
}
