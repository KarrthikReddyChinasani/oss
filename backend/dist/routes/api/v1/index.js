"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const project_routes_1 = require("./project.routes");
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.addRoutes();
    }
    getRoutes() {
        return this.router;
    }
    addRoutes() {
        const authRoutes = new auth_routes_1.AuthRoutes();
        this.router.use("/auth", authRoutes.routes());
        this.router.use("/project", (new project_routes_1.ProjectRoutes()).routes());
    }
}
exports.Routes = Routes;
//# sourceMappingURL=index.js.map