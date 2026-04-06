import type { NodeData } from "@labstat/util/api";
import { onResize } from "../../event";
import { resizeCanvas } from "@labstat/ui/canvas";

interface GraphNode {
	description: string;
	intf: string;
	ip: string;
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

	#nodes: Array<GraphNode> = [];
	#edges: Array<GraphEdge> = [];

	#click_x = 0;
	#click_y = 0;
	#previous_x = 0;
	#previous_y = 0;
	#x = 50;
	#y = 50;
	#dragging = false;

	#scale = 1;

	constructor(container: HTMLElement) {
		this.#canvas = document.createElement("canvas");
		container.appendChild(this.#canvas);

		resizeCanvas(this.#canvas);
		onResize(() => resizeCanvas(this.#canvas));
		window.requestAnimationFrame(this.#redraw.bind(this));

		this.#registerEvents();
	}

	data(data: Array<NodeData>, level: int = 0, parent?: GraphNode) {
		let max_x = 0;

		data.forEach(node => {
			const node_pos = {
				capabilities: node.capabilities,
				description: node.description,
				intf: node.intf,
				ip: node.ip,
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
			this.#scale -= (event.deltaX + event.deltaY) / 1200;
		});
	}

	#screenXY(x: int, y: int) {
		const width = this.#scale * 500;
		const height = this.#scale * 180;

		return [
			this.#x + x * (width + this.#s(50)) + 50,
			this.#y + y * (height + this.#s(150)) + 50
		];
	}

	#s(size: int) {
		return size * this.#scale;
	}

	#gridX(ctx: CanvasRenderingContext2D, x: int, m: int) {
		if (x >= this.#canvas.width) return;

		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, this.#canvas.height);
		ctx.stroke();

		this.#gridX(ctx, x + m, m);
	}

	#gridY(ctx: CanvasRenderingContext2D, y: int, m: int) {
		if (y >= this.#canvas.height) return;

		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(this.#canvas.width, y);
		ctx.stroke();

		this.#gridY(ctx, y + m, m);
	}

	#redraw() {
		const ctx = this.#canvas.getContext("2d");
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
		ctx.lineWidth = this.#s(3);
		ctx.strokeStyle = "#130e25";

		const m = this.#s(30);

		this.#gridX(ctx, (Math.floor(-this.#x / m) + 1) * m + this.#x, m);
		this.#gridY(ctx, (Math.floor(-this.#y / m) + 1) * m + this.#y, m);

		ctx.lineWidth = this.#s(6);

		const width = this.#s(500);
		const height = this.#s(180);

		const margin_x = this.#s(36);
		const margin_y = this.#s(45);

		this.#nodes.forEach(node => {
			const [x, y] = this.#screenXY(node.x, node.y);

			ctx.beginPath();
			ctx.roundRect(x, y, width, height, this.#s(32));

			ctx.fillStyle = "#282438";
			ctx.fill();

			const details_x = x + margin_x;
			const capability_size = this.#s(35);

			node.capabilities.split("").forEach(capability => {
				ctx.beginPath();
				ctx.fillStyle = "#fff2";

				ctx.roundRect(
					details_x, y + height - margin_y - this.#s(30),
					capability_size, capability_size, this.#s(10)
				);

				ctx.fill();

				ctx.font = `400 ${this.#s(22)}px Poppins`;
				ctx.textBaseline = "middle";
				ctx.textAlign = "center";
				ctx.fillStyle = "white";

				ctx.fillText(
					capability, details_x + capability_size / 2,
					y + height - margin_y - this.#s(28) + capability_size / 2
				);

				details_x += capability_size + this.#s(10);
			});

			if (node.capabilities.length) details_x += this.#s(10);

			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.font = `800 ${this.#s(48)}px Poppins`;
			ctx.textBaseline = "hanging";
			ctx.fillText(node.name.toUpperCase(), x + margin_x, y + margin_y);

			ctx.font = `${this.#s(34)}px 'Maple Mono'`;
			ctx.textBaseline = "alphabetic";
			ctx.fillText(node.ip, details_x, y + height - margin_y);

			const ip_length = ctx.measureText(node.ip).width;

			ctx.fillStyle = "#BBB";

			ctx.fillText(
				node.intf, details_x + ip_length + this.#s(20),
				y + height - margin_y
			);
		});

		this.#edges.forEach(edge => {
			const start = this.#screenXY(...edge.start);
			const end = this.#screenXY(...edge.end);

			ctx.strokeStyle = "#282438";
			ctx.beginPath();
			ctx.moveTo(start[0] + width / 2, start[1] + height);
			ctx.lineTo(end[0] + width / 2, end[1]);
			ctx.stroke();
		});

		window.requestAnimationFrame(this.#redraw.bind(this));
	}
}

export default Graph;
