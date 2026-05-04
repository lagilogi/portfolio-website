export enum GameState {
  READY,
  RUNNING,
  PAUSED,
  FINISHED,
  RESETTING
}

export enum CellType {
  FLOOR,
  WALL,
  START,
  END
}

export interface Cell {
  id: string
  row: number,
  col: number,
  type: CellType,
  visited: boolean,
  parent: Cell | null,
  weight: number | null,
}

export interface PathfindingAlgorithm {
  start: Cell,
  step(): Cell | null,
  getCell(cellCoords: number[]): Cell,
  reset(grid: Cell[][], currMaze: Maze): void,
}

export interface Maze {
  name: string,
  start: number[],
  end: number[],
  maze: number[][]
}