"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os_1 = require("./os");
const string_1 = require("@labstat/util/string");
function parseProcFile() {
    /**
     * Parses data from /proc/meminfo.
     *
     * Although the file specifies the kilobyte (kB) unit for the data, most
     * systems in fact display data in kibibytes (KiB).
     */
    const file = (0, fs_1.readFileSync)("/proc/meminfo");
    const data = {
        Buffers: 0,
        Cached: 0,
        MemAvailable: 0,
        MemTotal: 0,
        Shmem: 0,
        SReclaimable: 0
    };
    file.toString().split("\n").forEach(line => {
        const separator_index = line.indexOf(":");
        if (separator_index === -1)
            return;
        const key = (0, string_1.stripGreedyFirstLast)(line.slice(0, separator_index), " ");
        const value = (0, string_1.stripGreedyFirstLast)(line.slice(separator_index + 1), " ");
        data[key] = parseInt(value) * 1024;
    });
    const free = data.MemFree;
    const total = data.MemTotal;
    const buffers = data.Buffers;
    const adjusted_cached = data.Cached - data.Shmem;
    const cache = adjusted_cached + data.SReclaimable;
    const active = total - free - buffers - cache;
    return { active, buffers, cache, free, total };
}
class Memory {
    id = "memory";
    getData() {
        if (!(0, os_1.isLinux)() || !(0, fs_1.existsSync)("/proc/meminfo"))
            return {};
        const proc_data = parseProcFile();
        return proc_data;
    }
}
exports.default = Memory;
//# sourceMappingURL=memory.js.map