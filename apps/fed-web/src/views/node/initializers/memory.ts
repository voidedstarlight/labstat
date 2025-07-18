import createCollectorTitle from "../../../components/title";
import { pieChart } from "../../../components/canvas/charts/pie/main";
import { readableBytes } from "../../../util/units";

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
