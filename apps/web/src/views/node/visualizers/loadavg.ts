import { addGraphData } from "@labstat/ui/canvas/charts/graph";

function updateHist(data: unknown) {
	const canvas = document.getElementById("cpuhist-canvas") as HTMLCanvasElement;
	addGraphData(canvas, data as number);
}

function loadavg(data: [number, number, number]) {
	const data_1m = document.getElementById("loadavg_1m");
	const data_5m = document.getElementById("loadavg_5m");
	const data_15m = document.getElementById("loadavg_15m");

	if (!data_1m || !data_5m || !data_15m) return;

	data_1m.innerText = String(data.at(0));
	data_5m.innerText = String(data.at(1));
	data_15m.innerText = String(data.at(2));

	updateHist(data.at(0));
}

export default loadavg;
