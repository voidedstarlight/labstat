import { pieChartUpdate } from "@labstat/ui/canvas/charts/pie";
import { readableBytes } from "@labstat/util/units";

const COLORS = {
	"Free": "#5aba80",
	"Used - Active": "#333",
	"Used - Buffers": "#303e36",
	"Used - Cache": "#3d5145"
};

function memory(data: Record<string, number>) {
	const canvas = document.getElementById("memory-canvas") as HTMLCanvasElement;
	const total = readableBytes(data.total, 1);

	pieChartUpdate(canvas, {
		colors: COLORS,
		total,
		values: {
			"Free": data.free,
			"Used - Buffers": data.buffers,
			"Used - Cache": data.cache,
			"Used - Active": data.active
		}
	});
}

export default memory;
