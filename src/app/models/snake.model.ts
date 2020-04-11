export class SnakeModel {

  constructor(public cells: { x: number; y: number }[], public direction: {x: number; y: number}) {}

  grows() {
    const lastCell = this.cells[this.cells.length - 1];
    const beforeLastCell = this.cells[this.cells.length - 2];
    let newCell;

    if (beforeLastCell.x > lastCell.x) newCell = {x: lastCell.x - 1, y: lastCell.y};
    if (beforeLastCell.x < lastCell.x) newCell = {x: lastCell.x + 1, y: lastCell.y};
    if (beforeLastCell.y > lastCell.y) newCell = {x: lastCell.x, y: lastCell.y - 1};
    if (beforeLastCell.y < lastCell.y) newCell = {x: lastCell.x, y: lastCell.y + 1};

    this.cells.push(newCell);
  }
}
