import createCollectorTitle from "../components/title";
import { graph } from "../components/canvas/charts/graph/main";

function initCpuhist() {
	const container = document.getElementById("collector-*cpuhist");
	if (!container) return;

	createCollectorTitle(container, "CPU History");
	
	const canvas = graph({
		size: 280,
		datasets: [
			{
				type: "line",
			}
		]
	});

	container.appendChild(canvas);
	canvas.id = "cpuhist-canvas";
}

export default initCpuhist;
