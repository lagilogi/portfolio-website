import { Cell, CellState, CellType, StepResult, Maze, PathfindingAlgorithm } from "./types";

// - DIAGONAL_CELL_DISTANCE is based on moving from 1 to another diagonally, then use Pythagoras' theorem
// to calculate the distance, which is ~1.4 * 10 = 14 for a nice integer value
// - CELL_DISTANCE Value is based on moving from 1 cell to another, either horizontally or vertically. We multiply
// that by 10 to keep the same value size as DIAGONAL_CELL_DISTANCE
const DIAGONAL_CELL_DISTANCE = 14; 
const CELL_DISTANCE = 10;

export class AStar implements PathfindingAlgorithm {
	grid: Cell[][];
	array: Cell[];
	nextCell: Cell;
	end: Cell;
	diagonal: boolean;
	steps: number;

	constructor(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid;
		this.array = [];
		this.nextCell = this.getCell(maze.start);
		this.end = this.getCell(maze.end);
		this.diagonal = diagonal;
		this.steps = 0

		console.log('Selected A*');
	}

	getCell(cellCoords: number[]): Cell {
		const row: number = cellCoords[0];
		const col: number = cellCoords[1];
		return this.grid[row][col];
	}

	// Calculate the start, end and total costs for a neighbouring cell. If diagonal is enabled, then diagonal cells will be checked as well
	// and given a different cell distance value, due to Pythagoras' theorem.
	calculateNewNeighbourCosts(currCell: Cell, neighbour: Cell, distance: number) {
		neighbour.startCost = currCell.startCost + distance;
		neighbour.endCost = (Math.abs(neighbour.row - this.end.row) + Math.abs(neighbour.col - this.end.col)) * 10;
		neighbour.totalCost = neighbour.startCost + neighbour.endCost
	}

	// This function adds all neighbouring cells that are not a wall and have CellState.OPEN to an array.
	// - If the neighbouring cell is already queued and its startCost is higher than it could be, coming from the currCell,
	// then that cell's startCost and parent gets updated.
	// - If the neighbouring cell is already visited, then we check if the current cell's startCost could be lower, and if yes,
	// we update currrent cell's startCost and parent.
	addNeighboursToArray(currCell: Cell): Cell[] {
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
			const row: number = currCell.row + rowOffset;
			const col: number = currCell.col + colOffset;
			const neighbour: Cell = this.grid[row][col];
			let distance: number = CELL_DISTANCE;

			if (this.diagonal)
				distance = (row === 0 || col === 0) ? CELL_DISTANCE : DIAGONAL_CELL_DISTANCE

			if (neighbour.type !== CellType.WALL) {
				if (neighbour.state === CellState.OPEN) {
					neighbour.state = CellState.QUEUED;
					neighbour.parent = currCell;
					this.calculateNewNeighbourCosts(currCell, neighbour, distance);
	
					this.array.push(neighbour);
					newlyQueued.push(neighbour);
				}
				else if (neighbour.state === CellState.QUEUED && neighbour.startCost > currCell.startCost + distance) {
					neighbour.startCost = currCell.startCost + distance;
					neighbour.parent = currCell;
					newlyQueued.push(neighbour);
				}
				else if (neighbour.state === CellState.VISITED && currCell.startCost > neighbour.startCost + distance) {
					currCell.startCost = neighbour.startCost + distance;
					currCell.parent = neighbour;
				}
			}
		}
		
		return newlyQueued;
	}

	// Find the cell with the lowest totalCost to queue as next cell to visit. If there are multiple cells with the same lowest
	// value, then we check what cell is closest to the end and queue that one as next cell to visit.
	findLowestCost(): Cell {
		let lowestCostIndex: number = 0;
		let nextCell: Cell[];

		for (let i = 0; i < this.array.length; i++) {
			if (this.array[i].totalCost < this.array[lowestCostIndex].totalCost)
				lowestCostIndex = i;
			else if (this.array[i].totalCost === this.array[lowestCostIndex].totalCost && this.array[i].endCost < this.array[lowestCostIndex].totalCost)
				lowestCostIndex = i;
		}
		nextCell = this.array.splice(lowestCostIndex, 1);
		return nextCell[0];
	}

	step(): StepResult | null {
		this.steps++;
		console.log(this.steps);

		// Get Cell with lowest totalCost
		const currCell: Cell = this.nextCell!;
		
		// Mark current cell as VISITED
		currCell.state = CellState.VISITED;

		// Add valid surrounding floor cells to array and add newly queued cells to array for renderer to render them with a different border
		const queuedCells: Cell[] = this.addNeighboursToArray(currCell);

		// Get cell that is used next step, if array is not empty
		let nextCell: Cell | null = null;
		if (this.array.length > 0 && currCell.type !== CellType.END) {
			nextCell = this.findLowestCost();
			this.nextCell = nextCell;
		}

		return {
			currCell,
			nextCell,
			queuedCells,
		}
	}

	reset(grid: Cell[][], maze: Maze, diagonal: boolean) {
		this.grid = grid;
		this.array = [];
		this.nextCell = this.getCell(maze.start);
		this.end = this.getCell(maze.end);
		this.diagonal = diagonal;
	}
}
