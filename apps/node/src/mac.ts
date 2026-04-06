import { cmdExists } from "@labstat/util/shell";
import { exec } from "child_process";

interface Device {
	intf: string;
	ip: string;
	mac: string;
}

class MAC {
	arp_active = false;
	ndp_active = false;

	constructor() {
		this.arp_active = cmdExists("arp");
		this.ndp_active = cmdExists("ndp");

		if (!this.arp_active) console.warn("[MAC] no arp");
		if (!this.ndp_active) console.warn("[MAC] no ndp");
	}

	updateARP() {
		return new Promise(resolve => {
			exec("arp -an", (err: unknown, stdout: string, stderr: string) => {
				if (err) {
					console.warn("[ARP] command error");
					console.warn(err);
					resolve([]);
					return;
				}

				if (stderr) {
					console.warn("[ARP] " + stderr);
					resolve([]);
					return;
				}

				const devices: Array<Device> = [];

				stdout.split("\n").forEach(line => {
					devices.push({
						intf: line,
						ip: "a",
						mac: "a"
					});
				});
			});
		});
	}
}

export default MAC;
