import { Cell, CellType, gameState } from './types'
import mazes from './mazes'
import { Renderer } from './Renderer';

export class Game {
  renderer: Renderer;
  mazeSelect: HTMLElement
  state: gameState;

  grid!: Cell[][];

  constructor() {
    this.renderer = new Renderer();
    this.mazeSelect = document.getElementById('mazeSelect')!
    this.state = gameState.READY;

    this.createGrid(mazes[0].maze)
    this.bindEvents()
  }



  bindEvents() {
    this.mazeSelect.addEventListener("change", this.handleMazeChange);
  }


  getMazeIndex(mazeName: string): number {
    for (let i = 0; i < mazes.length; i++) {
      if (mazes[i].name === mazeName)
        return i
    }
    return 0
  }

  handleMazeChange = (event: Event) => {
    const select = event.target as HTMLSelectElement

    this.createGrid(mazes[this.getMazeIndex(select.value)].maze)
  }



  // Creates a double array containing an object per cell with information
  createGrid(maze: number[][]) {
    console.log(maze)
    const rows: number = maze.length
    const cols: number = maze[0].length
    const newGrid: Cell[][] = []

    for (let row = 0; row < rows; row++) {
      const newRow: Cell[] = []
      for (let col = 0; col < cols; col++) {
        newRow.push(this.createCell(row, col, maze[row][col]))
      }
      newGrid.push(newRow)
    }
    this.renderer.renderGrid(newGrid);
    this.grid = newGrid
  }

  // Creates individual cells to be added to the grid double array
  createCell(row: number, col: number, type: number): Cell {
    let cellType: CellType
    switch (type) {
      case CellType.FLOOR:
        cellType = CellType.FLOOR
        break;
      case CellType.WALL:
        cellType = CellType.FLOOR
        break;
      case CellType.START:
        cellType = CellType.FLOOR
        break;
      case CellType.END:
        cellType = CellType.FLOOR
        break;
    }

    return {
      row,
      col,
      type: type,
      visited: false,
      parent: null,
      weight: null
    }
  }

  bfs() {
    
  }


}
