import { deinitPage } from "./deinit";
import getHash from "@labstat/util/hash";
import mainView from "./views/dashboard/layout";
import nodeView from "./views/node/node";

import "./main.css";

function update() {
	deinitPage();

	if (document.getElementsByTagName("main").length) {
		document.getElementsByTagName("main").item(0)?.remove();
	}

	const content = document.createElement("main");
	document.body.appendChild(content);

	const route = getHash();

	if (!route) {
		mainView(content);
	} else {
		void nodeView(content);
	}
}

update();
window.addEventListener("hashchange", update);
