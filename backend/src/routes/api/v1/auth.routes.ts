import { Router } from 'express'
import AuthController from '../../../controllers/auth.controller'

export class AuthRoutes {
    router: Router
    constructor() {
        this.router = Router()
        this.addRoutes()
    }

    addRoutes(): void {
        this.router.post("/login", AuthController.login)
        this.router.post("/register", AuthController.register)
    }

    routes(): Router {
        return this.router
    }
}
