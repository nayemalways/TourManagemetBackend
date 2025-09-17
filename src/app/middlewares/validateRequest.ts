/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validateRequest =
  (ZodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (error) {
          return res
            .status(400)
            .json({ success: false, message: 'Invalid Form-data formate' });
        }
      }

      req.body = await ZodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
