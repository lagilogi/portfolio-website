import { Cell, CellType, Maze, PathfindingAlgorithm } from "./types";

export class BFS implements PathfindingAlgorithm {
	grid: Cell[][];
	start: Cell;
	end: Cell;
	queue: Cell[];

	constructor(grid: Cell[][], maze: Maze) {
		this.grid = grid.map(row => [...row])
		this.start = this.getCell(maze.start)
		this.end = this.getCell(maze.end)
		this.queue = []
		this.queue.push(this.start)

		console.log('Selected BFS')
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col]
	}

	step(): Cell | null {

		// Get first next tile to check
		const currCell: Cell | undefined = this.queue.shift()
		if (currCell === undefined)
			return null

		// Mark current cell as 'visited = true'
		currCell.visited = true

		if (currCell.type === CellType.END) {
			return null
		}

		// Check surrounding tiles

		// Add valid tiles to queue


		return currCell
	}

	reset(grid: Cell[][], maze: Maze) {
		this.grid = grid.map(row => [...row])
		this.start = this.getCell(maze.start)
		this.end = this.getCell(maze.end)
		this.queue = []
		this.queue.push(this.start)
	}
}


