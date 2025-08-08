import bcrypt from 'bcrypt';
import AppError from "../errorHelpers/AppError";
import  httpStatus  from 'http-status-codes';
import { User } from "../modules/user/user.model";
import { IUser } from "../modules/user/user.interface";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../utils/user.tokens";




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
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
    return { accessToken: newAccessToken }  
      
};

export const authService =  {
    credentialsLogin,
    getNewAccessToken
}