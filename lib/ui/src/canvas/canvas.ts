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

export * as graph from "./charts/graph/main";
export * as pie from "./charts/pie/main";
export * as scatter from "./charts/scatter/main";

export * from "./charts/label";

export { createCanvas, type CanvasOptions };
