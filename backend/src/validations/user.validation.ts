import * as Joi from "joi";
import * as passwordComplexity from 'joi-password-complexity';

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: passwordComplexity.default(),
    repeat_password: Joi.ref('password'),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
})

interface IUser {
    name: string,
    password: string,
    repeat_password: string,
    email: string,
    username: string
}

class UserValidation {
    user : IUser
    constructor(user: IUser) {
        this.user = user
    }

    validate() : any{
        const { error } = userSchema.validate(this.user)
        return error;
    }

}

export default UserValidation;