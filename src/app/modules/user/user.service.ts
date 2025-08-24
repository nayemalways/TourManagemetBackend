import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import  statusCode from 'http-status-codes';

// Create User
 const CreateUserService = async (payload: Partial<IUser>) => {
    const { email, ...rest } = payload;
    
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };
    const user = await User.create({ email, auths: [authProvider] , ...rest });
    return user;
}

// Get All Users
const GetAllUser = async () => {
     const users= await User.find({}).lean();
     return users;
} 

// Update Single User
const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    // Role Based Role Update
    if(payload?.role) {
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) 
            throw new AppError(statusCode.FORBIDDEN, "You are not permitted to change");
        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) 
            throw new AppError(statusCode.FORBIDDEN, "You are not permitted to change");
    }    
    // Active, Deleted and Verified based update
    if(payload.isActive || payload.isDeleted || payload.isVerified)
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) 
            throw new AppError(statusCode.FORBIDDEN, "You are not permitted to change");

    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        if(decodedToken.userId != userId) 
            throw new AppError(statusCode.FORBIDDEN, "You can only update your own profile");
    }


    // Update User
    const updatedUser = await User.findOneAndUpdate({_id: userId} , payload, {new: true, runValidators: true});
    return updatedUser;
}



export const UserService = {
    CreateUserService,
    GetAllUser,
    updateUserService
}