import type { NodeData } from "@labstat/util/api";

interface GraphNode {
	description: string;
	intf: string;
	name: string;
	x: int;
	y: int;
}

interface GraphEdge {
	start: [int, int];
	end: [int, int];
}

class Graph {
	#canvas: HTMLElement;

	#nodes: Array<GraphNode> = [ ];
	#edges: Array<GraphEdge> = [ ];

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

	#screenXY(x: int, y: int) {
		const width = this.#scale * 300;
		const height = this.#scale * 90;

		return [this.#x + x * (width + 50) + 50, this.#y + y * (height + 150) + 50];
	}

	#redraw() {
		const ctx = this.#canvas.getContext("2d");
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		ctx.lineWidth = 5;

		const width = this.#scale * 300;
		const height = this.#scale * 90;

		this.#nodes.forEach(node => {
			const [ x, y ] = this.#screenXY(node.x, node.y);

			ctx.beginPath();
			ctx.roundRect(x, y, width, height, 15);

			ctx.fillStyle = "#3c384a";
			ctx.fill();

			ctx.fillStyle = "white";
			ctx.font = (40 * this.#scale) + "px 'Maple Mono'";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillText(node.name, x + width / 2, y + height / 2);
		});

		this.#edges.forEach(edge => {
			const start = this.#screenXY(...edge.start);
			const end = this.#screenXY(...edge.end);

			ctx.strokeStyle = "#3c384a";
			ctx.beginPath();
			ctx.moveTo(start[0] + width / 2, start[1] + height);
			ctx.lineTo(end[0] + width / 2, end[1]);
			ctx.stroke();
		});

		window.requestAnimationFrame(this.#redraw.bind(this));
	}

	data(data: Array<NodeData>, level: int = 0, parent?: GraphNode) {
		let max_x = 0;

		data.forEach(node => {
			const node_pos = {
				description: node.description,
				intf: node.intf,
				name: node.name,
				x: max_x,
				y: level
			} as GraphNode;

			this.#nodes.push(node_pos);

			if (parent) {
				const edge = {
					start: [parent.x, parent.y],
					end: [node_pos.x, node_pos.y]
				} as GraphEdge;

				this.#edges.push(edge);
			}

			const children_x = this.data(node.children, level + 1, node_pos);

			max_x += Math.max(1, children_x);
		});

		return max_x;
	}
}

export default Graph;
