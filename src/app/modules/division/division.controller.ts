/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { divisonServices } from "./division.service";
import { SendResponse } from "../../utils/SendResponse";
import  statusCode  from 'http-status-codes';

const createDivision = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisonServices.createDivision(req.body);
    SendResponse(res, {
        success: true,
        statusCode: statusCode.CREATED,
        message: "Division Created Successful",
        data: division
    })
});

const getDivision = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisonServices.getDivision();
    SendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "Division Retrive Successful",
        data: division
    })
});


const updateDivision = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;
    const division = await divisonServices.updateDivision(divisionId, req.body);
    SendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "Division Update Successful",
        data: division
    })
});


const deleteDivision = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;
    const division = await divisonServices.deleteDivision(divisionId);
    SendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: "Division Delete Successful",
        data: division
    })
});

 export const divisionController = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
}