import { readableHertz } from "@labstat/util/units";
import {
	scatterPlotUpdate
} from "@labstat/ui/canvas/charts/scatter";

function cpufreq(data: unknown) {
	const canvas = document.getElementById("cpufreq-canvas") as HTMLCanvasElement;

	scatterPlotUpdate(canvas, {
		values: data as number[],
		value_formatter: readableHertz,
		y_increment: 500000000,
		colors: ["#c0eed2", "#d96862"]
	});
}

export default cpufreq;
