"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class AppServer {
    constructor() {
        this.app = express_1.default();
    }
    getApp() {
        return this.app;
    }
}
const server = new AppServer();
exports.default = server.getApp();
//# sourceMappingURL=app.js.map