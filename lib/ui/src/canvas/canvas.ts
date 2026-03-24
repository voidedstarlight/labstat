interface CanvasOptions {
	size: number;
}

function createCanvas(options: CanvasOptions): HTMLCanvasElement {
	const canvas = document.createElement("canvas");

	canvas.style.width = options.size.toString() + "px";
	canvas.style.height = options.size.toString() + "px";
	canvas.width = options.size * 2;
	canvas.height = options.size * 2;

	return canvas;
}

function resizeCanvas(canvas: HTMLElement) {
	canvas.height = window.innerHeight * 2;
	canvas.width = window.innerWidth * 2;

	canvas.style.height = window.innerHeight + "px";
	canvas.style.width = window.innerWidth + "px";
}

export * as graph from "./charts/graph/main";
export * as pie from "./charts/pie/main";
export * as scatter from "./charts/scatter/main";

export * from "./charts/label";

export { createCanvas, resizeCanvas, type CanvasOptions };
