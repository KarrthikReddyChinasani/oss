import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

async function connect() {
    await prismaClient.$connect()
    // ... you will write your Prisma Client queries here
    //   const allUsers = await prisma.user.findMany()
    //   console.log(allUsers)
}

async function disconnect() {
    await prismaClient.$disconnect()
}

function getPrismaClient() {
    return {
        prisma: prismaClient,
        connect,
        disconnect
    };
}

export {
    getPrismaClient
}