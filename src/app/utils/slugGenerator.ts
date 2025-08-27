import AppError from "../errorHelpers/AppError";
import  httpStatus  from 'http-status-codes';

export const createSlug = (title: string) => {
    if(!title) {
         throw new AppError(httpStatus.BAD_REQUEST, "Title not found in Slug Generator");
    }
    const titleLowercase = title.toLowerCase();
    const n = titleLowercase.split(" ");
    const  slug = n.join("-")
    return slug;
}