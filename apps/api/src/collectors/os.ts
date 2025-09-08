import type Collector from "./base";
import figlet from "figlet";
import slant from "figlet/importable-fonts/Slant.js";
import { stripAllQuotes } from "../util/string";
import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";

figlet.parseFont("Slant", slant);

const PROCESS_PLATFORMS: Partial<Record<NodeJS.Platform, string>> = {
	aix: "AIX",
	android: "Android",
	darwin: "macOS",
	freebsd: "FreeBSD",
	openbsd: "OpenBSD",
	win32: "Windows"
};

interface OSInfo {
	os: string;
	kernel?: string;
	version?: string;
}

interface FullOSInfo extends OSInfo {
	ascii: string;
}

function generateAscii(text: string): Promise<string> {
	return new Promise(resolve => {
		figlet(text, { font: "Slant" }, (_: unknown, result?: string) => {
			resolve(result ?? "");
		});
	});
}

function parseLinuxRelease(
	lines: string[]
): [string, string] {
	const first = lines.at(0);

	if (!first) return ["", ""];
	const remainder = lines.slice(1);

	if (first.startsWith("NAME=")) {
		const text = first.slice(5);
		const os_name = stripAllQuotes(text);

		return [os_name, parseLinuxRelease(remainder)[1]];
	}

	if (first.startsWith("VERSION_ID=")) {
		const text = first.slice(11);
		const os_version = stripAllQuotes(text);

		return [parseLinuxRelease(remainder)[0], os_version];
	}

	return parseLinuxRelease(remainder);
}

function identifyOS(): OSInfo {
	const { platform } = process;
	const name = PROCESS_PLATFORMS[platform];

	if (name) return { os: name };
	if (platform !== "linux") return { os: "unknown" };

	const kernel = execSync("uname -r").toString().slice(0, -1);

	if (existsSync("/etc/os-release")) {
		const release = readFileSync("/etc/os-release").toString();
		const lines = release.split("\n");

		const [os_name, version] = parseLinuxRelease(lines);

		if (os_name) return {
			os: os_name,
			kernel,
			version
		};
	}

	return {
		os: "Linux",
		kernel
	};
}

function isWindows() {
	return process.platform === "win32";
}

function isLinux() {
	return process.platform === "linux";
}

class OS implements Collector {
	id = "!os";

	async getData(): Promise<FullOSInfo> {
		const data = identifyOS();
		const ascii = await generateAscii(data.os);

		return { ...data, ascii };
	}
}

export default OS;
export { isLinux, isWindows };
