

export class Renderer {
	gridDiv: HTMLElement;
	
	constructor() {
		this.gridDiv = document.getElementById('grid')!;
	}

	// This function only renders the full starting grid. It's being called on new map selection
	renderGrid() {}
	
	// This function renders a specific cell
	renderCell() {}


}
