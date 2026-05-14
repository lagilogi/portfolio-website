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
  startCost: number,
  endCost: number,
  totalCost: number,
}

export interface StepResult {
  currCell: Cell,
  nextCell: Cell | null
  queuedCells: Cell[],
}

export enum ShowCellData {
  COST,
  NONE,
}

export interface PathfindingAlgorithm {
  grid: Cell[][]
  step(): StepResult | null,
  getCell(cellCoords: number[]): Cell,
  reset(grid: Cell[][], currMaze: Maze, diagonal: boolean): void,
}

export interface Maze {
  name: string,
  start: number[],
  end: number[],
  maze: number[][]
}