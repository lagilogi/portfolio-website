import { Cell, CellType, GameState, PathfindingAlgorithm, Maze } from './types'
import mazes from './mazes'
import { Renderer } from './Renderer';
import { BFS } from './bfs';

export class Game {
  startButton: HTMLElement;
  resetButton: HTMLElement;
  mazeSelect: HTMLElement;
  algorithmSelect: HTMLElement;
  speedSlider: HTMLElement;

  algorithm: PathfindingAlgorithm;
  renderer: Renderer;
  state: GameState;
  stepTime: number;
  timePassed: number;

  currMaze: Maze;
  grid!: Cell[][];
  path: Cell[];

  constructor() {
    this.startButton = document.getElementById('startButton')!
    this.resetButton = document.getElementById('resetButton')!
    this.mazeSelect = document.getElementById('mazeSelect')!
    this.algorithmSelect = document.getElementById('algorithmSelect')!
    this.speedSlider = document.getElementById('speedSlider')!


    this.renderer = new Renderer();
    this.state = GameState.READY;
    this.stepTime = 1000000; // 1s
    this.timePassed = 0;
    this.path = []

    this.currMaze = mazes[0]
    this.createGrid(this.currMaze.maze)
    this.algorithm = new BFS(this.grid, this.currMaze);

    this.bindEvents()
  }

  bindEvents() {
    this.startButton.addEventListener("click", this.handleStartButton);
    this.resetButton.addEventListener("click", this.handleResetButton);
    this.mazeSelect.addEventListener("change", this.handleMazeChange);
    this.algorithmSelect.addEventListener("change", this.handleAlgorithmChange);
    // this.speedSlider.addEventListener("change", this.handleSpeedSliderChange);
  }


  // ---- EVENT HANDLERS ----
  // Starts or pauses the visualizer loop
  handleStartButton = () => {
    if (this.algorithm === null)
      return
    if (this.state === GameState.FINISHED) {
      this.state = GameState.RESETTING
      this.reset()
    }
    if (this.state === GameState.READY) {
      this.state = GameState.RUNNING
      // this.loop(0)
    }
    else if (this.state === GameState.PAUSED)
      this.state = GameState.RUNNING
    else if (this.state === GameState.RUNNING)
      this.state = GameState.PAUSED
  }

  // Resets the game when the reset button is clicked
  handleResetButton = () => {
    this.state = GameState.RESETTING
    this.reset()
  }

  // This function gets called when another maze is selected from the dropdown menu
  handleMazeChange = (event: Event) => {
    this.state = GameState.RESETTING

    const select = event.target as HTMLSelectElement
    const mazeName: string = select.value
    let index: number

    for (index = 0; index < mazes.length; index++) {
      if (mazes[index].name === mazeName)
        break;
    }
    this.currMaze = index < mazes.length ? mazes[index] : mazes[3]
    this.createGrid(this.currMaze.maze)
    this.reset()
  }

  handleAlgorithmChange = (event: Event) => {
    this.state = GameState.RESETTING

    const select = event.target as HTMLSelectElement
    const algorithmName: string = select.value

    switch (algorithmName) {
      case 'BFS':
        this.algorithm = new BFS(this.grid, this.currMaze)
        break;
    
      default:
        this.algorithm = new BFS(this.grid, this.currMaze)
        break;
    }

    this.reset()
  }

  reset() {
    this.timePassed = 0
    this.path = []
    this.algorithm.reset(this.grid, this.currMaze)
    this.renderer.renderGrid(this.grid)
    this.state = GameState.READY
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
      id: `${row}-${col}`,
      row: row,
      col: col,
      type: type,
      visited: false,
      parent: null,
      weight: null
    }
  }

  // Retrieves the path, backwards, from end to finish, by getting the parent of the cells. The parents of cells are determined by the algorithm
  getPath(endCell: Cell) {
    let currCell: Cell = endCell.parent!

    while (currCell.type !== CellType.START) {
      this.path.push(currCell)
      currCell = currCell.parent!
    }
  }

  loop(interval: number) {
    this.timePassed += interval
    if (this.state === GameState.RUNNING) {
      if (this.timePassed > this.stepTime) {
        this.timePassed = 0
        const result: Cell | null = this.algorithm.step();
  
        if (result === null)
          return
        else if (result.type === CellType.END) {
          this.getPath(result)
          this.renderer.renderPath(this.path)
          this.state = GameState.FINISHED
        }
        else
          this.renderer.renderVisitedCell(result)
      }
    }
    if (this.state !== GameState.RUNNING && this.state !== GameState.PAUSED)
      return

    requestAnimationFrame(this.loop)
  }


}
