import { cmdExists } from "@labstat/util/shell";
import { exec } from "child_process";

interface Device {
	name: string;
	description: string;
}

interface RawOutput {
	lldp: Array<{
		interface: Array<{
			name: string;
			via: string;
			rid: string;
			age: string;
			chassis: Array<{
				id: Array<{
					type: string;
					value: string;
				}>;
				name: Array<{
					value: string;
				}>;
				descr: Array<{
					value: string;
				}>;
				capability: Array<{
					type: string;
					enabled: boolean;
				}>;
			}>;
			port: Array<{
				id: Array<{
					type: string;
					value: string;
				}>;
				descr: Array<{
					value: string;
				}>;
				ttl: Array<{
					value: string;
				}>;
			}>;
			vlan?: Array<{
				"vlan-id": string;
				pvid: boolean;
				value: string;
			}>;
		}>;
	}>;
}

class LLDP {
	resolved = false;
	#neighbors: Record<string, Device> = { };

	constructor() {
		this.resolved = cmdExists("lldpd");

		if (!this.resolved) {
			console.warn(
				"[LLDP] could not find lldpd executable for network mapping"
			);

			console.warn(
				"[LLDP] install with package manager and setuid of lldpdctl executable"
			);
		}
	}

	async update() {
		const output = await this.#parse() as RawOutput;

		if (output.lldp.length) {
			this.#neighbors = {};

			output.lldp[0].interface.forEach(data => {
				const [chassis] = data.chassis;

				this.#neighbors[data.name] = {
					name: chassis.name[0].value,
					description: chassis.descr[0].value
				};
			});
		}

		setTimeout(this.update.bind(this), 10000);
	}

	get() {
		return this.#neighbors;
	}

	async #parse() {
		return new Promise(resolve => {
			exec("lldpctl -f json0", (
				err: unknown, stdout: string, stderr: string
			) => {
				if (err) {
					console.warn("[LLDP] command failed");
					console.warn(err);
					resolve({});
					return;
				}

				if (stderr) {
					console.warn("[LLDP] " + stderr);
					resolve({});
					return;
				}

				try {
					resolve(JSON.parse(stdout) as RawOutput);
				} catch {
					console.warn("[LLDP] incorrect output");
					resolve({});
				}
			});
		});
	}
}

export default LLDP;
