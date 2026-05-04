import { Cell, CellType } from "./types";

export class Renderer {
	gridDiv: HTMLElement;
  sqrSize: number;

	constructor() {
		this.gridDiv = document.getElementById('grid')!;
    this.sqrSize = 30;
	}

	// This function only renders the full starting grid. It's being called on page load and new map selection
	renderGrid(grid: Cell[][]) {
    const rows: number = grid.length
    const cols: number = grid[0].length
    this.gridDiv.innerHTML = ``

    for (let row = 0; row < rows; row++) {
      const newRowDiv = document.createElement('div')
      newRowDiv.style.display = 'flex'
      for (let col = 0; col < cols; col++) {
        const newCellDiv: HTMLElement = this.createCellDiv(grid[row][col])
        newRowDiv.appendChild(newCellDiv)
      }

      this.gridDiv.appendChild(newRowDiv)
    }
  }

	// This function renders a specific cell
	createCellDiv(cell: Cell): HTMLElement {
		const newCellDiv = document.createElement('div')
		newCellDiv.style = `
			width: ${this.sqrSize}px;
			height: ${this.sqrSize}px;
			border: 1px solid var(--border);
			font-size: 12px;
			color: var(--bg-dark);
			text-align: center;
			vertical-align: middle;
			line-height: ${this.sqrSize / 2}`
		newCellDiv.setAttribute('id', cell.id)

    switch (cell.type) {
      case CellType.FLOOR:
        newCellDiv.style.background = 'var(--bg-light)'
        break;
      case CellType.WALL:
        newCellDiv.style.background = 'var(--bg-dark)'
        break;
      case CellType.START:
        newCellDiv.style.background = 'lightblue'
        newCellDiv.innerText = 'S'
        break;
      case CellType.END:
        newCellDiv.style.background = 'lightgreen'
        newCellDiv.innerText = 'E'
        break;
    }
    return newCellDiv
	}

	renderVisitedCell(cell: Cell) {
		const cellDiv: HTMLElement = document.getElementById(cell.id)!
		cellDiv.style.background = 'yellowgreen'
	}
	
	renderPath(pathArray: Cell[]) {
		let currCell: Cell
		let cellDiv: HTMLElement

		while (pathArray.length > 0) {
			currCell = pathArray.pop()!
			cellDiv = document.getElementById(currCell.id)!
			cellDiv.style.background = 'var(--accent)'
		}
	}

}
