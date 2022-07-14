import * as bcrypt from "bcryptjs";

class UserUtil {

    hashPassword(password: string) {
        return bcrypt.hashSync(password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, encryptedPassword);
    }

}

export default UserUtil;