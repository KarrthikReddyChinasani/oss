import { Router } from 'express'
import { checkJwt } from "../../../middlewares/checkJwt";
import ProjectController from '../../../controllers/project.controller';

export class ProjectRoutes {
    router: Router
    constructor() {
        this.router = Router()
        this.addRoutes()
    }

    addRoutes(): void {
        this.router.post("/:externalID/rate", [checkJwt], ProjectController.rate);
        this.router.get("/:externalID", ProjectController.getRatings);
        this.router.put("/:externalID/comment/:commentID", ProjectController.updateComment);
    }

    routes(): Router {
        return this.router
    }
}
