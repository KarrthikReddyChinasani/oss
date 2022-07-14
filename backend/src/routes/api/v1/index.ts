import express, { Router } from 'express'
import { AuthRoutes } from './auth.routes'
import { ProjectRoutes } from './project.routes'

export class Routes {
    router: Router
    
    constructor() {
        this.router = Router()
        this.addRoutes()
    }

    getRoutes(): Router {
       return this.router
    }

    addRoutes(): void {
        const authRoutes = new AuthRoutes()
        this.router.use("/auth", authRoutes.routes())
        this.router.use("/project", (new ProjectRoutes()).routes())
    }
}