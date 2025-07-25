import getHash from "../../util/hash";
import initCpufreq from "./initializers/cpufreq/main";
import initCpuhist from "./initializers/cpuhist";
import initLoadavg from "./initializers/loadavg/main";
import initMemory from "./initializers/memory";
import initOS from "./initializers/os";
import registerDeinit from "../../deinit";
import showData from "./visualizer";

import "./node.css";

interface Collectors {
	collectors: string[];
}

let socket: WebSocket;
const collectors: string[] = [];

/*
 * prefixes: ! indicates no automatic updates after init
 *           * indicates no backend collector; never queries WS for data
 * tl;dr we use completely random symbols to indicate separate collector types
 * [todo] dynamically find list of collectors (OOP?)
 */

const INIT_COLLECTORS = [
	"!os", "loadavg", "cpufreq", "*cpuhist", "memory", "!disks", "!net",
	"!graphics"
];

function createBackButton(content: HTMLElement) {
	const button = document.createElement("button");
	content.appendChild(button);
	button.innerText = "\u00d7";
	button.classList.add("back-button");
	button.addEventListener("mouseup", () => document.location.hash = "");
}

function createContainer(id: string, parent: HTMLElement) {
	const container = document.createElement("div");
	parent.appendChild(container);
	container.classList.add("collector");
	container.id = "collector-" + id;
}

async function getCollectors(node: string): Promise<string[]> {
	const url = `/api/${node}/collectors`;
	const request = await fetch(url);
	const data = await request.json() as Collectors;

	return data.collectors;
}

async function initializeSocket(node: string) {
	const url = `/api/${node}/data`;
	socket = new WebSocket(url);

	socket.addEventListener("message", (message: { data?: string }) => {
		const { data } = message;
		if (!data) return;

		const separator = data.indexOf(" ");
		const id = data.slice(0, separator);

		showData(id, data.slice(separator + 1));
	});

	registerDeinit(() => {
		socket.close();
	});

	return new Promise(resolve => {
		socket.addEventListener("open", resolve);
	});
}

function refreshData(ids?: string[]) {
	(ids ?? collectors).forEach(id => {
		if (id.startsWith("*")) return;
		socket.send(id);
	});
}

async function nodeView(content: HTMLElement) {
	document.body.dataset.view = "node";

	createBackButton(content);

	const node = getHash();
	const all_collectors = await getCollectors(node);

	await initializeSocket(node);
	refreshData(all_collectors);

	INIT_COLLECTORS.forEach(collector => {
		if (collector.startsWith("*") || all_collectors.includes(collector)) {
			createContainer(collector, content);
		}
	});

	initOS();
	initLoadavg();
	initCpufreq();
	initCpuhist();
	initMemory();

	all_collectors.forEach(id => {
		if (id.startsWith("!") || id.startsWith("*")) return;
		collectors.push(id);
	});

	const interval = setInterval(refreshData, 1000);
	registerDeinit(() => {
		clearInterval(interval);
	});
}

export default nodeView;
