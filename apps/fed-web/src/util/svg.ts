function createSVGElement(tag: string): SVGElement {
	const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
	return element;
}

export default createSVGElement;
