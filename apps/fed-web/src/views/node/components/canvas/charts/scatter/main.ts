import attachListeners from "./label";
import createCanvas, { type CanvasOptions } from "../../main";
import drawPoints from "./point";
import drawStats from "./stats";
import { drawYAxis } from "./axes";

type value_formatter = (value: number, precision?: number) => string;

interface ScatterUpdateOptions {
	colors?: [string, string];
	values: number[];
	value_formatter?: value_formatter;
	y_increment: number;
}

interface PointData {
	index: number;
	value: number | string;
	x: number;
}

function initCanvas(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = "white";
	ctx.font = "20px sans-serif";
	ctx.lineWidth = 3;
	ctx.strokeStyle = "white";
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
}

function scatterPlot(options: CanvasOptions): HTMLCanvasElement {
	const canvas = createCanvas(options);
	attachListeners(canvas);

	return canvas;
}

function scatterPlotUpdate(
	canvas: HTMLCanvasElement,
	options: ScatterUpdateOptions
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const width = options.values.length * 30 + 150;
	if (canvas.width !== width) {
		canvas.width = width;
		canvas.style.width = (width / 2).toString() + "px";
		initCanvas(ctx);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let min = Math.min(...options.values);
	let max = Math.max(...options.values);

	const old_min = parseFloat(canvas.dataset.min ?? "Infinity");
	const old_max = parseFloat(canvas.dataset.max ?? "-Infinity");

	if (min < old_min) {
		canvas.dataset.min = min.toString();
	} else {
		min = old_min;
	}

	if (max > old_max) {
		canvas.dataset.max = max.toString();
	} else {
		max = old_max;
	}

	drawYAxis(ctx, min, max, options);
	drawStats(ctx, options.values, options.value_formatter);

	const columns = drawPoints(
		ctx, 150, min, max, options.values, options.colors
	);

	const points: PointData[] = [];

	columns.forEach((column, index) => {
		const value = options.values.at(index);
		points.push({
			index,
			value: (
				options.value_formatter
					? options.value_formatter(value ?? 0)
					: value ?? 0
			),
			x: column
		});
	});

	canvas.dataset.points = JSON.stringify(points);
}

export { scatterPlot, scatterPlotUpdate };
export type { PointData, ScatterUpdateOptions, value_formatter };
