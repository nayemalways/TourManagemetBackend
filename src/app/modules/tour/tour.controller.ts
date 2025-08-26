/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { tourTypeServices } from "./tour.service";
import { SendResponse } from "../../utils/SendResponse";
import  httpStatus  from 'http-status-codes';


const createTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourTypeServices.createTourType(req.body);

    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour type created!",
        data: tourTypes
    })
})

const getTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourTypeServices.getTourType();

    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour type retrived successful!",
        data: tourTypes
    })
})


const updateTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.updateTourType(tourTypeId, req.body);
    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour type updated!",
        data: tourTypes
    })
})



const deleteTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.deleteTourType(tourTypeId);
    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour type deleted!",
        data: tourTypes
    })
})


export const tourControllers = {
    createTourType,
    getTourType,
    updateTourType,
    deleteTourType
}