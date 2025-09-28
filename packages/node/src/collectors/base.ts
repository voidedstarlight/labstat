interface Collector {
	getData: () => unknown;
	id: string;
	inactive?: boolean;
	new?: () => this;
}

export default Collector;
