import { Cell, CellState, CellType, StepResult, Maze, PathfindingAlgorithm } from "./types";

export class BFS implements PathfindingAlgorithm {
	grid: Cell[][];
	queue: Cell[];
	diagonal: boolean;

	constructor(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid
		this.queue = []
		this.queue.push(this.getCell(maze.start))
		this.diagonal = diagonal

		console.log('Selected BFS')
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col]
	}

	addNeighboursToQueue(currCell: Cell): Cell[] {
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

				this.queue.push(neighbour);
				newlyQueued.push(neighbour);
			}
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
		const queuedCells: Cell[] = this.addNeighboursToQueue(currCell)

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

	reset(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid
		this.queue = []
		this.queue.push(this.getCell(maze.start))
		this.diagonal = diagonal
	}
}


