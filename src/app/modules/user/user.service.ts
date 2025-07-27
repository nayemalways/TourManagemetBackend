import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';


// Create User
 const CreateUserService = async (payload: Partial<IUser>) => {
    const { name, email } = payload;
    // IF USER EXIST RETURN FROM HERE
    const ExistingUser = await User.findOne({email});
    if(ExistingUser) {
         throw new AppError(httpStatus.CONFLICT, "User already exist by this email");
    } 

    // CREATE USER
    const user = await User.create({ name, email })
    return user;
}


const GetAllUser = async () => {
     const users= await User.find({});
     return users;
} 

export const UserService = {
    CreateUserService,
    GetAllUser
}