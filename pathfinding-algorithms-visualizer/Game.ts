import { Cell, CellType, gameState } from './types'
import maze from './mazes'

export class Game {
  selectedMaze: number[][];
  grid: Cell[][] | null;
  state: gameState;

  constructor() {
    this.selectedMaze = maze.tiny;
    this.grid = null;
    this.state = gameState.READY;
  }

  // Creates a double array containing an object per cell with information
  createGrid(maze: number[][]): Cell[][] {}

}
