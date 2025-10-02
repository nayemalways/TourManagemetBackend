/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { divisionServices } from './division.service';
import { SendResponse } from '../../utils/SendResponse';
import statusCode from 'http-status-codes';

// CREATE DIVISION
const createDivision = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const division = await divisionServices.createDivision(payload);
    SendResponse(res, {
      success: true,
      statusCode: statusCode.CREATED,
      message: 'Division Created Successful',
      data: division,
    });
  }
);

// READ ALL DIVISION
const getDivision = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionServices.getDivision();
    SendResponse(res, {
      success: true,
      statusCode: statusCode.OK,
      message: 'Division Retrieve Successful',
      data: division,
    });
  }
);

// UPDATED DIVISION
const updateDivision = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;
    // console.log(req.body)
    const payload = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const division = await divisionServices.updateDivision(divisionId, payload);
    SendResponse(res, {
      success: true,
      statusCode: statusCode.OK,
      message: 'Division Update Successful',
      data: division,
    });
  }
);

// DELETE DIVISION
const deleteDivision = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;
    const division = await divisionServices.deleteDivision(divisionId);
    SendResponse(res, {
      success: true,
      statusCode: statusCode.OK,
      message: 'Division Delete Successful',
      data: division,
    });
  }
);

// EXPORT DIVISION
export const divisionController = {
  createDivision,
  getDivision,
  updateDivision,
  deleteDivision,
};
