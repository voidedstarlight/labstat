import { getNodes, type NodeOptions } from "../../api";

function displayNode(ip: string, data: NodeOptions, list: HTMLElement) {
	const container = document.createElement("node");
	container.addEventListener("click", () => {
		document.location.hash = ip;
	});
	list.appendChild(container);

	const header = document.createElement("header");
	container.appendChild(header);

	const title = document.createElement("h1");
	header.appendChild(title);
	title.innerText = data.name;

	const subtitle = document.createElement("subtitle");
	header.appendChild(subtitle);
	subtitle.innerText = ip;
}

async function populateNodes(list: HTMLElement) {
	const nodes = await getNodes();

	Object.keys(nodes).forEach(ip => {
		const data = nodes[ip];
		displayNode(ip, data, list);
	});
}

function mainView(content: HTMLElement) {
	document.body.dataset.view = "main";
	void import("./dashboard.css");

	void populateNodes(content);
}

export default mainView;
