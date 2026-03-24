import arc from "../../arc";
import loadFonts from "../../../fonts";
// TODO: implement other charts in OOP format

interface GaugeOptions {
	container?: HTMLElement;
	label?: string;
	length?: int;
	max?: int;
	min?: int;
}

class GaugeChart {
	#canvas: HTMLCanvasElement;
	#min: int;

	constructor(options: GaugeOptions) {
		this.#canvas = document.createElement("canvas");
		options.container?.appendChild(this.#canvas);

		if (options.length) this.setLength(options.length);

		this.#min = options.min ?? 0;

		void loadFonts().then(() => {
			this.setData(this.#min);
		});
	}

	setData(data: int) {
		const ctx = this.#canvas.getContext("2d");

		const mid = this.#canvas.width / 2;

		ctx.font = "700 10em Poppins";
		ctx.fillStyle = "#fff";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(data, mid, mid);

		ctx.strokeStyle = "#fff";
		arc({
			angle1: 4 * Math.PI / 5,
			angle2: Math.PI / 5,
			ctx,
			radius: mid - 10,
			rounding: 10,
			thickness: 10,
			x: mid,
			y: mid
		});

		/*
		 * ctx.beginPath();
		 * ctx.strokeStyle = "white";
		 * ctx.moveTo(100, 200);
		 * ctx.arc(mid, mid, mid - 10, 4 * Math.PI / 5, Math.PI / 5);
		 * ctx.stroke();
		 */
	}

	setLength(length: int) {
		this.#canvas.style.height = `${length}px`;
		this.#canvas.style.width = `${length}px`;
		this.#canvas.width = length * 2;
		this.#canvas.height = length * 2;
	}

	canvas() {
		return this.#canvas;
	}
}

export default GaugeChart;
