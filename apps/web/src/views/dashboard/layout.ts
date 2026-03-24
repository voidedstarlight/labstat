import Graph from "./graph";

function mainView(content: HTMLElement) {
	document.body.dataset.view = "main";
	void import("./layout.css");

	const graph = new Graph(content);
	graph.add({name: "AAA", desc: "BBB"});
}

export default mainView;
