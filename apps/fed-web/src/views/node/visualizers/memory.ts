import { pieChartUpdate } from "../components/canvas/main";
import { readableBytes } from "../../../util/units";

const COLORS = {
	"Free": "#5aba80",
	"Used - Active": "#333",
	"Used - Buffers": "#303e36",
	"Used - Cache": "#3d5145"
};

function memory(data: Record<string, number>) {
	const canvas = document.getElementById("memory-canvas") as HTMLCanvasElement;
	const total = readableBytes(data.total ?? 0, 1);

	pieChartUpdate(canvas, {
		colors: COLORS,
		total,
		values: {
			"Free": data.free ?? 0,
			"Used - Buffers": data.buffers ?? 0,
			"Used - Cache": data.cache ?? 0,
			"Used - Active": data.active ?? 0
		}
	});
}

export default memory;
