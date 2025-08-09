import { JwtPayload } from "jsonwebtoken";
import env from "../../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import  httpStatus  from 'http-status-codes';


export const createUserTokens = async (user: Partial<IUser>) => {
    const jwtPayload = {
            userId: user?._id,
            email: user?.email,
            role: user?.role
        }
    
        // Jsonwebtoken
        const accessToken = generateToken(jwtPayload, env?.JWT_SECRET, env?.JWT_EXPIRATION);
        const refreshToken = generateToken(jwtPayload, env?.JWT_REFRESH_SECRET, env?.JWT_REFRESH_EXPIRATION);

        return {
            accessToken,
            refreshToken
        }
}


export const createNewAccessTokenWithRefreshToken =  async (refreshToken: string) => {
    const tokenVerify = verifyToken(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    const isUserExists = await User.findOne({ email: tokenVerify.email }, {createdAt: 0, updatedAt: 0});

    if(!isUserExists) 
        throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exist");
    if(isUserExists.isActive === IsActive.BLOCKED || isUserExists.isActive === IsActive.INACTIVE ) 
        throw new AppError(httpStatus.BAD_REQUEST, "The User BLOCKED or INACTIVE");
    if(isUserExists.isDeleted )
        throw new AppError(httpStatus.BAD_REQUEST, "The user was DELETED");

    const jwtPayload = {
            userId: isUserExists?._id,
            email: isUserExists?.email,
            role: isUserExists?.role
    }
         
    const accessToken = generateToken(jwtPayload, env?.JWT_SECRET, env?.JWT_EXPIRATION);// Jsonwebtoken
    return accessToken;
}