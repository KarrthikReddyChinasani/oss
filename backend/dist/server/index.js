"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const app_1 = __importDefault(require("./app"));
const v1_1 = require("../routes/api/v1");
class Server {
    constructor() {
        this.app = app_1.default;
        this.routes = new v1_1.Routes().getRoutes();
        this.config();
        this.addRoutes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(compression_1.default());
        this.app.use(cors_1.default());
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('API is running at http://localhost:%d', this.app.get('port'));
        });
    }
    addRoutes() {
        this.app.get("/health", (req, res) => {
            res.send({
                status: 200,
                message: "Works fine"
            });
        });
        this.app.use("/api/v1/", this.routes);
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=index.js.map