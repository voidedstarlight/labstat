"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLinux = isLinux;
exports.isWindows = isWindows;
const figlet_1 = __importDefault(require("figlet"));
const Slant_js_1 = __importDefault(require("figlet/importable-fonts/Slant.js"));
const string_1 = require("@labstat/util/string");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
figlet_1.default.parseFont("Slant", Slant_js_1.default);
const PROCESS_PLATFORMS = {
    aix: "AIX",
    android: "Android",
    darwin: "macOS",
    freebsd: "FreeBSD",
    openbsd: "OpenBSD",
    win32: "Windows"
};
function generateAscii(text) {
    return new Promise(resolve => {
        (0, figlet_1.default)(text, { font: "Slant" }, (_, result) => {
            resolve(result ?? "");
        });
    });
}
function parseLinuxRelease(lines) {
    const first = lines.at(0);
    if (!first)
        return ["", ""];
    const remainder = lines.slice(1);
    if (first.startsWith("NAME=")) {
        const text = first.slice(5);
        const os_name = (0, string_1.stripAllQuotes)(text);
        return [os_name, parseLinuxRelease(remainder)[1]];
    }
    if (first.startsWith("VERSION_ID=")) {
        const text = first.slice(11);
        const os_version = (0, string_1.stripAllQuotes)(text);
        return [parseLinuxRelease(remainder)[0], os_version];
    }
    return parseLinuxRelease(remainder);
}
function identifyOS() {
    const { platform } = process;
    const name = PROCESS_PLATFORMS[platform];
    if (name)
        return { os: name };
    if (platform !== "linux")
        return { os: "unknown" };
    const kernel = (0, child_process_1.execSync)("uname -r").toString().slice(0, -1);
    if ((0, fs_1.existsSync)("/etc/os-release")) {
        const release = (0, fs_1.readFileSync)("/etc/os-release").toString();
        const lines = release.split("\n");
        const [os_name, version] = parseLinuxRelease(lines);
        if (os_name)
            return {
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
class OS {
    id = "!os";
    async getData() {
        const data = identifyOS();
        const ascii = await generateAscii(data.os);
        return { ...data, ascii };
    }
}
exports.default = OS;
//# sourceMappingURL=os.js.map