import createCanvas, { CanvasOptions } from "../../main";

type chart_type = "line" | "color";

interface Dataset {
	type: chart_type;
	min?: number;
	max?: number;
}

interface GraphInitOptions extends CanvasOptions {
	datasets: Dataset[];
}

function graph(options: GraphInitOptions) {
	const canvas = createCanvas(options);
	canvas.dataset.format = JSON.stringify(options.datasets);
	
	return canvas;
}

function addGraphData(canvas: HTMLCanvasElement, data: number, dataset = 0) {
	const ctx = canvas.getContext("2d");

	const datasets = (() => {
		try {
			return JSON.parse(canvas.dataset.format);
		} catch {
			console.warn(
				"[charts/accumulation] failed to parse JSON chart format data. Chart "
				+ "may be missing some data."
			);
		}
	})();

	if (!datasets) return;

	const format = datasets.at(dataset);
	if (!format) return;

	console.log(data);
}

export { addGraphData, graph };
