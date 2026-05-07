import { Cell, CellState, CellType, StepResult, Maze, PathfindingAlgorithm } from "./types";

export class DFS implements PathfindingAlgorithm {
	grid: Cell[][];
	stack: Cell[];
	diagonal: boolean;

	constructor(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid
		this.stack = []
		this.stack.push(this.getCell(maze.start))
		this.diagonal = diagonal

		console.log('Selected DFS')
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col]
	}

	addSurroundingCellsToStack(currCell: Cell): Cell[] {
		const row: number = currCell.row;
		const col: number = currCell.col;
		const newlyQueued: Cell[] = [];

		if (this.diagonal === true && this.grid[row + 1][col - 1].type !== CellType.WALL && this.grid[row + 1][col - 1].state === CellState.OPEN) {
			this.grid[row + 1][col - 1].state = CellState.QUEUED;
			this.grid[row + 1][col - 1].parent = currCell;
			this.stack.push(this.grid[row + 1][col - 1])
			newlyQueued.push(this.grid[row + 1][col - 1]);
		}
		if (this.grid[row][col - 1].type !== CellType.WALL && this.grid[row][col - 1].state === CellState.OPEN) {
			this.grid[row][col - 1].state = CellState.QUEUED;
			this.grid[row][col - 1].parent = currCell;
			this.stack.push(this.grid[row][col - 1])
			newlyQueued.push(this.grid[row][col - 1]);
		}
		if (this.diagonal === true && this.grid[row - 1][col - 1].type !== CellType.WALL && this.grid[row - 1][col - 1].state === CellState.OPEN) {
			this.grid[row - 1][col - 1].state = CellState.QUEUED;
			this.grid[row - 1][col - 1].parent = currCell;
			this.stack.push(this.grid[row - 1][col - 1])
			newlyQueued.push(this.grid[row - 1][col - 1]);
		}
		if (this.grid[row - 1][col].type !== CellType.WALL && this.grid[row - 1][col].state === CellState.OPEN) {
			this.grid[row - 1][col].state = CellState.QUEUED;
			this.grid[row - 1][col].parent = currCell;
			this.stack.push(this.grid[row - 1][col])
			newlyQueued.push(this.grid[row - 1][col]);
		}
		if (this.diagonal === true && this.grid[row - 1][col + 1].type !== CellType.WALL && this.grid[row - 1][col + 1].state === CellState.OPEN) {
			this.grid[row - 1][col + 1].state = CellState.QUEUED;
			this.grid[row - 1][col + 1].parent = currCell;
			this.stack.push(this.grid[row - 1][col + 1])
			newlyQueued.push(this.grid[row - 1][col + 1]);
		}
		if (this.grid[row][col + 1].type !== CellType.WALL && this.grid[row][col + 1].state === CellState.OPEN) {
			this.grid[row][col + 1].state = CellState.QUEUED;
			this.grid[row][col + 1].parent = currCell;
			this.stack.push(this.grid[row][col + 1])
			newlyQueued.push(this.grid[row][col + 1]);
		}
		if (this.diagonal === true && this.grid[row + 1][col + 1].type !== CellType.WALL && this.grid[row + 1][col + 1].state === CellState.OPEN) {
			this.grid[row + 1][col + 1].state = CellState.QUEUED;
			this.grid[row + 1][col + 1].parent = currCell;
			this.stack.push(this.grid[row + 1][col + 1]);
			newlyQueued.push(this.grid[row + 1][col + 1]);
		}
		if (this.grid[row + 1][col].type !== CellType.WALL && this.grid[row + 1][col].state === CellState.OPEN) {
			this.grid[row + 1][col].state = CellState.QUEUED;
			this.grid[row + 1][col].parent = currCell;
			this.stack.push(this.grid[row + 1][col]);
			newlyQueued.push(this.grid[row + 1][col]);
		}
		return newlyQueued;
	}

	step(): StepResult | null {

		// Get first next tile to check
		const currCell: Cell | undefined = this.stack.pop()
		if (currCell === undefined)
			return null

		// Mark current cell as VISITED
		currCell.state = CellState.VISITED

		// Add valid surrounding cells to stack
		const queuedCells: Cell[] = this.addSurroundingCellsToStack(currCell)

		// Get cell that is used next step, if queue is not empty
		let nextCell: Cell | null = null
		if (this.stack.length > 0 && currCell.type !== CellType.END)
			nextCell = this.stack[this.stack.length - 1];

		return {
			currCell,
			nextCell,
			queuedCells,
		}
	}

	reset(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid
		this.stack = []
		this.stack.push(this.getCell(maze.start))
		this.diagonal = diagonal
	}
}


