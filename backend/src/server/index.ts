import express, { Router } from 'express';
import cors from 'cors';
import compression from 'compression';
import app from './app'
import { Routes } from '../routes/api/v1';

class Server {
    public app: express.Application
    routes: Router

    constructor() {
        this.app = app
        this.routes = new Routes().getRoutes()
        this.config()
        this.addRoutes()
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 3000)
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(compression())
        this.app.use(cors())
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('API is running at http://localhost:%d', this.app.get('port'))
        })
    }

    public addRoutes(): void {
        this.app.get("/health", (req, res) => {
            res.send({
                status: 200,
                message: "Works fine"
            })
        })
        this.app.use("/api/v1/", this.routes);
    }

}

const server = new Server()

server.start()