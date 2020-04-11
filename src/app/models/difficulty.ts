import {SnakeModel} from './snake.model';
import {AppleModel} from './apple.model';

export interface Difficulty {
  moveSnake(snake: SnakeModel, currentDirection: {x: number, y: number},
            lengthX: number, lengthY: number): boolean;

  getScoreValue(): number;

  generateApple(snake: SnakeModel, lengthX: number, lengthY: number): AppleModel;
}

export function isInGrid(x: number, y: number , lengthX: number, lengthY: number) {
  return x >= 0 && x < lengthX && y >= 0 && y < lengthY;
}
