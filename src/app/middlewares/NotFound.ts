import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

export const NotFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        message: "No Route Found"
    })
}