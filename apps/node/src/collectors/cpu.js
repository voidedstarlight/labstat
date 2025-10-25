"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadAvg = exports.CPUFreq = void 0;
const shell_1 = require("@labstat/util/shell");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("./os");
const os_2 = require("os");
const number_1 = require("@labstat/util/number");
function invokeSysctl(name) {
    try {
        const output = (0, child_process_1.execSync)(`sysctl ${name}`).toString();
        const separator_index = output.indexOf(":");
        if (separator_index === -1)
            return;
        return output.slice(separator_index + 2, -1);
    }
    catch {
        console.warn("[collectors/cpu] error in calling sysctl, data may be incomplete");
        return;
    }
}
class LoadAvg {
    id = "loadavg";
    inactive = false;
    constructor() {
        if ((0, os_1.isWindows)()) {
            this.inactive = true;
        }
    }
    getData() {
        /**
         * Retrieve loadavg triplet using the os module.
         *
         * Many BSD systems return results with over 10 decimal places, so re-round
         * each value to 2 decimals.
         */
        const [avg_1, avg_5, avg_15] = (0, os_2.loadavg)();
        return [
            (0, number_1.round)(avg_1, 2),
            (0, number_1.round)(avg_5, 2),
            (0, number_1.round)(avg_15, 2)
        ];
    }
}
exports.LoadAvg = LoadAvg;
class CPUFreq {
    id = "cpufreq";
    inactive = false;
    #n_cpus = 0;
    #hasSysctl = false;
    #hasSysDevices = false;
    constructor() {
        /**
         * Determine which method of getting the CPU frequency is best.
         *
         * The sysctl command can only get cpu information on some BSD systems,
         * even though a command with the same name exists on Linux.
         */
        void this.#methodExists().then(exists => {
            if (!exists) {
                this.inactive = true;
                return;
            }
            this.#n_cpus = parseInt((0, child_process_1.execSync)("getconf _NPROCESSORS_ONLN").toString());
        });
    }
    getData(index = 0) {
        if (index > this.#n_cpus - 1)
            return [];
        let data = 0;
        if (this.#hasSysDevices)
            data = this.#getDataLinux(index);
        if (this.#hasSysctl)
            data = this.#getDataBSD(index);
        return [data, ...this.getData(index + 1)];
    }
    async #methodExists() {
        if ((0, os_1.isWindows)())
            return false;
        if ((0, os_1.isLinux)() && (0, fs_1.existsSync)("/sys/devices/system/cpu")) {
            this.#hasSysDevices = true;
            return true;
        }
        else if ((0, shell_1.cmdExists)("sysctl")
            && await (0, shell_1.cmdExitCode)("sysctl dev.cpu") === 0) {
            this.#hasSysctl = true;
            return true;
        }
        return false;
    }
    #getDataBSD(index) {
        /**
         * Calls the BSD sysctl command to find CPU frequencies.
         */
        const name = `dev.cpu.${index.toString()}.freq`;
        const data = invokeSysctl(name);
        if (!data)
            return 0;
        // Frequencies are returned in MHz by sysctl, so convert them to Hz.
        return parseInt(data) * 1000;
    }
    #getDataLinux(index) {
        /**
         * Reads data from /sys/devices/system/cpu for CPU frequencies.
         */
        const path = (`/sys/devices/system/cpu/cpu${index.toString()}/cpufreq`
            + "/scaling_cur_freq");
        if (!(0, fs_1.existsSync)(path))
            return 0;
        const data = (0, fs_1.readFileSync)(path).toString();
        return parseInt(data) * 1000;
    }
}
exports.CPUFreq = CPUFreq;
//# sourceMappingURL=cpu.js.map