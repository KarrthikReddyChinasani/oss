"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_util_1 = __importDefault(require("../utils/user.util"));
const BaseController_1 = __importDefault(require("./base/BaseController"));
const jwt = __importStar(require("jsonwebtoken"));
const user_validation_1 = __importDefault(require("../validations/user.validation"));
class AuthController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { username, password } = req.body;
            let user;
            if (!(username && password)) {
                res.status(400).send({
                    status: "400",
                    message: "Username or password is empty"
                });
            }
            try {
                this.connect();
                const users = yield this.prisma.user.findMany({
                    where: {
                        OR: [
                            {
                                username: {
                                    contains: `${username}`
                                }
                            },
                            {
                                email: {
                                    contains: `${username}`
                                }
                            }
                        ]
                    }
                });
                this.disconnect();
                if (users.length > 0) {
                    user = users[0];
                    console.log("user", user);
                }
                else {
                    res.status(401).send();
                    return;
                }
            }
            catch (error) {
                res.status(401).send();
                this.disconnect();
            }
            const userUtil = new user_util_1.default();
            if (!userUtil.checkIfUnencryptedPasswordIsValid(password, user.password)) {
                res.status(401).send();
            }
            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
            delete user['password'];
            //Send the jwt in the response
            res.status(200).send({ user, token, message: "User logged in successfully" });
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_params = ["name", "password", "repeat_password", "email", "username"];
            let user = {};
            user_params.forEach(key => {
                user[key] = req.body[key];
            });
            const userValidation = new user_validation_1.default(user);
            let error = userValidation.validate();
            if (error) {
                res.status(500).send({ error: error, message: "Registration failed" });
            }
            const userUtil = new user_util_1.default();
            user['password'] = userUtil.hashPassword(user['password']);
            delete user['repeat_password'];
            console.log("here I am", user);
            try {
                this.connect();
                yield this.prisma.user.create({
                    data: Object.assign({}, user)
                });
                this.disconnect();
                res.status(201).send({ message: "Registration successful" });
            }
            catch (e) {
                this.disconnect();
                res.status(401).send({
                    error: e,
                    message: "Registration Failed"
                });
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map