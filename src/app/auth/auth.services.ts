import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import  httpStatus  from 'http-status-codes';
import bcrypt from 'bcrypt';
import { IsActive, IUser } from "../modules/user/user.interface";
import { createUserTokens } from "../utils/user.tokens";
import { generateToken, verifyToken } from "../utils/jwt";
import env from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



const credentialsLogin = async (paylod : Partial<IUser>) => {
    const { email, password } = paylod;

    const isUserExists = await User.findOne({email}, {createdAt: 0, updatedAt: 0});
    if(!isUserExists) throw new AppError(httpStatus.BAD_REQUEST, "No User Found");

    // Matching Password
    const passwordMatch = await bcrypt.compare(password as string, isUserExists.password as string);
    if(!passwordMatch) throw new AppError(httpStatus.BAD_REQUEST, "Worng Password");
    
    const userToken = await createUserTokens(isUserExists);

     // Hiding password for response
    const user = isUserExists.toObject();
    delete user.password;

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user
     };
};


const getNewAccessToken = async (refreshToken: string) => {
     
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
    return {
        accessToken
    } // return access token;
      
};

export const authService =  {
    credentialsLogin,
    getNewAccessToken
}