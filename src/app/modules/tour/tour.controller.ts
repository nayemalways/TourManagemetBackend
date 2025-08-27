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
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour type retrived successful!",
        data: tourTypes
    })
})


const updateTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.updateTourType(tourTypeId, req.body);
    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour type updated!",
        data: tourTypes
    })
})


const deleteTourType =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const tourTypes = await tourTypeServices.deleteTourType(tourTypeId);
    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour type deleted!",
        data: tourTypes
    })
})


const createTour =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourTypeServices.createTour(req.body);

    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour created successful!",
        data: tour
    })
})

const retriveAllTours =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourTypeServices.retriveAllTours(req);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Retrive successful!",
        data: tour
    })
})

const updateTours =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourTypeServices.updateTours(req.params.id, req.body);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour update successful!",
        data: tour
    })
})

const deleteTours =  CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourTypeServices.deleteTours(req.params.id);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour delete successful!",
        data: tour
    })
})


export const tourControllers = {
    createTourType,
    getTourType,
    updateTourType,
    deleteTourType,
    createTour,
    retriveAllTours,
    updateTours,
    deleteTours
}