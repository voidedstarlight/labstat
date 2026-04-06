import { createCanvas, type CanvasOptions } from "../../canvas";

type chart_type = "line" | "color";

interface Dataset {
	type: chart_type;
	min?: number;
	max?: number;
}

interface GraphInitOptions extends CanvasOptions {
	datasets: Array<Dataset>;
}

function graph(options: GraphInitOptions) {
	const canvas = createCanvas(options);
	canvas.dataset.format = JSON.stringify(options.datasets);

	return canvas;
}

function addGraphData(canvas: HTMLCanvasElement, data: number, dataset = 0) {
	// const ctx = canvas.getContext("2d");

	const datasets: Array<unknown> | false = (() => {
		try {
			return JSON.parse(canvas.dataset.format ?? "") as Array<unknown>;
		} catch {
			console.warn(
				"[charts/accumulation] failed to parse JSON chart format data. Chart "
				+ "may be missing some data."
			);

			return false;
		}
	})();

	if (!datasets) return;

	const format: unknown = datasets.at(dataset);
	if (!format) return;

	console.log(data); // [todo] finish function
}

export { addGraphData, graph };
