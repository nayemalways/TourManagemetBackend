import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import  httpStatus  from 'http-status-codes';
import bcrypt from 'bcrypt';
import { IUser } from "../modules/user/user.interface";
import  envVar from '../../config/env'
import { generateToken } from "../utils/jwt";



const credentialsLogin = async (paylod : Partial<IUser>) => {
    const { email, password } = paylod;

    const isUserExists = await User.findOne({email});
    if(!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "No User Found");
    }

    // Matching Password
    const passwordMatch = bcrypt.compare(password as string, isUserExists.password as string);
    if(!passwordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Worng Password");
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role
    }

    // Jsonwebtoken
    const accessToken = generateToken(jwtPayload, envVar?.JWT_SECRET, envVar?.JWT_EXPIRATION);
    return { accessToken };
};

export const authService =  {
    credentialsLogin
}