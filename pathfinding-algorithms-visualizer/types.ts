export enum gameState {
  READY,
  RUNNING,
  FINISHED
}

export enum CellType {
  FLOOR,
  WALL,
  START,
  END
}

export interface Cell {
  row: number,
  col: number,
  type: CellType,
  visited: boolean,
  parent: Cell | null,
  weight: number,
}
