import e, { Request, Response } from "express";
import BaseController from "./base/BaseController";

class ProjectController extends BaseController {
    rate = async (req: Request, res: Response) => {
        const { externalID = "" } = req?.params;
        const { name, ownerName, comment, difficultyLevel, rating, userId } = req?.body;
        let project: any;
        if (!externalID) {
            res.status(400).send({
                status: "400",
                message: "Please send a project ID"
            });
        }

        try {
            this.connect()
            project = await this.prisma.project.findUnique({
                where: {
                    projectId: externalID
                },
                select: {
                    id: true
                }
            });
        } catch (error) {
            res.status(401).send({
                status: "failure",
                message: "rate unsuccessful",
                error: error.message
            });
            this.disconnect();
            return;
        }

        const postRate = async () => {
            await this.prisma.comment.create({
                data: { comment, difficultyLevel, rating, userId, projectId: project?.id }
            })
            res.status(201).send({
                status: 201,
                message: "Project rated sucessfully"
            });
            this.disconnect()
            return;
        }

        if (project?.id) {
            try {
                await postRate();
            } catch (error) {
                this.disconnect();
                res.status(401).send({
                    status: 401,
                    message: "Project rated unsucessfully",
                    error: error.message
                });
                return;
            }
        } else {
            try {
                project = await this.prisma.project.create({
                    data: {
                        name,
                        ownerName,
                        projectId: externalID
                    }
                })
                await postRate();
            } catch (error) {
                this.disconnect();
                res.status(401).send({
                    status: 401,
                    message: "Project rated unsucessfully",
                    error: error.message
                });
            }

        }
    }

    getRatings = async (req: Request, res: Response) => {
        const { externalID = "" } = req?.params;
        const { name, ownerName } = req?.query;
        let project: any;
        if (!externalID) {
            res.status(400).send({
                status: "400",
                message: "Please send a project ID"
            });
        }
        try {
            this.connect();
            project = await this.prisma.project.findUnique({
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
            if (project?.id) {
                if (project?.comments?.length === 0) {
                    res.status(200).send({
                        status: 200,
                        message: "No comments",
                        comments: []
                    });
                    this.disconnect();
                    return;
                }
                const averageRating = await this.prisma.comment.aggregate({
                    _avg: {
                        rating: true,
                    },
                    where: {
                        projectId: project?.id
                    },
                });
                const groupByDifficulty = await this.prisma.comment.groupBy({
                    by: ['difficultyLevel'],
                    where: {
                        projectId: project?.id
                    },
                    _count: {
                        rating: true
                    },
                })
                res.status(200).send({
                    status: 200,
                    message: "comments",
                    comments: project?.comments,
                    averageRating: averageRating,
                    difficulty: groupByDifficulty
                });
                this.disconnect();
            } else {
                project = await this.prisma.project.create({
                    data: {
                        name,
                        ownerName,
                        projectId: externalID
                    }
                })
                res.status(201).send({
                    status: 201,
                    message: "No comments"
                });
                this.disconnect();
            }
        } catch (error) {
            this.disconnect();
            res.status(401).send({
                status: 401,
                message: "Unable to fetch comments",
                error: error.message
            });
        }
    }

    updateComment = async (req: Request, res: Response) => {
        const { commentID } = req?.params;
        console.log("commentID", commentID)
        let data = req?.body;
        delete data?.userId;
        delete data?.name;
        delete data?.ownerName;
        try {
            this.connect();
            const comment = await this.prisma.comment.update({
                where: {
                    id: parseInt(commentID),
                },
                data: {
                    ...data
                }
            })
            res.status(200).send({
                status: 200,
                message: "comment updated successfully",
                comment: comment    
            });
            this.disconnect();
        } catch(error) {
            this.disconnect();
            res.status(401).send({
                status: 401,
                message: "Unable to update comment",
                error: error.message
            });
        }
    }
}

export default new ProjectController();