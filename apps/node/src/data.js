"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeCollectors = activeCollectors;
exports.getData = getData;
const cpu_1 = require("./collectors/cpu");
const memory_1 = __importDefault(require("./collectors/memory"));
const os_1 = __importDefault(require("./collectors/os"));
const core_1 = require("./collectors/core");
// eslint-disable-next-line @typescript-eslint/prefer-function-type
const all_collectors = [
    cpu_1.CPUFreq,
    core_1.Disks,
    core_1.Graphics,
    core_1.Hostname,
    cpu_1.LoadAvg,
    memory_1.default,
    core_1.Network,
    os_1.default,
    core_1.Uptime
];
const active_collectors = {};
all_collectors.forEach(collector => {
    const instance = new collector();
    if (!instance.inactive) {
        active_collectors[instance.id] = instance;
    }
});
function activeCollectors() {
    return Object.keys(active_collectors);
}
async function getData(id) {
    const collector = active_collectors[id];
    if (collector) {
        return JSON.stringify(await collector.getData());
    }
    return "";
}
//# sourceMappingURL=data.js.map