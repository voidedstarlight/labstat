import { CPUFreq, LoadAvg } from "./collectors/cpu";
import Memory from "./collectors/memory";
import OS from "./collectors/os";
import type Collector from "./collectors/base";

import {
	Disks, Graphics, Hostname, Network, Uptime
} from "./collectors/core";

// eslint-disable-next-line @typescript-eslint/prefer-function-type
const all_collectors: { new(): Collector }[] = [
	CPUFreq, Disks, Graphics, Hostname, LoadAvg, Memory, Network, OS, Uptime
];

const active_collectors: Record<string, Collector | null> = {};

all_collectors.forEach(collector => {
	const instance = new collector();

	if (!instance.inactive) {
		active_collectors[instance.id] = instance;
	}
});

function activeCollectors(): string[] {
	return Object.keys(active_collectors);
}

async function getData(id: string): Promise<string> {
	const collector = active_collectors[id];

	if (collector) {
		return JSON.stringify(await collector.getData());
	}

	return "";
}

export { activeCollectors, getData };
