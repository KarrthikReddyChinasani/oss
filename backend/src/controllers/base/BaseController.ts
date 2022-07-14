import { getPrismaClient } from "../../db";

class BaseController {
    disconnect : any
    prisma : any
    connect : any

    constructor () {
        const {disconnect, prisma, connect } = getPrismaClient()
        this.connect = connect
        this.disconnect = disconnect
        this.prisma = prisma
    }
}

export default BaseController;