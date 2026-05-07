import { Cell, CellState, CellType, StepResult, Maze, PathfindingAlgorithm } from "./types";

export class BFS implements PathfindingAlgorithm {
	grid: Cell[][];
	queue: Cell[];

	constructor(grid: Cell[][], maze: Maze) {
		this.grid = grid
		this.queue = []
		this.queue.push(this.getCell(maze.start))

		console.log('Selected BFS')
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col]
	}

	addSurroundingCellsToQueue(currCell: Cell): Cell[] {
		const row: number = currCell.row;
		const col: number = currCell.col;
		const newlyQueued: Cell[] = [];

		if (this.grid[row + 1][col].type !== CellType.WALL && this.grid[row + 1][col].state === CellState.OPEN) {
			this.grid[row + 1][col].state = CellState.QUEUED;
			this.grid[row + 1][col].parent = currCell;
			this.queue.push(this.grid[row + 1][col]);
			newlyQueued.push(this.grid[row + 1][col]);
		}
		if (this.grid[row][col + 1].type !== CellType.WALL && this.grid[row][col + 1].state === CellState.OPEN) {
			this.grid[row][col + 1].state = CellState.QUEUED;
			this.grid[row][col + 1].parent = currCell;
			this.queue.push(this.grid[row][col + 1]);
			newlyQueued.push(this.grid[row][col + 1]);
		}
		if (this.grid[row - 1][col].type !== CellType.WALL && this.grid[row - 1][col].state === CellState.OPEN) {
			this.grid[row - 1][col].state = CellState.QUEUED;
			this.grid[row - 1][col].parent = currCell;
			this.queue.push(this.grid[row - 1][col]);
			newlyQueued.push(this.grid[row - 1][col]);
		}
		if (this.grid[row][col - 1].type !== CellType.WALL && this.grid[row][col - 1].state === CellState.OPEN) {
			this.grid[row][col - 1].state = CellState.QUEUED;
			this.grid[row][col - 1].parent = currCell;
			this.queue.push(this.grid[row][col - 1]);
			newlyQueued.push(this.grid[row][col - 1]);
		}
		return newlyQueued;
	}

	step(): StepResult | null {
		if (this.queue.length === 0)
			return null

		// Get first next tile to check
		const currCell: Cell = this.queue.shift()!

		// Mark current cell as VISITED
		currCell.state = CellState.VISITED

		// Add valid surrounding floor cells to queue and add to array for renderer to render them with a different border
		const queuedCells: Cell[] = this.addSurroundingCellsToQueue(currCell)

		// Get cell that is used next step, if queue is not empty
		let nextCell: Cell | null = null
		if (this.queue.length > 0 && currCell.type !== CellType.END)
			nextCell = this.queue[0];

		return {
			currCell,
			nextCell,
			queuedCells,
		}
	}

	reset(grid: Cell[][], maze: Maze) {
		this.grid = grid
		this.queue = []
		this.queue.push(this.getCell(maze.start))
	}
}


