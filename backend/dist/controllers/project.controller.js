"use strict";
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
const BaseController_1 = __importDefault(require("./base/BaseController"));
class ProjectController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.rate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { externalID = "" } = req === null || req === void 0 ? void 0 : req.params;
            const { name, ownerName, comment, difficultyLevel, rating, userId } = req === null || req === void 0 ? void 0 : req.body;
            let project;
            if (!externalID) {
                res.status(400).send({
                    status: "400",
                    message: "Please send a project ID"
                });
            }
            try {
                this.connect();
                project = yield this.prisma.project.findUnique({
                    where: {
                        projectId: externalID
                    },
                    select: {
                        id: true
                    }
                });
            }
            catch (error) {
                res.status(401).send({
                    status: "failure",
                    message: "rate unsuccessful",
                    error: error.message
                });
                this.disconnect();
                return;
            }
            const postRate = () => __awaiter(this, void 0, void 0, function* () {
                yield this.prisma.comment.create({
                    data: { comment, difficultyLevel, rating, userId, projectId: project === null || project === void 0 ? void 0 : project.id }
                });
                res.status(201).send({
                    status: 201,
                    message: "Project rated sucessfully"
                });
                this.disconnect();
                return;
            });
            if (project === null || project === void 0 ? void 0 : project.id) {
                try {
                    yield postRate();
                }
                catch (error) {
                    this.disconnect();
                    res.status(401).send({
                        status: 401,
                        message: "Project rated unsucessfully",
                        error: error.message
                    });
                    return;
                }
            }
            else {
                try {
                    project = yield this.prisma.project.create({
                        data: {
                            name,
                            ownerName,
                            projectId: externalID
                        }
                    });
                    yield postRate();
                }
                catch (error) {
                    this.disconnect();
                    res.status(401).send({
                        status: 401,
                        message: "Project rated unsucessfully",
                        error: error.message
                    });
                }
            }
        });
        this.getRatings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { externalID = "" } = req === null || req === void 0 ? void 0 : req.params;
            const { name, ownerName } = req === null || req === void 0 ? void 0 : req.query;
            let project;
            if (!externalID) {
                res.status(400).send({
                    status: "400",
                    message: "Please send a project ID"
                });
            }
            try {
                this.connect();
                project = yield this.prisma.project.findUnique({
                    where: {
                        projectId: externalID
                    },
                    select: {
                        id: true,
                        comments: {
                            select: {
                                id: true,
                                comment: true,
                                rating: true,
                                difficultyLevel: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (project === null || project === void 0 ? void 0 : project.id) {
                    if (((_a = project === null || project === void 0 ? void 0 : project.comments) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                        res.status(200).send({
                            status: 200,
                            message: "No comments",
                            comments: []
                        });
                        this.disconnect();
                        return;
                    }
                    const averageRating = yield this.prisma.comment.aggregate({
                        _avg: {
                            rating: true,
                        },
                        where: {
                            projectId: project === null || project === void 0 ? void 0 : project.id
                        },
                    });
                    const groupByDifficulty = yield this.prisma.comment.groupBy({
                        by: ['difficultyLevel'],
                        where: {
                            projectId: project === null || project === void 0 ? void 0 : project.id
                        },
                        _count: {
                            rating: true
                        },
                    });
                    res.status(200).send({
                        status: 200,
                        message: "comments",
                        comments: project === null || project === void 0 ? void 0 : project.comments,
                        averageRating: averageRating,
                        difficulty: groupByDifficulty
                    });
                    this.disconnect();
                }
                else {
                    project = yield this.prisma.project.create({
                        data: {
                            name,
                            ownerName,
                            projectId: externalID
                        }
                    });
                    res.status(201).send({
                        status: 201,
                        message: "No comments"
                    });
                    this.disconnect();
                }
            }
            catch (error) {
                this.disconnect();
                res.status(401).send({
                    status: 401,
                    message: "Unable to fetch comments",
                    error: error.message
                });
            }
        });
        this.updateComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentID } = req === null || req === void 0 ? void 0 : req.params;
            console.log("commentID", commentID);
            let data = req === null || req === void 0 ? void 0 : req.body;
            data === null || data === void 0 ? true : delete data.userId;
            data === null || data === void 0 ? true : delete data.name;
            data === null || data === void 0 ? true : delete data.ownerName;
            try {
                this.connect();
                const comment = yield this.prisma.comment.update({
                    where: {
                        id: parseInt(commentID),
                    },
                    data: Object.assign({}, data)
                });
                res.status(200).send({
                    status: 200,
                    message: "comment updated successfully",
                    comment: comment
                });
                this.disconnect();
            }
            catch (error) {
                this.disconnect();
                res.status(401).send({
                    status: 401,
                    message: "Unable to update comment",
                    error: error.message
                });
            }
        });
    }
}
exports.default = new ProjectController();
//# sourceMappingURL=project.controller.js.map