"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uptime = exports.Network = exports.Hostname = exports.Graphics = exports.Disks = void 0;
const child_process_1 = require("child_process");
const systeminformation_1 = require("systeminformation");
const os_1 = require("./os");
const os_2 = require("os");
class Disks {
    id = "!disks";
    getData() {
        return (0, systeminformation_1.diskLayout)();
    }
}
exports.Disks = Disks;
class Graphics {
    id = "!graphics";
    getData() {
        return (0, systeminformation_1.graphics)();
    }
}
exports.Graphics = Graphics;
class Network {
    id = "!net";
    getData() {
        return (0, os_2.networkInterfaces)();
    }
}
exports.Network = Network;
class Uptime {
    id = "uptime";
    getData() {
        return (0, os_2.uptime)() / 3600;
    }
}
exports.Uptime = Uptime;
class Hostname {
    id = "!hostname";
    getData() {
        const command = (0, os_1.isWindows)() ? "hostname" : "uname -n";
        const hostname = (0, child_process_1.execSync)(command).toString().slice(0, -1);
        return { hostname };
    }
}
exports.Hostname = Hostname;
//# sourceMappingURL=core.js.map