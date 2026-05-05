import { Cell, CellState, CellType, Maze, PathfindingAlgorithm } from "./types";

export class DFS implements PathfindingAlgorithm {
	grid: Cell[][];
	stack: Cell[];

	constructor(grid: Cell[][], maze: Maze) {
		this.grid = grid
		this.stack = []
		this.stack.push(this.getCell(maze.start))

		console.log('Selected DFS')
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col]
	}

	addSurroundingCellsToStack(currCell: Cell) {
		const row: number = currCell.row;
		const col: number = currCell.col;

		if (this.grid[row + 1][col].type !== CellType.WALL && this.grid[row + 1][col].state === CellState.OPEN) {
			this.grid[row + 1][col].state = CellState.QUEUED;
			this.grid[row + 1][col].parent = currCell;
			this.stack.push(this.grid[row + 1][col]);
		}
		if (this.grid[row][col + 1].type !== CellType.WALL && this.grid[row][col + 1].state === CellState.OPEN) {
			this.grid[row][col + 1].state = CellState.QUEUED;
			this.grid[row][col + 1].parent = currCell;
			this.stack.push(this.grid[row][col + 1])
		}
		if (this.grid[row - 1][col].type !== CellType.WALL && this.grid[row - 1][col].state === CellState.OPEN) {
			this.grid[row - 1][col].state = CellState.QUEUED;
			this.grid[row - 1][col].parent = currCell;
			this.stack.push(this.grid[row - 1][col])
		}
		if (this.grid[row][col - 1].type !== CellType.WALL && this.grid[row][col - 1].state === CellState.OPEN) {
			this.grid[row][col - 1].state = CellState.QUEUED;
			this.grid[row][col - 1].parent = currCell;
			this.stack.push(this.grid[row][col - 1])
		}
	}

	step(): Cell | null {

		// Get first next tile to check
		const currCell: Cell | undefined = this.stack.pop()
		if (currCell === undefined)
			return null

		// Mark current cell as VISITED
		currCell.state = CellState.VISITED

		// Add valid surrounding cells to stack
		this.addSurroundingCellsToStack(currCell)

		return currCell
	}

	reset(grid: Cell[][], maze: Maze) {
		this.grid = grid
		this.stack = []
		this.stack.push(this.getCell(maze.start))
	}
}


