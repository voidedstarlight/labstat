type deinit_func = () => void;
const deinit: deinit_func[] = [];

function registerDeinit(func: deinit_func) {
	deinit.push(func);
}

function deinitHandlers() {
	deinit.forEach(func => {
		func();
	});
}

function deinitPage() {
	deinitHandlers();
}

export default registerDeinit;
export { deinitPage };
