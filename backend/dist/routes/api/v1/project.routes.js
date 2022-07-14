"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = require("express");
const checkJwt_1 = require("../../../middlewares/checkJwt");
const project_controller_1 = __importDefault(require("../../../controllers/project.controller"));
class ProjectRoutes {
    constructor() {
        this.router = express_1.Router();
        this.addRoutes();
    }
    addRoutes() {
        this.router.post("/:externalID/rate", [checkJwt_1.checkJwt], project_controller_1.default.rate);
        this.router.get("/:externalID", project_controller_1.default.getRatings);
        this.router.put("/:externalID/comment/:commentID", project_controller_1.default.updateComment);
    }
    routes() {
        return this.router;
    }
}
exports.ProjectRoutes = ProjectRoutes;
//# sourceMappingURL=project.routes.js.map