import express from 'express';

class AppServer {
    public app: express.Application

    constructor() {
        this.app = express()
    }

    getApp() : express.Application {
        return this.app
    }
}

const server = new AppServer();

export default server.getApp()