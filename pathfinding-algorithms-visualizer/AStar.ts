import { Cell, CellState, CellType, StepResult, Maze, PathfindingAlgorithm } from "./types";

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

	// Calculate the start, end and total costs for a neighbouring cell
	calculateNewNeighbourCosts(currCell: Cell, neighbour: Cell) {
		// Calculate the cost from the start cell to current cell. This value can change if there is a shorter way
		neighbour.startCost = currCell.startCost + 10;

		// Calculate the distance of neighbour cell to end cell according to Manhatten distance formula. This value will not change after being set the first time.
		neighbour.endCost = (Math.abs(neighbour.row - this.end.row) + Math.abs(neighbour.col - this.end.col)) * 10;

		// Calculate total cost from start to neighbour cell, and from neighbour cell to end.
		neighbour.totalCost = neighbour.startCost + neighbour.endCost
	}

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
			const row = currCell.row + rowOffset;
			const col = currCell.col + colOffset;
			const neighbour = this.grid[row][col];

			if (neighbour.type !== CellType.WALL) {
				if (neighbour.state === CellState.OPEN) {
					neighbour.state = CellState.QUEUED;
					neighbour.parent = currCell;
					this.calculateNewNeighbourCosts(currCell, neighbour);
	
					this.array.push(neighbour);
					newlyQueued.push(neighbour);
				}
				else if (neighbour.state === CellState.QUEUED && neighbour.startCost > currCell.startCost + CELL_DISTANCE) {
					neighbour.startCost = currCell.startCost + CELL_DISTANCE;
					neighbour.parent = currCell;
					newlyQueued.push(neighbour);
				}
				else if (neighbour.state === CellState.VISITED && currCell.startCost > neighbour.startCost + CELL_DISTANCE) {
						currCell.startCost = neighbour.startCost + CELL_DISTANCE;
						currCell.parent = neighbour;
				}
			}
		}
		
		return newlyQueued;
	}

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
