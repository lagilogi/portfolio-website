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

	addNeighboursToStack(currCell: Cell): Cell[] {
		const newlyQueued: Cell[] = [];

		const directions = this.diagonal
			? [
				[1, -1],
				[0, -1],
				[-1, -1],
				[-1, 0],
				[-1, 1],
				[0, 1],
				[1, 1],
				[1, 0]
			]
			: [
				[0, -1],
				[-1, 0],
				[0, 1],
				[1, 0]
			]
		
		for (const [rowOffset, colOffset] of directions) {
			const row = currCell.row + rowOffset;
			const col = currCell.col + colOffset;
			const neighbour = this.grid[row][col];

			if (neighbour.type !== CellType.WALL && neighbour.state === CellState.OPEN) {
				neighbour.state = CellState.QUEUED;
				neighbour.parent = currCell;

				this.stack.push(neighbour);
				newlyQueued.push(neighbour);
			}
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
		const queuedCells: Cell[] = this.addNeighboursToStack(currCell)

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


