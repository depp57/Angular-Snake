import {SnakeModel} from './snake.model';

export interface Difficulty {
  moveSnake(snake: SnakeModel, currentDirection: {x: number, y: number},
            lengthX: number, lengthY: number): boolean;

  getScoreValue(): number;
}

export function isInGrid(x: number, y: number , lengthX: number, lengthY: number) {
  return x >= 0 && x < lengthX && y >= 0 && y < lengthY;
}
