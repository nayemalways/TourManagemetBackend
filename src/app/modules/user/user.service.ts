import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';


// Create User
 const CreateUserService = async (payload: Partial<IUser>) => {
    const { email, ...rest } = payload;
    const isUserExist = await User.findOne({email});

    if(isUserExist) {
         throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
    } 

//     const hashedPassword = await bcrypt.hash(password as string, 10);
    
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };
    const user = await User.create({ email, auths: [authProvider] , ...rest });
    return user;
}

// Get All Users
const GetAllUser = async () => {
     const users= await User.find({});
     return users;
} 

export const UserService = {
    CreateUserService,
    GetAllUser
}