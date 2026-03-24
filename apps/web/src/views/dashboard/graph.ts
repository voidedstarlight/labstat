interface NodeData {
	name: string;
	description: string;
}

class Graph {
	#canvas: HTMLElement;
	#nodes: Array<NodeData> = [ ];

	#click_x = 0;
	#click_y = 0;
	#previous_x = 0;
	#previous_y = 0;
	#x = 0;
	#y = 0;
	#dragging = false;

	#scale = 1;

	constructor(container: HTMLElement) {
		this.#canvas = document.createElement("canvas");
		container.appendChild(this.#canvas);

		this.#updateSize();
		window.addEventListener("resize", this.#updateSize.bind(this));
		window.requestAnimationFrame(this.#redraw.bind(this));

		this.#registerEvents();
	}

	#registerEvents() {
		this.#canvas.addEventListener("mousedown", event => {
			if (event.button === 2) return;

			this.#click_x = event.clientX;
			this.#click_y = event.clientY;

			this.#previous_x = this.#x;
			this.#previous_y = this.#y;

			this.#dragging = true;
		});

		this.#canvas.addEventListener("mouseup", () => {
			this.#dragging = false;
		});

		this.#canvas.addEventListener("mousemove", event => {
			if (!this.#dragging) return;

			this.#x = this.#previous_x + (event.clientX - this.#click_x) * 2;
			this.#y = this.#previous_y + (event.clientY - this.#click_y) * 2;
		});

		this.#canvas.addEventListener("wheel", event => {
			this.#scale += (event.deltaX + event.deltaY) / 1200;
		});
	}

	#updateSize() {
		this.#canvas.height = window.innerHeight * 2;
		this.#canvas.width = window.innerWidth * 2;

		this.#canvas.style.height = window.innerHeight + "px";
		this.#canvas.style.width = window.innerWidth + "px";
	}

	#redraw() {
		const ctx = this.#canvas.getContext("2d");
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		ctx.lineWidth = 2;

		this.#nodes.forEach(node => {
			ctx.beginPath();
			ctx.roundRect(10 + this.#x, 10 + this.#y, 300 * this.#scale, 90 * this.#scale, 15);

			ctx.fillStyle = "#3c384a";
			ctx.fill();

			ctx.fillStyle = "white";
			ctx.font = (42 * this.#scale) + "px 'Maple Mono'";
			ctx.textBaseline = "middle";
			ctx.fillText(node.name, 25 + this.#x, 55 + this.#y);
		});

		window.requestAnimationFrame(this.#redraw.bind(this));
	}

	add(data: NodeData) {
		this.#nodes.push(data);
	}
}

export default Graph;
