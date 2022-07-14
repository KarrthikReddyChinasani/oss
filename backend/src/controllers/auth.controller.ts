import e, { Request, Response } from "express";
import UserUtil from "../utils/user.util";
import BaseController from "./base/BaseController";
import * as jwt from "jsonwebtoken";
import UserValidation from "../validations/user.validation";
import { prisma } from "@prisma/client";

class AuthController extends BaseController {

    login = async (req: Request, res: Response) => {
        let { username, password } = req.body;
        let user: any
        if (!(username && password)) {
            res.status(400).send({
                status: "400",
                message: "Username or password is empty"
            });
        }

        try {
            this.connect()
            const users = await this.prisma.user.findMany({
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
                    }]
                }
            });
            this.disconnect()
            if(users.length > 0) {
                user = users[0];
                console.log("user", user)
            } else {
                res.status(401).send();
                return;
            }
            
        } catch (error) {
            res.status(401).send();
            this.disconnect()
        }

        const userUtil = new UserUtil()

        if (!userUtil.checkIfUnencryptedPasswordIsValid(password, user.password)) {
            res.status(401).send();
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRE_TIME }
        );

        delete user['password']
        //Send the jwt in the response
        res.status(200).send({ user, token, message: "User logged in successfully" });

    }

    register = async (req: Request, res: Response) => {
        const user_params = ["name", "password", "repeat_password", "email", "username"] as string[]
        let user: any = {}
        user_params.forEach(key => {
            user[key] = req.body[key]
        })
        const userValidation = new UserValidation(user)
        let error: any = userValidation.validate()
        if (error) {
            res.status(500).send({ error: error, message: "Registration failed" });
        }

        const userUtil = new UserUtil()
        user['password'] = userUtil.hashPassword(user['password'])
        delete user['repeat_password']
        console.log("here I am", user)
        try {
            this.connect()
            await this.prisma.user.create({
                data: { ...user }
            })
            this.disconnect()
            res.status(201).send({ message: "Registration successful" });
        } catch (e) {
            this.disconnect()
            res.status(401).send({
                error: e,
                message: "Registration Failed"
            });
        }

    }
}

export default new AuthController();