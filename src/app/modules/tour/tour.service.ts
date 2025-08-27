import  StatusCodes  from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { createSlug } from "../../utils/slugGenerator";
import { Request } from "express";

 

const createTourType = async (payload: ITourType) => {
    const TourTypes = await TourType.create(payload);
    return TourTypes;
}

const getTourType = async () => {
    const TourTypes = await TourType.find().lean();
    return TourTypes;
}

const updateTourType = async (tourTypeId: string, payload: ITourType) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");

    Object.assign(isTourType, payload);
    const update = await isTourType.save();
    return update;
}

const deleteTourType = async (tourTypeId: string) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");
 
    const tourTypes = await TourType.findOneAndDelete({_id: tourTypeId})
    return tourTypes;
}

const createTour = async (payload: ITour) => {

    const titleSlug =createSlug(payload.title);
    payload.slug = titleSlug;

    const tour = await Tour.create(payload);
    return tour;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const retriveAllTours = async (req: Request) => {
    const tour = await Tour.find({})
        .lean()
        .populate({path: "division", select: "name slug"})
        .populate({path: "tourType", select: "name"});
    return tour;
}


const updateTours = async (tourId: string, payload: Partial<ITour>) => {

    const isTour = await Tour.findOne({_id: tourId});
    if(!isTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour doesn't exist!");
    }

    if(payload.title) {
        const updateSlug = createSlug(payload.title);
        payload.slug = updateSlug;
    }

    Object.assign(isTour, payload);
    const updateTour = await isTour.save();
    return updateTour;
}


const deleteTours = async (tourId: string) => {

    const isTour = await Tour.findOne({_id: tourId});
    if(!isTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour doesn't exist!");
    }

    const updateTour = await Tour.findOneAndDelete({_id: tourId});
    return updateTour;
}



export const tourTypeServices = {
    createTourType,
    getTourType,
    updateTourType,
    deleteTourType,
    createTour,
    retriveAllTours,
    updateTours,
    deleteTours
}