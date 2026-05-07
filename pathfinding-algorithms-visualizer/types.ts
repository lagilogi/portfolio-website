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
export enum CellState {
  OPEN,
  QUEUED,
  VISITED,
  NONE
}

export interface Cell {
  id: string
  row: number,
  col: number,
  type: CellType,
  state: CellState,
  parent: Cell | null,
  weight: number | null,
}

export interface StepResult {
  currCell: Cell,
  queuedCells: Cell[]
}

export interface PathfindingAlgorithm {
  grid: Cell[][]
  step(): StepResult | null,
  getCell(cellCoords: number[]): Cell,
  reset(grid: Cell[][], currMaze: Maze): void,
}

export interface Maze {
  name: string,
  start: number[],
  end: number[],
  maze: number[][]
}