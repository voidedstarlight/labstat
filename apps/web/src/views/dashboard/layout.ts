import { getNodes, type NodeOptions } from "../../api";

function displayNode(ip: string, data: NodeOptions, list: HTMLElement) {
	const container = document.createElement("node");
	list.appendChild(container);
	container.classList.add("flex-col");

	container.addEventListener("click", () => {
		document.location.hash = ip;
	});

	const row_1 = document.createElement("div");
	container.appendChild(row_1);
	row_1.classList.add("flex-row");

	const title_col = document.createElement("div");
	row_1.appendChild(title_col);
	title_col.classList.add("flex-col");

	const node_name = document.createElement("subtitle");
	title_col.appendChild(node_name);
	node_name.innerText = data.name;

	const node_ip = document.createElement("h1");
	title_col.appendChild(node_ip);
	node_ip.innerText = ip;
	node_ip.classList.add("display-em", "tmargin-0");

	const info_1 = document.createElement("p");
	row_1.appendChild(info_1);
	info_1.classList.add("monospace");
	info_1.innerText = "text\ntext";

	const info_2 = document.createElement("p");
	row_1.appendChild(info_2);
	info_2.classList.add("monospace");
	info_2.innerText = "text\ntext";

	const row_2 = document.createElement("div");
	container.appendChild(row_2);
	row_2.classList.add("flex-row", "flex-fill");

	const cpu_data = document.createElement("p");
	row_2.appendChild(cpu_data);
	cpu_data.classList.add("display");

	const cpu_data_span = document.createElement("span");
	cpu_data.appendChild(cpu_data_span);
	cpu_data_span.innerText = "5.6%";

	const cpu_label = document.createTextNode("CPU");
	cpu_data.appendChild(cpu_label);

	const mem_data = document.createElement("p");
	row_2.appendChild(mem_data);
	mem_data.classList.add("display");

	const mem_data_span = document.createElement("span");
	mem_data.appendChild(mem_data_span);
	mem_data_span.innerText = "55%";

	const mem_label = document.createTextNode("MEM");
	mem_data.appendChild(mem_label);

	const swap_data = document.createElement("p");
	row_2.appendChild(swap_data);
	swap_data.classList.add("display");

	const swap_data_span = document.createElement("span");
	swap_data.appendChild(swap_data_span);
	swap_data_span.innerText = "2%";

	const swap_label = document.createTextNode("SWAP");
	swap_data.appendChild(swap_label);

	const disk_data = document.createElement("p");
	row_2.appendChild(disk_data);
	disk_data.classList.add("display");

	const disk_data_span = document.createElement("span");
	disk_data.appendChild(disk_data_span);
	disk_data_span.innerText = "22%";

	const disk_label = document.createTextNode("DISK");
	disk_data.appendChild(disk_label);
}

async function populateNodes(list: HTMLElement) {
	const nodes = await getNodes();

	Object.keys(nodes).forEach(ip => {
		const data = nodes[ip];
		displayNode(ip, data, list);
	});
}

function utilityButtons(content: HTMLElement) {
	const wrapper = document.createElement("div");
	content.appendChild(wrapper);
	wrapper.classList.add("util-buttons");

	const add_button = document.createElement("button");
	wrapper.appendChild(add_button);
	add_button.innerText = "+";
}

function mainView(content: HTMLElement) {
	document.body.dataset.view = "main";
	void import("./layout.css");

	void populateNodes(content);

	utilityButtons(content);
}

export default mainView;
