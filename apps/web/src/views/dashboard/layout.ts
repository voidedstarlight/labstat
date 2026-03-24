import Graph from "./graph";
import type { NodeData } from "@labdata/util/api";

function mainView(content: HTMLElement) {
	document.body.dataset.view = "main";
	void import("./layout.css");

	// API call
	const data = [
		{
			capabilities: "B",
			intf: "bge1",
			ip: "10.20.1.1",
			name: "Test Device",
			description: "Description",
			children: [
				{
					capabilities: "BR",
					intf: "eth0",
					ip: "10.20.1.11",
					name: "Test Child",
					description: "Description",
					children: [ ]
				},
				{
					capabilities: "",
					intf: "eth0",
					ip: "10.20.1.33",
					name: "Test Child",
					description: "Description",
					children: [ ]
				},
				{
					capabilities: "BW",
					intf: "eth0",
					ip: "10.20.1.15",
					name: "Test Child",
					description: "Description",
					children: [ ]
				}
			]
		},
		{
			capabilities: "B",
			intf: "eth0",
			ip: "172.1.1.1",
			name: "Separate",
			description: "Description",
			children: [ ]
		}
	] as Array<NodeData>; // test data

	const graph = new Graph(content);
	graph.data(data);
}

export default mainView;
