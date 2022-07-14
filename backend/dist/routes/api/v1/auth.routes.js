"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../../controllers/auth.controller"));
class AuthRoutes {
    constructor() {
        this.router = express_1.Router();
        this.addRoutes();
    }
    addRoutes() {
        this.router.post("/login", auth_controller_1.default.login);
        this.router.post("/register", auth_controller_1.default.register);
    }
    routes() {
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.routes.js.map