import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import  httpStatus  from 'http-status-codes';
import env from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...restRole: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        const verifyUser = verifyToken(accessToken as string, env.JWT_SECRET) as JwtPayload;
        
        // Verify user, if not verified sent error
        if(!verifyUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "Not Authorized");
        }

        // Checking is ADMIN and SUPER ADMIN role, if not sent error;
        if(!restRole.includes(verifyUser.role)) {
           throw new AppError(httpStatus.BAD_GATEWAY, "You are not permitted to access this route");
        }
        next()
        
    } catch (error) { next(error) }
}