import createCollectorTitle from "@labstat/ui/title";
import { pieChart } from "@labstat/ui/canvas/charts/pie";
import { readableBytes } from "@labstat/util/units";

function initMemory() {
	const container = document.getElementById("collector-memory");
	if (!container) return;

	createCollectorTitle(container, "Memory");

	const canvas = pieChart({
		size: 280,
		value_formatter: readableBytes
	});

	if (!canvas) return;

	container.appendChild(canvas);
	canvas.id = "memory-canvas";
	canvas.classList.add("memory-canvas");
}

export default initMemory;
