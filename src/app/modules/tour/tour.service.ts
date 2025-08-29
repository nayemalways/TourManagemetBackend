import  StatusCodes  from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { createSlug } from "../../utils/slugGenerator";
import { Request } from "express";



 //============TOUR TYPE SERVICE
// CREATE TOUR TYPE
const createTourType = async (payload: ITourType) => {
    const TourTypes = await TourType.create(payload);
    return TourTypes;
}

// READ ALL TOUR TYPES
const getTourType = async () => {
    const TourTypes = await TourType.find().lean();
    return TourTypes;
}

// UPDATE A TOUR TYPE
const updateTourType = async (tourTypeId: string, payload: ITourType) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");

    Object.assign(isTourType, payload);
    const update = await isTourType.save();
    return update;
}

// DELETE A TOUR TYPE
const deleteTourType = async (tourTypeId: string) => { 
    const isTourType = await TourType.findOne({_id: tourTypeId});
    if(!isTourType) 
        return new AppError(StatusCodes.BAD_REQUEST, "Tour Type Doesn't Exist!");
 
    const tourTypes = await TourType.findOneAndDelete({_id: tourTypeId})
    return tourTypes;
}

//================TOUR SERVICE=======================
// CREATE TOUR
const createTour = async (payload: ITour) => {
    const tour = await Tour.create(payload);
    return tour;
}

//GET ALL TOUR
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const retriveAllTours = async (req: Request) => {
    const tour = await Tour.find({})
        .lean()
        .populate({path: "division", select: "name slug"})
        .populate({path: "tourType", select: "name"});
    return tour;
}

// UPDATE TOUR
const updateTours = async (tourId: string, payload: Partial<ITour>) => {

    const isTour = await Tour.findOne({_id: tourId});
    if(!isTour) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Tour not found!");
    }

    if(payload.title) {
        const updateSlug = createSlug(payload.title);
        payload.slug = updateSlug;
    }

    Object.assign(isTour, payload);
    const updateTour = await isTour.save();
    return updateTour;
}

// DELETE A TOUR
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