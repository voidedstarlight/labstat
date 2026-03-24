import Graph from "./graph";
import type { NodeData } from "@labdata/util/api";

function mainView(content: HTMLElement) {
	document.body.dataset.view = "main";
	void import("./layout.css");

	// API call

	const data = [
		{
			intf: "bge1",
			name: "Test Device",
			description: "Description",
			children: [
				{
					intf: "eth0",
					name: "Test Child",
					description: "Description",
					children: [ ]
				},
				{
					intf: "eth0",
					name: "Test Child",
					description: "Description",
					children: [ ]
				},
				{
					intf: "eth0",
					name: "Test Child",
					description: "Description",
					children: [ ]
				}
			]
		},
		{
			intf: "eth0",
			name: "Separate",
			description: "Description",
			children: [ ]
		}
	] as Array<NodeData>; // test data

	const graph = new Graph(content);
	graph.data(data);
}

export default mainView;
