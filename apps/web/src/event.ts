const listeners: Record<string, Array<() => void>> = {
	resize: []
};

window.addEventListener("resize", () => {
	listeners.resize.forEach(callback => {
		callback();
	});
});

function onResize(callback: () => void) {
	listeners.resize.push(callback);
}

export { onResize };
