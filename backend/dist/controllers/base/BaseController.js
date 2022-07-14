"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
class BaseController {
    constructor() {
        const { disconnect, prisma, connect } = db_1.getPrismaClient();
        this.connect = connect;
        this.disconnect = disconnect;
        this.prisma = prisma;
    }
}
exports.default = BaseController;
//# sourceMappingURL=BaseController.js.map